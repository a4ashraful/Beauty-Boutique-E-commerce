/**
 * Usage:
 *   1. Add GOOGLE_APPLICATION_CREDENTIALS or set FIREBASE_* envs in .env.local
 *   2. npx tsx scripts/set-admin.ts <uid-or-email>
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { adminAuth, adminDb } from '../lib/firebase/admin';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Provide a UID or email');
    process.exit(1);
  }

  let uid = arg;
  if (arg.includes('@')) {
    const user = await adminAuth.getUserByEmail(arg);
    uid = user.uid;
  }

  // role on the Firestore users/{uid} document is now the single source of
  // truth for admin access across the whole app (session login check,
  // Firestore security rules, and every /admin page's client-side guard).
  // There is no longer a separate Auth custom claim to keep in sync.
  await adminDb.collection('users').doc(uid).set({ role: 'admin' }, { merge: true });
  console.log(`✅ Admin role granted to ${uid} (Firestore users/${uid}.role)`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
