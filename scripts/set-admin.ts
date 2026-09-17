/**
 * Usage:
 *   1. Add GOOGLE_APPLICATION_CREDENTIALS or set FIREBASE_* envs in .env.local
 *   2. npx tsx scripts/set-admin.ts <uid-or-email>
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { adminAuth } from '../lib/firebase/admin';

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

  await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
  console.log(`✅ Admin role granted to ${uid}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});