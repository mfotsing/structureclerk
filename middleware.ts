// Simple middleware for language detection
export default function middleware(req: Request) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Redirect root to /en
  if (pathname === '/') {
    return Response.redirect(new URL('/en', req.url));
  }

  return;
}

export const config = {
  matcher: ['/((?!_next|api|_static|favicon.ico).*)']
};