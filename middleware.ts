import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Redirect root to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|_static|favicon.ico).*)']
};