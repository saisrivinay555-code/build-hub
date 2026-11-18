// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIRESTORE DATABASE SERVICE
// Realtime CRUD operations for Chat Messages, Projects,
// Milestones, Payments, and Customer Inquiries.
// ─────────────────────────────────────────────────────────────

import { db, isFirebaseConfigured } from './firebaseConfig.js';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

export async function saveChatMessage({
  userId = 'default_user',
  role = 'Customer',
  sender = 'user', // 'user' | 'bot'
  text = '',
  projectId = null
}) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    // Write to top-level 'chat_messages' collection so it immediately appears in Firebase Console!
    const messagesRef = collection(db, 'chat_messages');
    const docRef = await addDoc(messagesRef, {
      userId,
      role,
      sender,
      text,
      projectId: projectId || 'general',
      createdAt: serverTimestamp()
    });

    console.log(`✅ Saved to Firestore [chat_messages]: "${text.slice(0, 30)}..." (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving chat message to Firestore:', error);
    return null;
  }
}

/**
 * Listens to realtime chat messages for a user
 */
export function subscribeToChatMessages(userId, callback) {
  if (!isFirebaseConfigured || !db) {
    return () => {}; // No-op unsubscribe
  }

  try {
    const messagesRef = collection(db, 'users', userId, 'chat_messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    }, (error) => {
      console.warn('Firestore chat subscription notice:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.warn('Error setting up chat subscription:', error);
    return () => {};
  }
}

/**
 * Saves or updates project records in Firestore
 */
export async function syncProjectToFirestore(projectId, projectData) {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const projectRef = doc(db, 'projects', projectId);
    await setDoc(projectRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error syncing project to Firestore:', error);
    return false;
  }
}

/**
 * Listens to live project changes (e.g. progress updates, stage completions)
 */
export function subscribeToProject(projectId, callback) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const projectRef = doc(db, 'projects', projectId);
    return onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    });
  } catch (error) {
    console.warn('Error subscribing to project:', error);
    return () => {};
  }
}

/**
 * Saves a milestone update to Firestore
 */
export async function updateMilestoneInFirestore(projectId, stageId, stageData) {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const stageRef = doc(db, 'projects', projectId, 'stages', stageId);
    await setDoc(stageRef, {
      ...stageData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating milestone in Firestore:', error);
    return false;
  }
}

/**
 * Submits a new customer inquiry (leads) for builders
 */
export async function submitCustomerInquiryToFirestore(inquiryData) {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const reqsRef = collection(db, 'customer_requests');
    const docRef = await addDoc(reqsRef, {
      ...inquiryData,
      createdAt: serverTimestamp(),
      status: inquiryData.status || 'New'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting inquiry to Firestore:', error);
    return null;
  }
}

/**
 * Creates a formal Builder Booking record in `builder_bookings`
 * and mirrored entry in `customer_requests` so the builder sees it
 */
export async function createBuilderBookingInFirestore(bookingData) {
  if (!isFirebaseConfigured || !db) {
    return { id: 'bkg_' + Date.now(), ...bookingData };
  }

  try {
    const bookingsRef = collection(db, 'builder_bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      status: bookingData.status || 'Pending',
      createdAt: serverTimestamp()
    });

    // Also mirror to customer_requests for the builder's incoming leads
    try {
      const requestsRef = collection(db, 'customer_requests');
      await addDoc(requestsRef, {
        bookingId: docRef.id,
        builderId: bookingData.builderId,
        builderName: bookingData.builderName,
        customer: bookingData.customerName,
        customerId: bookingData.customerId,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
        projectType: bookingData.projectType,
        location: bookingData.location,
        area: bookingData.area,
        estimatedCost: bookingData.estimatedCost,
        budget: bookingData.estimatedCost,
        requirements: bookingData.requirements || '',
        preferredDate: bookingData.preferredDate || '',
        contactMethod: bookingData.contactMethod || 'Phone Call',
        status: 'New',
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        avatar: bookingData.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Could not mirror booking to customer_requests:', e);
    }

    return { id: docRef.id, ...bookingData };
  } catch (error) {
    console.error('Error creating booking in Firestore:', error);
    return { id: 'bkg_' + Date.now(), ...bookingData };
  }
}

/**
 * Updates a booking status in Firestore
 */
export async function updateBookingStatusInFirestore(bookingId, status) {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const bookingRef = doc(db, 'builder_bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating booking status in Firestore:', error);
    return false;
  }
}

/**
 * Saves a new construction photograph record in Firestore
 */
export async function saveConstructionImageToFirestore(imageData) {
  if (!isFirebaseConfigured || !db) {
    return { id: 'cimg_' + Date.now(), ...imageData };
  }

  try {
    const imagesRef = collection(db, 'construction_images');
    const docRef = await addDoc(imagesRef, {
      ...imageData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...imageData };
  } catch (error) {
    console.error('Error saving construction image to Firestore:', error);
    return { id: 'cimg_' + Date.now(), ...imageData };
  }
}

/**
 * Deletes a construction image record from Firestore
 */
export async function deleteConstructionImageFromFirestore(imageId) {
  if (!isFirebaseConfigured || !db) return true;

  try {
    const imgRef = doc(db, 'construction_images', imageId);
    await deleteDoc(imgRef);
    return true;
  } catch (error) {
    console.error('Error deleting construction image from Firestore:', error);
    return false;
  }
}

/**
 * Subscribes to realtime construction images for a project
 */
export function subscribeToConstructionImages(projectId, callback) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const imagesRef = collection(db, 'construction_images');
    const q = projectId 
      ? query(imagesRef, where('projectId', '==', projectId), orderBy('createdAt', 'desc'))
      : query(imagesRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      callback(items);
    }, (err) => {
      console.warn('Firestore construction images subscription notice:', err);
    });
  } catch (error) {
    console.warn('Error setting up construction images subscription:', error);
    return () => {};
  }
}

/**
 * Saves a progress update in Firestore
 */
export async function saveProgressUpdateToFirestore(updateData) {
  if (!isFirebaseConfigured || !db) {
    return { id: 'pup_' + Date.now(), ...updateData };
  }

  try {
    const updatesRef = collection(db, 'progress_updates');
    const docRef = await addDoc(updatesRef, {
      ...updateData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...updateData };
  } catch (error) {
    console.error('Error saving progress update to Firestore:', error);
    return { id: 'pup_' + Date.now(), ...updateData };
  }
}

/**
 * Subscribes to realtime progress updates
 */
export function subscribeToProgressUpdates(projectId, callback) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const updatesRef = collection(db, 'progress_updates');
    const q = projectId
      ? query(updatesRef, where('projectId', '==', projectId), orderBy('createdAt', 'desc'))
      : query(updatesRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      callback(items);
    }, (err) => {
      console.warn('Firestore progress updates subscription notice:', err);
    });
  } catch (error) {
    console.warn('Error setting up progress updates subscription:', error);
    return () => {};
  }
}

/**
 * Saves a project document (House plan, receipt, bill, approval) to Firestore
 */
export async function saveProjectDocumentToFirestore(docData) {
  if (!isFirebaseConfigured || !db) {
    return { id: 'pdoc_' + Date.now(), ...docData };
  }

  try {
    const docsRef = collection(db, 'project_documents');
    const docRef = await addDoc(docsRef, {
      ...docData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error saving project document to Firestore:', error);
    return { id: 'pdoc_' + Date.now(), ...docData };
  }
}

/**
 * Deletes a project document from Firestore
 */
export async function deleteProjectDocumentFromFirestore(documentId) {
  if (!isFirebaseConfigured || !db) return true;

  try {
    const docRef = doc(db, 'project_documents', documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting project document from Firestore:', error);
    return false;
  }
}

/**
 * Subscribes to realtime project documents for a project
 */
export function subscribeToProjectDocuments(projectId, callback) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const docsRef = collection(db, 'project_documents');
    const q = projectId
      ? query(docsRef, where('projectId', '==', projectId), orderBy('createdAt', 'desc'))
      : query(docsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      callback(items);
    }, (err) => {
      console.warn('Firestore project documents subscription notice:', err);
    });
  } catch (error) {
    console.warn('Error setting up project documents subscription:', error);
    return () => {};
  }
}
