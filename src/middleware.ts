// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.

  // Public paths that don't require authentication
  const publicPaths = [
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/auth/verify-request",
  ];

  // Modified logic to handle homepage separately
  const isAuthPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const isHomePage = request.nextUrl.pathname === "/";

  if (!sessionCookie && !isAuthPath && !isHomePage) {
    // Redirect to signin page if trying to access protected route without session
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (sessionCookie && isAuthPath) {
    // Redirect to home page if trying to access auth pages with active session
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
