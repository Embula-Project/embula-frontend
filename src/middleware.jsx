import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_MENU_API_URL || 'http://localhost:8081';

/**
 * Middleware with HTTP-only cookie authentication
 * 
 * IMPLEMENTATION:
 * - Calls /auth/me endpoint to verify authentication
 * - Browser automatically sends HTTP-only cookies
 * - Caches user data in request context to prevent duplicate calls
 * - No JWT decoding on server-side needed
 */
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
  const isCustomerRoute = pathname === "/checkout" || pathname === "/payment-success" || pathname === "/success"; // Auth required routes

  // Allow access to public routes (login, signup, home, menu)
  if (!isAdminRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  // Check if user has HTTP-only cookie (basic check)
  const hasAccessToken = request.cookies.has("accessToken");

  if (!hasAccessToken) {
    console.log(`[Middleware] No accessToken cookie for ${pathname}, redirecting to login`);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "true");
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Call /auth/me to verify authentication and get user role
    console.log(`[Middleware] Verifying auth for ${pathname}...`);
    
    const authResponse = await fetch(`${BASE_URL}/api/v1/login/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '', // Forward cookies
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!authResponse.ok) {
      console.log(`[Middleware] Auth verification failed: ${authResponse.status}`);
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "true");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const authData = await authResponse.json();
    const user = authData?.data;
    const role = user?.role;

    if (!role) {
      console.log(`[Middleware] No role found in /auth/me response`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log(`[Middleware] User role: ${role}, accessing: ${pathname}`);

    // Helper function to get role-based redirect
    const getRoleBasedRedirect = (userRole) => {
      switch (userRole) {
        case "ADMIN":
          return "/admin";
        case "CUSTOMER":
          return "/";
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

    // User has correct role - allow access
    console.log(`[Middleware] ✓ Access granted: ${role} → ${pathname}`);
    
    // Cache user data in response headers for client-side use (optional optimization)
    const response = NextResponse.next();
    response.headers.set('X-User-Role', role);
    response.headers.set('X-User-Email', user.email || '');
    
    return response;
  } catch (error) {
    console.error("[Middleware] Error:", error.message);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "true");
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
