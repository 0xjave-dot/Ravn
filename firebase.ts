import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Construct firestore referencing the specific database instance ID from metadata parameters
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
