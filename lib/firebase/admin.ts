import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let _app: App | undefined;

/** Trim stray whitespace / CRLF / wrapping quotes from dashboard env vars. */
function env(key: string): string {
  const raw = process.env[key];
  if (!raw) return '';
  return raw.trim().replace(/^['"]|['"]$/g, '').trim();
}

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0];
    return _app;
  }

  // FIREBASE_PRIVATE_KEY_BASE64 is the preferred source: pasting a raw PEM
  // key into a dashboard env var is fragile — a stray \r (common when
  // copy-pasting from Windows/some editors) survives the .replace(/\\n/g)
  // call below and gets embedded in the signed auth token, which grpc-js
  // then rejects with "Metadata string value ... contains illegal
  // characters" the moment Firestore is queried. Base64 has no whitespace
  // or line-ending characters at all, so it can't be corrupted this way.
  const rawKey = env('FIREBASE_PRIVATE_KEY_BASE64')
    ? Buffer.from(env('FIREBASE_PRIVATE_KEY_BASE64'), 'base64').toString('utf8')
    : env('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  // Normalise line endings and drop any trailing \r left on each PEM line.
  const privateKey = rawKey.replace(/\r\n/g, '\n').replace(/\r/g, '').trim() + '\n';

  _app = initializeApp({
    credential: cert({
      projectId: env('FIREBASE_PROJECT_ID') || env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      clientEmail: env('FIREBASE_CLIENT_EMAIL'),
      privateKey,
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
