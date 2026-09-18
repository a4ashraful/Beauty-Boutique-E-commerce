import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Fallback placeholder values (never real credentials) so initializeApp()
// never throws at module load just because an env var is missing or not
// yet configured in the hosting platform's dashboard. If the real config
// is missing, Firestore/Auth calls will fail later with a normal, catchable
// network/auth error — instead of crashing the entire Worker on cold start
// before Next.js or any error boundary ever runs.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'missing-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'missing.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'missing-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'missing.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// A real Firestore instance (not a Proxy) — required because the modular
// client SDK's functions like collection(db, 'path') do an `instanceof
// Firestore` check on the first argument, which a Proxy wrapping a plain
// object would fail.
export const db: Firestore = getFirestore(app);

// Auth is only meaningful in the browser. Server-rendered pages (e.g.
// generateMetadata, RSC data fetching) only ever need Firestore, but they
// still import this module — so eagerly calling getAuth() here would
// validate config during server render/cold-start and could throw.
// Deferring it to the browser avoids that, while client components that
// actually log people in still get a real Auth instance.
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
