import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  deleteUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBF1DQzIoecr4aHIJMI9QwNsiKc9my6Xr0",
  authDomain: "build-hub-5aa9e.firebaseapp.com",
  projectId: "build-hub-5aa9e",
  storageBucket: "build-hub-5aa9e.firebasestorage.app",
  messagingSenderId: "178050048946",
  appId: "1:178050048946:web:5a7051d9d5d2b0d2dc3aab"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const results = {};

async function runTests() {
  console.log('====================================================');
  console.log('BUILD HUB — REGISTRATION & REALTIME MANAGEMENT TESTS');
  console.log('====================================================\n');

  const testStamp = Date.now();
  const testBuilderEmail = `test_builder_${testStamp}@buildhubtest.io`;
  const testCustomerEmail = `test_customer_${testStamp}@buildhubtest.io`;
  const testPassword = 'TestPassword123!';

  let builderUser = null;
  let customerUser = null;

  // TEST 1: Register Builder in Firebase Auth
  try {
    const cred = await createUserWithEmailAndPassword(auth, testBuilderEmail, testPassword);
    builderUser = cred.user;
    results['1. Register new Builder in Firebase Auth'] = 'PASS';
    console.log('✔ Test 1 PASS: Builder account created with UID:', builderUser.uid);
  } catch (err) {
    results['1. Register new Builder in Firebase Auth'] = 'FAIL: ' + err.message;
    console.error('✖ Test 1 FAIL:', err.message);
  }

  // TEST 2: Save Builder profile to Firestore (builders and users collections)
  if (builderUser) {
    try {
      const builderProfile = {
        uid: builderUser.uid,
        fullName: 'Test Builder Corp',
        name: 'Test Builder Corp',
        email: testBuilderEmail,
        phone: '+91 9988776655',
        companyName: 'Apex Construction Labs',
        company: 'Apex Construction Labs',
        experience: 8,
        specialization: 'Commercial Infrastructure',
        location: 'Hyderabad',
        city: 'Hyderabad',
        licenseNo: `LIC-${testStamp}`,
        role: 'builder',
        accountStatus: 'pending',
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'builders', builderUser.uid), builderProfile);
      await setDoc(doc(db, 'users', builderUser.uid), builderProfile);

      // Verify Firestore persistence
      const snapB = await getDoc(doc(db, 'builders', builderUser.uid));
      const snapU = await getDoc(doc(db, 'users', builderUser.uid));

      if (snapB.exists() && snapU.exists() && snapB.data().verificationStatus === 'pending') {
        results['2. Builder Firestore Profile Saved & Verified'] = 'PASS';
        console.log('✔ Test 2 PASS: Builder profile stored in both builders and users collections');
      } else {
        results['2. Builder Firestore Profile Saved & Verified'] = 'FAIL: Record mismatch';
      }
    } catch (err) {
      results['2. Builder Firestore Profile Saved & Verified'] = 'FAIL: ' + err.message;
      console.error('✖ Test 2 FAIL:', err.message);
    }

    // TEST 3: Admin Approval Workflow (Update verificationStatus to Approved)
    try {
      const approvalPayload = {
        verificationStatus: 'Approved',
        accountStatus: 'active',
        reviewedBy: 'admin@buildhub.io',
        reviewedAt: serverTimestamp(),
        rejectionReason: '',
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'builders', builderUser.uid), approvalPayload);
      await updateDoc(doc(db, 'users', builderUser.uid), approvalPayload);

      const updatedSnap = await getDoc(doc(db, 'builders', builderUser.uid));
      if (updatedSnap.exists() && updatedSnap.data().verificationStatus === 'Approved' && updatedSnap.data().accountStatus === 'active') {
        results['3. Admin Approve Builder Status Update'] = 'PASS';
        console.log('✔ Test 3 PASS: Builder approval status updated to "Approved" with audit trail');
      } else {
        results['3. Admin Approve Builder Status Update'] = 'FAIL: Verification status not updated';
      }
    } catch (err) {
      results['3. Admin Approve Builder Status Update'] = 'FAIL: ' + err.message;
      console.error('✖ Test 3 FAIL:', err.message);
    }
  }

  // TEST 4: Register Customer in Firebase Auth
  try {
    const cred = await createUserWithEmailAndPassword(auth, testCustomerEmail, testPassword);
    customerUser = cred.user;
    results['4. Register new Customer in Firebase Auth'] = 'PASS';
    console.log('✔ Test 4 PASS: Customer account created with UID:', customerUser.uid);
  } catch (err) {
    results['4. Register new Customer in Firebase Auth'] = 'FAIL: ' + err.message;
    console.error('✖ Test 4 FAIL:', err.message);
  }

  // TEST 5: Save Customer profile to Firestore (customers and users collections)
  if (customerUser) {
    try {
      const customerProfile = {
        uid: customerUser.uid,
        fullName: 'Rajesh Sharma',
        name: 'Rajesh Sharma',
        email: testCustomerEmail,
        phone: '+91 9123456780',
        city: 'Hyderabad',
        address: 'Banjara Hills, Plot 42',
        role: 'customer',
        accountStatus: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'customers', customerUser.uid), customerProfile);
      await setDoc(doc(db, 'users', customerUser.uid), customerProfile);

      const snapC = await getDoc(doc(db, 'customers', customerUser.uid));
      const snapU = await getDoc(doc(db, 'users', customerUser.uid));

      if (snapC.exists() && snapU.exists() && snapC.data().accountStatus === 'active') {
        results['5. Customer Firestore Profile Saved & Verified'] = 'PASS';
        console.log('✔ Test 5 PASS: Customer profile stored in both customers and users collections');
      } else {
        results['5. Customer Firestore Profile Saved & Verified'] = 'FAIL: Record mismatch';
      }
    } catch (err) {
      results['5. Customer Firestore Profile Saved & Verified'] = 'FAIL: ' + err.message;
      console.error('✖ Test 5 FAIL:', err.message);
    }

    // TEST 6: Customer Account Status Governance
    try {
      await updateDoc(doc(db, 'customers', customerUser.uid), {
        accountStatus: 'suspended',
        updatedAt: serverTimestamp()
      });

      const updatedSnap = await getDoc(doc(db, 'customers', customerUser.uid));
      if (updatedSnap.exists() && updatedSnap.data().accountStatus === 'suspended') {
        results['6. Customer Account Status Update'] = 'PASS';
        console.log('✔ Test 6 PASS: Customer status updated to "suspended" successfully');
      } else {
        results['6. Customer Account Status Update'] = 'FAIL: Status mismatch';
      }
    } catch (err) {
      results['6. Customer Account Status Update'] = 'FAIL: ' + err.message;
      console.error('✖ Test 6 FAIL:', err.message);
    }
  }

  // TEST 7: Duplicate Registration Handling (Should reject duplicate email)
  try {
    await createUserWithEmailAndPassword(auth, testCustomerEmail, testPassword);
    results['7. Duplicate Registration Rejection'] = 'FAIL: Allowed duplicate email';
  } catch (dupErr) {
    if (dupErr.code === 'auth/email-already-in-use') {
      results['7. Duplicate Registration Rejection'] = 'PASS (Blocked with auth/email-already-in-use)';
      console.log('✔ Test 7 PASS: Correctly blocked duplicate registration with auth/email-already-in-use');
    } else {
      results['7. Duplicate Registration Rejection'] = 'FAIL: Unexpected error code ' + dupErr.code;
    }
  }

  // CLEANUP: Clean up test records from Firestore and Auth so we leave a pristine database
  console.log('\n--- Cleaning up temporary test records ---');
  if (builderUser) {
    try {
      await deleteDoc(doc(db, 'builders', builderUser.uid));
      await deleteDoc(doc(db, 'users', builderUser.uid));
      await deleteUser(builderUser);
      console.log('Cleaned up test builder account.');
    } catch (cErr) {
      console.warn('Builder cleanup notice:', cErr.message);
    }
  }
  if (customerUser) {
    try {
      await deleteDoc(doc(db, 'customers', customerUser.uid));
      await deleteDoc(doc(db, 'users', customerUser.uid));
      await deleteUser(customerUser);
      console.log('Cleaned up test customer account.');
    } catch (cErr) {
      console.warn('Customer cleanup notice:', cErr.message);
    }
  }

  console.log('\n====================================================');
  console.log('FINAL TEST RESULTS MATRIX:');
  console.log('====================================================');
  console.table(results);
}

runTests().then(() => process.exit(0)).catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
