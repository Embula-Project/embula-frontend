/**
 * Auth Service - Handles authentication state management
 * Manages tokens, user sessions, and role-based routing
 * Includes cookie management for middleware authentication
 * 
 * IMPORTANT: Only stores JWT token in localStorage/cookies
 * User data is extracted from JWT token on-demand via getUserData()
 * This ensures no sensitive user data is permanently stored in localStorage
 */

import { decodeJWT, getRoleFromToken, isTokenExpired } from "./jwtService";

const TOKEN_KEY = "authToken";

/**
 * Set cookie in browser
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days
 */
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresStr = "expires=" + expires.toUTCString();
  document.cookie = `${name}=${value};${expiresStr};path=/;SameSite=Strict`;
  console.log(`Cookie set: ${name}`);
}

/**
 * Get cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete cookie
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log(`Cookie deleted: ${name}`);
}

/**
 * Store authentication token in localStorage AND cookies
 * User data is extracted from the JWT token when needed via getUserData()
 * @param {Object} authData - Authentication response from API
 * @param {string} authData.token - JWT token containing user data
 */
export function storeAuthData(authData) {
  if (!authData || !authData.token) {
    console.error("Invalid auth data provided to storeAuthData");
    return;
  }

  try {
    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, authData.token);
    
    // Store token in cookies for middleware access
    setCookie(TOKEN_KEY, authData.token, 7); // 7 days expiration
    
    console.log("Auth token stored successfully in localStorage and cookies");
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
}

/**
 * Get stored auth token
 * @returns {string|null} Auth token or null if not found
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
}

/**
 * Get user data from JWT token
 * @returns {Object|null} User object extracted from token or null if not found
 */
export function getUserData() {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    if (isTokenExpired(token)) {
      clearAuthData();
      return null;
    }
    
    const decoded = decodeJWT(token);
    if (!decoded) return null;
    
    // Extract user data from JWT token
    return {
      email: decoded.sub,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      address: decoded.address,
      phoneNumber: decoded.phoneNumber,
      id: decoded.id
    };
  } catch (error) {
    console.error("Error retrieving user data from token:", error);
    return null;
  }
}

/**
 * Get user role from stored token
 * @returns {string|null} User role or null
 */
export function getUserRole() {
  const token = getAuthToken();
  
  if (!token) {
    console.warn("No auth token found");
    return null;
  }

  if (isTokenExpired(token)) {
    console.warn("Auth token has expired");
    clearAuthData();
    return null;
  }

  return getRoleFromToken(token);
}

/**
 * Get role-based dashboard route
 * @param {string} role - User role (CUSTOMER, ADMIN, etc.)
 * @returns {string} Dashboard route path
 */
export function getDashboardRoute(role) {
  if (!role) {
    return "/";
  }

  const roleUpper = role.toUpperCase();
  
  switch (roleUpper) {
    case "CUSTOMER":
      return "/customer";
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/staff";
    default:
      console.warn(`Unknown role: ${role}, redirecting to default`);
      return "/";
  }
}

/**
 * Clear all authentication data from localStorage AND cookies
 */
export function clearAuthData() {
  try {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_KEY);
    
    // Clear from cookies
    deleteCookie(TOKEN_KEY);
    
    console.log("Auth token cleared from localStorage and cookies");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export function isAuthenticated() {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    clearAuthData();
    return false;
  }

  return true;
}

/**
 * Handle login success - store data and get redirect route
 * @param {Object} authResponse - API response with user and token
 * @returns {string} Dashboard route to redirect to
 */
export function handleLoginSuccess(authResponse) {
  console.log("Processing login success:", authResponse);
  
  // Store auth data
  storeAuthData(authResponse);
  
  // Get role from token
  const role = getRoleFromToken(authResponse.token);
  
  if (!role) {
    console.error("Could not extract role from token");
    return "/";
  }
  
  // Get appropriate dashboard route
  const dashboardRoute = getDashboardRoute(role);
  
  console.log(`User role: ${role}, redirecting to: ${dashboardRoute}`);
  
  return dashboardRoute;
}
