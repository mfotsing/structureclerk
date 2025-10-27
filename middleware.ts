import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/:lang",
  "/:lang/pricing",
  "/:lang/faq",
  "/:lang/contact",
  "/:lang/legal",
  "/:lang/legal/privacy",
  "/:lang/legal/terms",
  "/:lang/legal/cookies",
  "/:lang/legal/dpa",
  "/api/webhook",
  "/api/health",
  "/api/legal/subprocessors",
  "/api/(.*)"
]);

export default clerkMiddleware((auth, req) => {
  // Check authentication for protected routes
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Run on all locale prefixes
    "/(en|fr)/:path*"
  ]
};