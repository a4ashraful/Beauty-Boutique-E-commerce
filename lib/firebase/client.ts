import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Same rationale as lib/firebase/admin.ts: initializing eagerly at module
// load means a missing/undefined env var (e.g. not yet configured in the
// hosting platform's dashboard) crashes the entire Worker on cold start,
// before Next.js or any error boundary ever runs — producing a raw,
// unstyled 500 with no useful message. Deferring init to first use turns
// that into a normal, catchable error inside whichever data-fetching call
// actually needs Firebase.
let _app: FirebaseApp | undefined;

function getClientApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  return _app;
}

function lazy<T extends object>(factory: () => T): T {
  let instance: T | undefined;
  return new Proxy({} as T, {
    get(_target, prop) {
      if (!instance) instance = factory();
      const value = Reflect.get(instance as object, prop, instance);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

export const db: Firestore = lazy(() => getFirestore(getClientApp()));

// Auth is only meaningful in the browser. Server-rendered pages (e.g.
// generateMetadata, RSC data fetching) only ever need Firestore, but they
// still import this module — so eagerly calling getAuth() here would
// validate config during server render/cold-start and could crash
// everything. Deferring it to the browser avoids that, while client
// components that actually log people in still get a real Auth instance.
export const auth: Auth =
  typeof window !== 'undefined'
    ? getAuth(getClientApp())
    : (new Proxy(
        {},
        {
          get() {
            throw new Error('Firebase Auth is only available in the browser.');
          },
        }
      ) as Auth);

export default { getApp: getClientApp };
