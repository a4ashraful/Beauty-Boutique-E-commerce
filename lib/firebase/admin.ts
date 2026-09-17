import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// The Admin SDK needs real service-account credentials to initialize. Doing
// that eagerly at module load means Next.js crashes the entire build the
// moment it imports this file to collect page data for any route that uses
// it — even though the credentials are only actually needed once a real
// request comes in at runtime. Deferring initialization until the first
// property access (via this lazy Proxy) keeps the build-time import
// side-effect-free while behaving exactly like a normal Firestore/Auth
// instance everywhere it's actually used.
let _app: App | undefined;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0];
    return _app;
  }
  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
    }),
  });
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

export const adminDb: Firestore = lazy(() => getFirestore(getAdminApp()));
export const adminAuth: Auth = lazy(() => getAuth(getAdminApp()));
