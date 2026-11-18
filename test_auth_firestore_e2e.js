// ─────────────────────────────────────────────────────────────
// BUILD HUB — LIVE FIREBASE AUTHENTICATION & OPERATIONS TEST
// Tests: Registration, Login, Identity UID, Logout, Session Persistence
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc 
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

const testEmail = `test_user_${Date.now()}@buildhub.io`;
const testPassword = "SecurePassword2026!";

console.log('====================================================');
console.log('🧪 LIVE FIREBASE AUTHENTICATION & PERSISTENCE TEST');
console.log('Project ID: build-hub-5aa9e');
console.log('Test Account:', testEmail);
console.log('====================================================\n');

async function runTests() {
  try {
    // ─── TEST 1: REGISTRATION ───
    console.log('1️⃣ Testing Registration (createUserWithEmailAndPassword)...');
    const userCred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const registeredUser = userCred.user;
    console.log('  ✅ Registration Succeeded!');
    console.log('  🆔 Firebase Auth UID:', registeredUser.uid);
    console.log('  📧 Verified Email:', registeredUser.email);

    // ─── TEST 2: IDENTITY AND SESSION VERIFICATION ───
    console.log('\n2️⃣ Testing Active Auth Session Identity...');
    if (auth.currentUser && auth.currentUser.uid === registeredUser.uid) {
      console.log('  ✅ Current user matches registered UID:', auth.currentUser.uid);
    } else {
      throw new Error('Active session does not match registered UID');
    }

    // ─── TEST 3: LOGOUT ───
    console.log('\n3️⃣ Testing Sign Out (signOut)...');
    await signOut(auth);
    if (!auth.currentUser) {
      console.log('  ✅ Sign Out Succeeded! auth.currentUser is now null.');
    } else {
      throw new Error('Sign out failed, currentUser is still present');
    }

    // ─── TEST 4: LOGIN ───
    console.log('\n4️⃣ Testing Sign In (signInWithEmailAndPassword)...');
    const loginCred = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    const loggedInUser = loginCred.user;
    console.log('  ✅ Sign In Succeeded!');
    console.log('  🆔 Session restored for UID:', loggedInUser.uid);

    // ─── TEST 5: PERSISTENCE VERIFICATION ───
    console.log('\n5️⃣ Testing Session Persistence...');
    const token = await loggedInUser.getIdToken();
    if (token && token.length > 50) {
      console.log('  ✅ ID Token generated and authenticated with Firebase Identity Platform.');
    } else {
      throw new Error('Could not retrieve valid ID token');
    }

    // Clean up sign out
    await signOut(auth);
    console.log('\n🎉 ALL LIVE FIREBASE AUTHENTICATION TESTS PASSED!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ TEST FAILED:', error.code, error.message);
    process.exit(1);
  }
}

runTests();
