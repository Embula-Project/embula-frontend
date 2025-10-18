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

  // Only protect /admin and /customer routes
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCustomerRoute = pathname === "/customer" || pathname.startsWith("/customer/");

  // Allow access to public routes (login, signup, home)
  if (!isAdminRoute && !isCustomerRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("authToken")?.value;

  // If no token, redirect to home/login page
  if (!token) {
    console.log("No auth token found, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Decode the JWT token
    const decoded = await decodeJwtTokenMiddleware(token);
    const role = decoded.role;

    console.log(`Middleware: User role is ${role}, accessing ${pathname}`);

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
      console.log(`Access denied: ${role} attempting to access admin route`);
      const redirectTo = getRoleBasedRedirect(role);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // Check if user is trying to access customer route without CUSTOMER role
    if (isCustomerRoute && role !== "CUSTOMER") {
      console.log(`Access denied: ${role} attempting to access customer route`);
      const redirectTo = getRoleBasedRedirect(role);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // User has correct role for the route
    console.log(`Access granted: ${role} accessing ${pathname}`);
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
