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

  // Prefer FIREBASE_PRIVATE_KEY_BASE64 over FIREBASE_PRIVATE_KEY. A raw PEM
  // key pasted into a dashboard env var is fragile — a stray \r character
  // (common when copy-pasting from Windows or some editors) survives the
  // \n-replace below and ends up embedded in the signed auth token, which
  // grpc-js then rejects with "Metadata string value ... contains illegal
  // characters" the moment Firestore is queried. Base64 has no whitespace
  // or line-ending characters at all, so it can't be corrupted this way.
  // FIREBASE_PRIVATE_KEY is kept as a fallback for local dev / anyone who
  // hasn't migrated to the base64 var yet.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8')
    : process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey!,
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
