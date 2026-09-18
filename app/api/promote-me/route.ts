import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// ⚠️ DELETE THIS FILE IMMEDIATELY AFTER USE ⚠️
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const email = searchParams.get('email');

  // A simple password to prevent randoms from promoting themselves
  const SETUP_SECRET = 'my-super-secret-string-123'; 

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Wrong secret' }, { status: 403 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    // Find the user by email, then grant admin by writing the Firestore
    // profile field that everything else in the app already checks
    // (session login, security rules, admin pages) — no Auth custom claim
    // needed.
    const user = await adminAuth.getUserByEmail(email);
    await adminDb.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true });

    return NextResponse.json({ 
      success: true, 
      message: `Success! ${email} is now an admin. You can log in at /admin/login.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
