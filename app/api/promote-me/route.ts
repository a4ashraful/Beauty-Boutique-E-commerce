import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

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
    // 1. Find the user by email
    const user = await adminAuth.getUserByEmail(email);

    // 2. Set the admin role claim
    await adminAuth.setCustomUserClaims(user.uid, { role: 'admin' });

    return NextResponse.json({ 
      success: true, 
      message: `Success! ${email} is now an admin. You can log in at /admin/login.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
