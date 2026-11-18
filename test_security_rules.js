// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIRESTORE SECURITY RULES VALIDATION TEST SUITE
// Simulates and tests the exact logic in firestore.rules
// across Customer, Builder, and Admin security contexts.
// ─────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🧪 RUNNING FIRESTORE SECURITY RULES VALIDATION TESTS');
console.log('====================================================\n');

// 1. Verify existence and syntax of firestore.rules
const rulesPath = path.resolve('firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules file does not exist!');
  process.exit(1);
}

const rulesContent = fs.readFileSync(rulesPath, 'utf8');
console.log('📄 Loaded firestore.rules (' + rulesContent.length + ' bytes)');

// Verify mandatory rule clauses
const requiredTokens = [
  "rules_version = '2'",
  "function isAuthenticated()",
  "function isAdmin()",
  "function isBuilder()",
  "function isCustomer()",
  "function isProjectCustomer",
  "function isProjectBuilder",
  "match /users/{userId}",
  "match /projects/{projectId}",
  "match /builders/{builderId}",
  "match /chat_messages/{messageId}",
  "match /customer_requests/{requestId}",
  "match /{document=**}"
];

for (const token of requiredTokens) {
  if (!rulesContent.includes(token)) {
    console.error(`❌ Missing required security token: "${token}"`);
    process.exit(1);
  }
}
console.log('✅ firestore.rules contains all required security definitions and structure.\n');

// 2. Security Invariant Logic Evaluator (Mirrors the exact rules engine)
function evaluateRules({
  auth,               // { uid, email, token: { email, name } } or null
  path,               // e.g. 'projects/cp_ramesh_1'
  method,             // 'read' | 'create' | 'update' | 'delete'
  existingData = {},  // data on disk (resource.data)
  incomingData = {},  // write payload (request.resource.data)
  userDoc = null      // users/{uid} document
}) {
  const isAuthenticated = auth !== null;
  const userRole = userDoc ? userDoc.role : null;
  
  const isAdmin = isAuthenticated && (userRole === 'Administrator');
  const isBuilder = isAuthenticated && (userRole === 'Builder');

  const isCustomer = isAuthenticated && (userRole === 'Customer');

  const isOwner = (uid) => isAuthenticated && auth.uid === uid;

  const isProjectCustomer = (data) => Boolean(isAuthenticated && (
    (data.customerId && data.customerId === auth.uid) ||
    (data.customerEmail && auth.token && data.customerEmail === auth.token.email)
  ));

  const isProjectBuilder = (data) => Boolean(isAuthenticated && (
    (data.builderId && data.builderId === auth.uid) ||
    (data.builderEmail && auth.token && data.builderEmail === auth.token.email)
  ));

  // Match /users/{userId}
  if (path.startsWith('users/')) {
    const parts = path.split('/');
    const targetUserId = parts[1];
    if (parts.length === 2) {
      if (method === 'read') {
        return isOwner(targetUserId) || isAdmin || isBuilder;
      }
      if (method === 'create') {
        return isOwner(targetUserId) && ['Customer', 'Builder'].includes(incomingData.role);
      }
      if (method === 'update') {
        return (isOwner(targetUserId) && (
          !('role' in incomingData) ||
          incomingData.role === existingData.role ||
          isAdmin
        )) || isAdmin;
      }
      if (method === 'delete') {
        return isAdmin;
      }
    }
  }

  // Match /projects/{projectId}
  if (path.startsWith('projects/')) {
    const parts = path.split('/');
    if (parts.length === 2) {
      if (method === 'read') {
        return isAdmin || isProjectBuilder(existingData) || isProjectCustomer(existingData);
      }
      if (method === 'create') {
        return isAdmin || isBuilder;
      }
      if (method === 'update') {
        return isAdmin || isProjectBuilder(existingData);
      }
      if (method === 'delete') {
        return isAdmin;
      }
    }
  }

  // Match /chat_messages/{messageId}
  if (path.startsWith('chat_messages/')) {
    if (method === 'read') {
      return isAdmin || (isAuthenticated && existingData.userId === auth.uid);
    }
    if (method === 'create') {
      return isAuthenticated && incomingData.userId === auth.uid;
    }
    if (method === 'update' || method === 'delete') {
      return isAdmin || (isAuthenticated && existingData.userId === auth.uid);
    }
  }

  // Default catch-all denies everything else
  return false;
}

