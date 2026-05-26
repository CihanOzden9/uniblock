import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next();
  
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token");

  // Define public routes
  const isPublicRoute = ["/login", "/register", "/forgot-password"].some((route) =>
    pathname.startsWith(route)
  );

  // We removed the redirect for public routes here because a stale cookie
  // (e.g. after DB reset) would cause an infinite loop where the user can't login.
  // The user can now access /login even if they have a cookie, and logging in again will overwrite it.

  // If the user is not logged in and trying to access protected routes, redirect to login
  if (!token && !isPublicRoute && !pathname.startsWith("/api/auth")) {
    // Exception for root if it is meant to be a public landing page
    if (pathname === "/" || pathname.startsWith("/profile") || pathname.startsWith("/feed") || pathname.startsWith("/events") || pathname.startsWith("/clubs") || pathname.startsWith("/news") || pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle RBAC here (Mock)
  // For a real application, you would decode the JWT to check the user's role
  const userRole = request.cookies.get("user_role")?.value;

  if (pathname.startsWith("/admin") && userRole !== "super_admin" && userRole !== "project_admin") {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
