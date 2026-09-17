import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isPublic = PUBLIC_ADMIN_ROUTES.some((p) => pathname === p);
    if (isPublic) return NextResponse.next();

    const session = req.cookies.get('admin_session')?.value;
    if (!session) {
      const url = new URL('/admin/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};