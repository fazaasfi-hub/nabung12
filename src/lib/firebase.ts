import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Session Persistence (Browser Local Persistence)
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence configuration notice:', err);
});

// Initialize Firestore safely using memory local cache to prevent IndexedDB tab locking errors
const dbInstanceId = firebaseConfigJson.firestoreDatabaseId || '(default)';

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: memoryLocalCache()
  }, dbInstanceId);
} catch (e) {
  firestoreDb = getFirestore(app, dbInstanceId);
}

export const db = firestoreDb;

export default app;
