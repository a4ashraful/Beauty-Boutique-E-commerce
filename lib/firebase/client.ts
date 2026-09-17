import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Auth is only initialized in the browser. Server-rendered pages (e.g.
// generateMetadata, RSC data fetching) only ever need Firestore, but they
// still import this module — so eagerly calling getAuth() here would
// validate the API key during the server build/render and crash the whole
// build if it's missing or malformed. Deferring it to the browser avoids
// that, while client components that actually log people in still get a
// real Auth instance.
export const auth: Auth =
  typeof window !== 'undefined'
    ? getAuth(app)
    : (new Proxy(
        {},
        {
          get() {
            throw new Error('Firebase Auth is only available in the browser.');
          },
        }
      ) as Auth);

export default app;