import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Allow access to home page and login page without authentication
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!session) {
    // Redirect unauthenticated users to login
    const redirectUrl = new URL("/login", request.url);
    // Optionally add the return URL as a query parameter
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Define which routes this middleware should run on
// This will run the middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (auth API routes)
     * 2. /_next/* (Next.js internal paths)
     * 3. .*\\..* (files with extensions, e.g. favicon.ico)
     * 4. / (home page)
     * 5. /login (login page)
     */
    "/((?!api/auth|_next|.*\\..*|/|login).*)",
  ],
};