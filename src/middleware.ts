import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Simple auth check for protected routes - basic version that doesn't use Prisma
  const path = request.nextUrl.pathname;

  // Define which paths are protected and which are public
  const isPublicPath = path === "/login" || path === "/Sign-Up" || path === "/";

  // Get the token from the cookie - just check presence, not validity
  // Actual validation will happen in the API routes
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    "";

  // Redirect logic
  if (isPublicPath && token) {
    // Logged in users trying to access public pages get redirected to home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !token) {
    // Non-logged in users trying to access protected pages get redirected to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Add the paths that should trigger this middleware
export const config = {
  matcher: [
    "/",
    "/login",
    "/Sign-Up",
    "/home",
    "/profile",
    "/your-bid",
    "/findbid",
    "/history",
    "/price-calculator",
    // Don't add API routes here!
  ],
};
