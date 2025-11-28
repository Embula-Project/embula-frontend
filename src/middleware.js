import { NextResponse } from "next/server";
import { decodeJwtTokenMiddleware } from "./app/services/jwtDecoderMiddleware";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for Next.js internals, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Define protected routes
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  
  // Customer menu is public, but checkout requires auth
  const publicCustomerRoutes = ["/customer/customerMenu"];
  const isPublicCustomerRoute = publicCustomerRoutes.some(route => pathname.startsWith(route));
  
  // Protect customer dashboard and checkout - only customer menu is public
  const isCustomerRoute = (pathname === "/customer" || pathname.startsWith("/customer/")) && !isPublicCustomerRoute;

  // Allow access to public routes (login, signup, home, public customer pages)
  if (!isAdminRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("authToken")?.value;

  // If no token, redirect to login page immediately
  if (!token) {
    console.log(`[Middleware] No token found for ${pathname}, redirecting to login`);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "true");
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode the JWT token
    const decoded = await decodeJwtTokenMiddleware(token);
    const role = decoded?.role;

    if (!role) {
      console.log(`[Middleware] No role found in token for ${pathname}`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`[Middleware] Role: ${role}, accessing: ${pathname}`);

    // Helper function to get role-based redirect
    const getRoleBasedRedirect = (userRole) => {
      switch (userRole) {
        case "ADMIN":
          return "/admin";
        case "CUSTOMER":
          return "/customer";
        default:
          return "/";
      }
    };

    // Check if user is trying to access admin route without ADMIN role
    if (isAdminRoute && role !== "ADMIN") {
      console.log(`[Middleware] Access denied: ${role} → admin route`);
      const redirectTo = getRoleBasedRedirect(role);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // Check if user is trying to access customer route without CUSTOMER role
    if (isCustomerRoute && role !== "CUSTOMER") {
      console.log(`[Middleware] Access denied: ${role} → customer route`);
      const redirectTo = getRoleBasedRedirect(role);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // User has correct role for the route - allow access
    console.log(`[Middleware] ✓ Access granted: ${role} → ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    // If token is invalid or expired, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