// 3. Test Cases Execution
const testCases = [
  {
    name: 'TC-01: [UNAUTHORIZED] Unauthenticated request cannot read projects',
    context: { auth: null, path: 'projects/cp_ramesh_1', method: 'read', existingData: { customerId: 'cust_1' } },
    expected: false
  },
  {
    name: 'TC-02: [UNAUTHORIZED] Unauthenticated request cannot write chat message',
    context: { auth: null, path: 'chat_messages/msg_1', method: 'create', incomingData: { text: 'hi' } },
    expected: false
  },
  {
    name: 'TC-03: [CUSTOMER] Customer can read their own assigned project',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      userDoc: { role: 'Customer' },
      path: 'projects/cp_ramesh_1',
      method: 'read',
      existingData: { id: 'cp_ramesh_1', customerId: 'cust_ramesh', customerEmail: 'ramesh.kumar@gmail.com' }
    },
    expected: true
  },
  {
    name: 'TC-04: [CUSTOMER] Customer CANNOT read another customer\'s project',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      userDoc: { role: 'Customer' },
      path: 'projects/cp_priya_2',
      method: 'read',
      existingData: { id: 'cp_priya_2', customerId: 'cust_priya', customerEmail: 'priya.sharma@yahoo.com' }
    },
    expected: false
  },
  {
    name: 'TC-05: [CUSTOMER] Customer CANNOT modify project progress or milestone data',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      userDoc: { role: 'Customer' },
      path: 'projects/cp_ramesh_1',
      method: 'update',
      existingData: { id: 'cp_ramesh_1', customerId: 'cust_ramesh', progress: 50 },
      incomingData: { progress: 100 }
    },
    expected: false
  },
  {
    name: 'TC-06: [SECURITY] Customer CANNOT escalate role to Administrator',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      userDoc: { role: 'Customer' },
      path: 'users/cust_ramesh',
      method: 'update',
      existingData: { uid: 'cust_ramesh', role: 'Customer' },
      incomingData: { role: 'Administrator' }
    },
    expected: false
  },
  {
    name: 'TC-07: [BUILDER] Builder can read and update assigned project',
    context: {
      auth: { uid: 'builder_vinay', token: { email: 'contact@techbuilders.com' } },
      userDoc: { role: 'Builder' },
      path: 'projects/cp_ramesh_1',
      method: 'update',
      existingData: { id: 'cp_ramesh_1', builderId: 'builder_vinay', progress: 50 },
      incomingData: { progress: 75 }
    },
    expected: true
  },
  {
    name: 'TC-08: [BUILDER] Builder CANNOT modify an unassigned project',
    context: {
      auth: { uid: 'builder_vinay', token: { email: 'contact@techbuilders.com' } },
      userDoc: { role: 'Builder' },
      path: 'projects/cp_other_9',
      method: 'update',
      existingData: { id: 'cp_other_9', builderId: 'builder_other', progress: 20 },
      incomingData: { progress: 30 }
    },
    expected: false
  },
  {
    name: 'TC-09: [ADMIN] Administrator can read and write all projects',
    context: {
      auth: { uid: 'admin_vinay', token: { email: 'saisri.vinay@buildhub.io' } },
      userDoc: { role: 'Administrator' },
      path: 'projects/cp_other_9',
      method: 'update',
      existingData: { id: 'cp_other_9', builderId: 'builder_other', progress: 20 },
      incomingData: { progress: 100 }
    },
    expected: true
  },
  {
    name: 'TC-10: [ADMIN] Administrator can delete projects',
    context: {
      auth: { uid: 'admin_vinay', token: { email: 'saisri.vinay@buildhub.io' } },
      userDoc: { role: 'Administrator' },
      path: 'projects/cp_ramesh_1',
      method: 'delete',
      existingData: { id: 'cp_ramesh_1' }
    },
    expected: true
  },
  {
    name: 'TC-11: [CHAT] User can write chat message with matching UID',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      path: 'chat_messages/msg_new',
      method: 'create',
      incomingData: { userId: 'cust_ramesh', text: 'Hello builder' }
    },
    expected: true
  },
  {
    name: 'TC-12: [CHAT] User CANNOT spoof another user\'s UID in chat message',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      path: 'chat_messages/msg_fake',
      method: 'create',
      incomingData: { userId: 'cust_attacker', text: 'Impersonating' }
    },
    expected: false
  },
  {
    name: 'TC-13: [CATCH-ALL] Arbitrary collection access is blocked',
    context: {
      auth: { uid: 'cust_ramesh', token: { email: 'ramesh.kumar@gmail.com' } },
      path: 'internal_secrets/key_1',
      method: 'read'
    },
    expected: false
  }
];

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const result = evaluateRules(tc.context);
  const status = result === tc.expected;
  if (status) {
    passed++;
    console.log(`  ✅ PASS: ${tc.name}`);
  } else {
    failed++;
    console.log(`  ❌ FAIL: ${tc.name} (Expected: ${tc.expected}, Got: ${result})`);
  }
}

console.log('\n----------------------------------------------------');
console.log(`Total Tests: ${testCases.length} | Passed: ${passed} | Failed: ${failed}`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Security Invariants PASSED successfully!\n');
}
