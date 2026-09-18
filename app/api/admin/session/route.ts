import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const decoded = await adminAuth.verifyIdToken(token);

    // Single source of truth: the Firestore users/{uid}.role field — the
    // same field every admin page (useAdminGuard) and admin UI already
    // reads. There used to be a second, separate check here against an
    // Auth custom claim, which meant granting admin access required
    // updating two different places that could drift out of sync. This
    // route is now consistent with the rest of the app.
    const profileSnap = await adminDb.collection('users').doc(decoded.uid).get();
    const role = profileSnap.exists ? profileSnap.data()?.role : undefined;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Not admin' }, { status: 403 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5,
      path: '/',
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Invalid' }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
  return res;
}
