// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIRESTORE PROJECT & MILESTONE SERVICE
// Realtime sync for Projects, Milestones, Progress, & Seeding.
// ─────────────────────────────────────────────────────────────

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';
import { 
  INITIAL_ADMIN_PROJECTS, 
  CUSTOMER_PROJECT_DATA, 
  CUSTOMER_PROGRESS_STAGES,
  INITIAL_BUILDER_CUSTOMERS,
  INITIAL_BUILDERS
} from '../../data/initialData';

/**
 * No-op: Demo seeding removed per user request so the project starts with a clean database.
 */
export async function seedInitialDataIfEmpty() {
  return false;
}

/**
 * Listens to all projects in real-time.
 */
export function subscribeToProjects(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  try {
    const projectsRef = collection(db, 'projects');
    return onSnapshot(
      projectsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const projectsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          onUpdate(projectsList);
        }
      },
      (err) => {
        console.warn('Firestore projects listener notice:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Could not initialize projects listener:', err.message);
    return () => {};
  }
}

/**
 * Listens to a single customer project in real-time.
 */
export function subscribeToCustomerProject(projectId, onUpdate) {
  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  try {
    const projDoc = doc(db, 'projects', projectId);
    return onSnapshot(projDoc, (snap) => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...snap.data() });
      }
    }, (err) => {
      console.warn('Customer project subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Could not subscribe to customer project:', err.message);
    return () => {};
  }
}

/**
 * Updates project progress percentage in Firestore
 */
export async function updateProjectProgressInDb(projectId, progressNumber) {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const projRef = doc(db, 'projects', String(projectId));
    await updateDoc(projRef, {
      progress: Number(progressNumber),
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Updated Firestore project [${projectId}] progress to ${progressNumber}%`);
    return true;
  } catch (err) {
    console.warn('Could not update project progress in Firestore:', err.message);
    return false;
  }
}

/**
 * Updates a milestone/stage within a project
 */
export async function updateMilestoneStatusInDb(projectId, stageId, newStatus) {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const projRef = doc(db, 'projects', String(projectId));
    const snap = await getDoc(projRef);
    if (!snap.exists()) return false;

    const data = snap.data();
    const updatedStages = (data.stages || []).map(st => 
      st.id === stageId ? { ...st, status: newStatus } : st
    );

    await updateDoc(projRef, {
      stages: updatedStages,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Milestone ${stageId} updated to ${newStatus} in Firestore.`);
    return true;
  } catch (err) {
    console.warn('Could not update milestone in Firestore:', err.message);
    return false;
  }
}

/**
 * Creates a new project in Firestore
 */
export async function addProjectToDb(newProject) {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const id = newProject.id ? String(newProject.id) : `proj_${Date.now()}`;
    await setDoc(doc(db, 'projects', id), {
      ...newProject,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('Could not add project to Firestore:', err.message);
    return false;
  }
}
