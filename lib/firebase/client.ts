import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Env values pasted into a dashboard (or into a .env file saved with
 * Windows CRLF line endings) very often carry an invisible trailing "\r",
 * space, or a wrapping pair of quotes. For most values that is harmless,
 * but `appId` is sent by the Firestore SDK as the gRPC metadata header
 * `x-firebase-gmpid`. grpc-js validates metadata strictly and throws:
 *
 *   Error: Metadata string value "1:3560...5ea691 " contains illegal characters
 *
 * ...which kills every Firestore call made from the Node/server side —
 * that is why product detail pages 404'd and checkout failed. Sanitising
 * here fixes it at the source for the whole app.
 */
function env(key: string): string {
  const raw = process.env[key];
  if (!raw) return '';
  return raw
    .trim()
    // strip surrounding single/double quotes
    .replace(/^['"]|['"]$/g, '')
    // strip any remaining control chars (\r, \n, \t, zero-width, BOM)
    .replace(/[\u0000-\u001F\u007F\u200B\uFEFF]/g, '')
    .trim();
}

const firebaseConfig = {
  apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('NEXT_PUBLIC_FIREBASE_APP_ID'),
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
