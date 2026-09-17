import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decoded.uid);

    if (user.customClaims?.role !== 'admin') {
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
