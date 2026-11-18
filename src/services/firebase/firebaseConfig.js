// ─────────────────────────────────────────────────────────────
// BUILD HUB — FIREBASE CONFIGURATION
// Connects Build Hub to Google Firebase (Firestore Database,
// Authentication, Analytics, and Storage).
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Framework-appropriate Vite Environment Variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBF1DQzIoecr4aHIJMI9QwNsiKc9my6Xr0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "build-hub-5aa9e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "build-hub-5aa9e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "build-hub-5aa9e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "178050048946",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:178050048946:web:5a7051d9d5d2b0d2dc3aab",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YZQ5ZHJ6C6"
};

// Centralized Firebase App Initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Cloud Firestore Database, Authentication, and Storage Instances
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Optional Analytics instance for browser environments
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export { app, db, auth, storage, analytics, firebaseConfig };
