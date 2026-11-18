// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIREBASE USER MANAGEMENT SERVICE
// Realtime sync & management for Builders and Customers in Admin Portal.
// ─────────────────────────────────────────────────────────────

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';

/**
 * Saves or updates a Builder profile in both 'builders' and 'users' collections
 */
export async function saveBuilderProfile(uid, data) {
  if (!isFirebaseConfigured || !db) return false;

  const now = serverTimestamp();
  const profile = {
    uid,
    fullName: data.fullName || data.name || '',
    name: data.fullName || data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    companyName: data.companyName || data.company || '',
    company: data.companyName || data.company || '',
    experience: Number(data.experience) || 0,
    experienceYears: Number(data.experience) || 0,
    specialization: data.specialization || 'General Construction',
    licenseNo: data.licenseNo || '',
    location: data.location || data.city || '',
    city: data.location || data.city || '',
    role: 'builder',
    accountStatus: data.accountStatus || 'pending',
    verificationStatus: data.verificationStatus || 'pending',
    createdAt: data.createdAt || now,
    updatedAt: now
  };

  try {
    // 1. Write to 'builders/{uid}'
    await setDoc(doc(db, 'builders', uid), profile, { merge: true });
    // 2. Write to 'users/{uid}'
    await setDoc(doc(db, 'users', uid), profile, { merge: true });
    console.log(`✅ Builder profile saved in Firestore for UID: ${uid}`);
    return true;
  } catch (error) {
    console.error('❌ Error saving builder profile to Firestore:', error);
    throw error;
  }
}

/**
 * Saves or updates a Customer profile in both 'customers' and 'users' collections
 */
export async function saveCustomerProfile(uid, data) {
  if (!isFirebaseConfigured || !db) return false;

  const now = serverTimestamp();
  const profile = {
    uid,
    fullName: data.fullName || data.name || '',
    name: data.fullName || data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    city: data.city || '',
    address: data.address || '',
    role: 'customer',
    accountStatus: data.accountStatus || 'active',
    createdAt: data.createdAt || now,
    updatedAt: now
  };

  try {
    // 1. Write to 'customers/{uid}'
    await setDoc(doc(db, 'customers', uid), profile, { merge: true });
    // 2. Write to 'users/{uid}'
    await setDoc(doc(db, 'users', uid), profile, { merge: true });
    console.log(`✅ Customer profile saved in Firestore for UID: ${uid}`);
    return true;
  } catch (error) {
    console.error('❌ Error saving customer profile to Firestore:', error);
    throw error;
  }
}

/**
 * Realtime listener for all registered Builders
 */
export function subscribeToAllBuilders(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const buildersRef = collection(db, 'builders');
    return onSnapshot(
      buildersRef,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          uid: d.id,
          ...d.data()
        }));
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore builders subscription notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not initialize builders listener:', err.message);
    return () => {};
  }
}

/**
 * Realtime listener for all registered Customers
 */
export function subscribeToAllCustomers(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const customersRef = collection(db, 'customers');
    return onSnapshot(
      customersRef,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          uid: d.id,
          ...d.data()
        }));
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore customers subscription notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not initialize customers listener:', err.message);
    return () => {};
  }
}

/**
 * Admin action: Update Builder Verification & Approval Status
 * Statuses: 'Approved' | 'Rejected' | 'Suspended' | 'Pending'
 */
export async function updateBuilderApproval(builderId, newStatus, { adminEmail = '', rejectionReason = '' } = {}) {
  if (!isFirebaseConfigured || !db) return false;

  const now = serverTimestamp();
  const normalizedVerification = newStatus;
  const normalizedAccount = newStatus === 'Approved' ? 'active' : 
                            (newStatus === 'Rejected' ? 'rejected' : 
                            (newStatus === 'Suspended' ? 'suspended' : 'pending'));

  const updatePayload = {
    verificationStatus: normalizedVerification,
    accountStatus: normalizedAccount,
    reviewedBy: adminEmail || 'Admin',
    reviewedAt: now,
    rejectionReason: rejectionReason || '',
    updatedAt: now
  };

  try {
    await updateDoc(doc(db, 'builders', builderId), updatePayload);
    // Also mirror to 'users' collection
    await updateDoc(doc(db, 'users', builderId), updatePayload).catch(() => {});
    console.log(`✅ Builder [${builderId}] status updated to: ${newStatus}`);
    return true;
  } catch (err) {
    console.error('❌ Error updating builder approval:', err);
    throw err;
  }
}

/**
 * Admin action: Update Customer Account Status
 * Statuses: 'active' | 'suspended'
 */
export async function updateCustomerStatus(customerId, newStatus, { adminEmail = '' } = {}) {
  if (!isFirebaseConfigured || !db) return false;

  const now = serverTimestamp();
  const updatePayload = {
    accountStatus: newStatus,
    reviewedBy: adminEmail || 'Admin',
    reviewedAt: now,
    updatedAt: now
  };

  try {
    await updateDoc(doc(db, 'customers', customerId), updatePayload);
    await updateDoc(doc(db, 'users', customerId), updatePayload).catch(() => {});
    console.log(`✅ Customer [${customerId}] accountStatus updated to: ${newStatus}`);
    return true;
  } catch (err) {
    console.error('❌ Error updating customer status:', err);
    throw err;
  }
}
