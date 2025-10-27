// Temporarily disabled middleware to fix 500 error
export default function middleware(req: Request) {
  // No middleware logic for now
}

export const config = {
  matcher: [
    // Skip all paths for now
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};