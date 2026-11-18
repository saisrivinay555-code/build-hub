// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIREBASE AUTHENTICATION SERVICE
// Handles Firebase Authentication (Email/Password), User Profiles,
// and seamless demo-role login support with local fallback.
// ─────────────────────────────────────────────────────────────

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebaseConfig';
import { saveBuilderProfile, saveCustomerProfile } from './userService';

// OAuth Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Default role credentials for demo logins
export const DEMO_CREDENTIALS = {
  Customer: {
    email: 'ramesh.kumar@buildhub.io',
    password: 'Customer@2026',
    name: 'Ramesh Kumar',
    role: 'Customer',
    phone: '+91 98765 11223',
    city: 'Hyderabad',
    address: 'Plot 42, Green Meadows, Jubilee Hills Extension, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    project: 'Residential Villa'
  },
  Builder: {
    email: 'contact@techbuilders.com',
    password: 'Builder@2026',
    name: 'A Sai Sri Vinay',
    role: 'Builder',
    company: 'Vinay Builders & Infra',
    licenseNo: 'BLD-2021-8849',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  Administrator: {
    email: 'saisri.vinay@buildhub.io',
    password: 'Admin@2026#BuildHub',
    name: 'A Sai Sri Vinay (Admin)',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  }
};

/**
 * Sign in existing user with email and password
 */
export async function signInUser(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Retrieve Firestore profile if exists
  const profile = await getUserProfile(user.uid);
  return { user, profile };
}

/**
 * Register new user with email, password, and custom profile
 */
export async function registerUser(email, password, profileData = {}) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (profileData.name) {
    await updateProfile(user, {
      displayName: profileData.name,
      photoURL: profileData.avatar || null
    }).catch(() => {});
  }

  // Client registration guard: only Customer or Builder allowed from registration
  const isBuilderRole = (profileData.role || '').toLowerCase() === 'builder';
  const clientSafeRole = isBuilderRole ? 'builder' : 'customer';

  let profile = {};
  if (isBuilderRole) {
    profile = {
      uid: user.uid,
      fullName: profileData.fullName || profileData.name || '',
      name: profileData.fullName || profileData.name || '',
      email: user.email,
      phone: profileData.phone || '',
      companyName: profileData.companyName || profileData.company || '',
      company: profileData.companyName || profileData.company || '',
      experience: Number(profileData.experience) || 0,
      specialization: profileData.specialization || 'Residential',
      licenseNo: profileData.licenseNo || '',
      location: profileData.location || profileData.city || '',
      city: profileData.location || profileData.city || '',
      role: 'builder',
      accountStatus: 'pending',
      verificationStatus: 'pending'
    };
    await saveBuilderProfile(user.uid, profile);
  } else {
    profile = {
      uid: user.uid,
      fullName: profileData.fullName || profileData.name || '',
      name: profileData.fullName || profileData.name || '',
      email: user.email,
      phone: profileData.phone || '',
      city: profileData.city || '',
      address: profileData.address || '',
      role: 'customer',
      accountStatus: 'active'
    };
    await saveCustomerProfile(user.uid, profile);
  }

  return { user, profile };
}

/**
 * Signs in as a demo role. If user doesn't exist, automatically creates it in Firebase Auth!
 */
export async function signInAsDemoRole(roleName, customOverride = {}) {
  const defaultData = DEMO_CREDENTIALS[roleName] || DEMO_CREDENTIALS.Customer;
  const email = customOverride.email || defaultData.email;
  const password = customOverride.password || defaultData.password;

  if (!isFirebaseConfigured || !auth) {
    console.warn('⚠️ Firebase not configured, using local session for demo login.');
    return {
      user: { uid: `local_${roleName.toLowerCase()}`, email },
      profile: { ...defaultData, ...customOverride }
    };
  }

  try {
    // Try signing in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(userCredential.user.uid) || { ...defaultData, ...customOverride, uid: userCredential.user.uid };
    return { user: userCredential.user, profile };
  } catch (err) {
    // If user-not-found or invalid-credential, try creating account automatically
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const { user, profile } = await registerUser(email, password, {
          ...defaultData,
          ...customOverride
        });
        return { user, profile };
      } catch (regErr) {
        console.warn('Could not auto-register demo user in Firebase Auth:', regErr.message);
      }
    }
    // Return local mock fallback so UI never breaks
    console.warn('Falling back to local demo profile for UI preservation:', err.message);
    return {
      user: { uid: `local_${roleName.toLowerCase()}`, email },
      profile: { ...defaultData, ...customOverride }
    };
  }
}

/**
 * Sign out current Firebase user
 */
export async function signOutUser() {
  if (!isFirebaseConfigured || !auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Error signing out:', err);
  }
}

/**
 * Fetch profile doc from Firestore `users/{uid}`
 */
export async function getUserProfile(uid) {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err.message);
    return null;
  }
}

/**
 * Save or update profile document in Firestore
 */
export async function saveUserProfile(uid, profileData) {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err.message);
    return false;
  }
}

/**
 * Auth state change listener
 */
export function onAuthChange(callback) {
  if (!isFirebaseConfigured || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Sign in with Google OAuth (popup)
 * Creates a customer profile if user is new
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured. Please set up Firebase to use Google Sign-In.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile already exists
  let profile = await getUserProfile(user.uid);
  if (!profile) {
    // New user — create customer profile from Google account info
    profile = {
      uid: user.uid,
      fullName: user.displayName || '',
      name: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      city: '',
      address: '',
      role: 'customer',
      accountStatus: 'active',
      authProvider: 'google',
      avatar: user.photoURL || ''
    };
    await saveCustomerProfile(user.uid, profile);
  }

  return { user, profile };
}

/**
 * Sign in with Microsoft OAuth (popup)
 * Creates a customer profile if user is new
 */
export async function signInWithMicrosoft() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured. Please set up Firebase to use Microsoft Sign-In.');
  }

  const result = await signInWithPopup(auth, microsoftProvider);
  const user = result.user;

  // Check if profile already exists
  let profile = await getUserProfile(user.uid);
  if (!profile) {
    // New user — create customer profile from Microsoft account info
    profile = {
      uid: user.uid,
      fullName: user.displayName || '',
      name: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      city: '',
      address: '',
      role: 'customer',
      accountStatus: 'active',
      authProvider: 'microsoft',
      avatar: user.photoURL || ''
    };
    await saveCustomerProfile(user.uid, profile);
  }

  return { user, profile };
}
