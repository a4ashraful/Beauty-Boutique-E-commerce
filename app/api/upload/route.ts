import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { uploadMany } from '@/lib/imgbb';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB, matches the limit shown in ImageUploader.tsx

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // Only admins can upload product images.
    const decoded = await adminAuth.verifyIdToken(token);
    const profileSnap = await adminDb.collection('users').doc(decoded.uid).get();
    const role = profileSnap.exists ? profileSnap.data()?.role : undefined;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll('images').filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }
    for (const f of files) {
      if (f.size > MAX_SIZE) {
        return NextResponse.json({ error: `${f.name} exceeds 5MB limit` }, { status: 400 });
      }
    }

    const results = await uploadMany(files);

    return NextResponse.json({
      images: results.map((r) => ({ url: r.url, thumb: r.thumb })),
    });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}
