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

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_ID_KEY = "userId";

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
 * Store authentication tokens in localStorage AND cookies
 * User data is extracted from the JWT token when needed via getUserData()
 * @param {Object} authData - Authentication response from API
 * @param {string} authData.accessToken - JWT access token containing user data
 * @param {string} authData.refreshToken - JWT refresh token for token renewal
 */
export function storeAuthData(authData) {
  if (!authData || !authData.accessToken) {
    console.error("Invalid auth data provided to storeAuthData");
    return;
  }

  try {
    // Store access token in localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    
    // Store refresh token in localStorage
    if (authData.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    }
    
    // Store user ID if present (needed for checkout)
    if (authData.user && authData.user.id) {
      localStorage.setItem(USER_ID_KEY, authData.user.id.toString());
    }
    
    // Store access token in cookies for middleware access
    setCookie(ACCESS_TOKEN_KEY, authData.accessToken, 7); // 7 days expiration
    
    console.log("Access and refresh tokens stored successfully");
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
}

/**
 * Get stored access token
 * @returns {string|null} Access token or null if not found
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
}

/**
 * Get stored refresh token
 * @returns {string|null} Refresh token or null if not found
 */
export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return null;
  }
}

/**
 * Get stored user ID
 * @returns {number|null} User ID or null if not found
 */
export function getUserId() {
  try {
    const userId = localStorage.getItem(USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
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
 * Also clears cart data on logout
 */
export function clearAuthData() {
  try {
    // Clear tokens from localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    
    // Clear cart items from localStorage
    localStorage.removeItem('cartItems');
    
    // Clear all other potential localStorage items
    localStorage.clear();
    
    // Clear access token from cookies
    deleteCookie(ACCESS_TOKEN_KEY);
    
    console.log("Auth tokens and cart cleared from localStorage and cookies");
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
 * @param {Object} authResponse - API response with user, accessToken, and refreshToken
 * @returns {string} Dashboard route to redirect to
 */
export function handleLoginSuccess(authResponse) {
  console.log("Processing login success:", authResponse);
  
  // Store auth data
  storeAuthData(authResponse);
  
  // Get role from access token
  const role = getRoleFromToken(authResponse.accessToken);
  
  if (!role) {
    console.error("Could not extract role from access token");
    return "/";
  }
  
  // Get appropriate dashboard route
  const dashboardRoute = getDashboardRoute(role);
  
  console.log(`User role: ${role}, redirecting to: ${dashboardRoute}`);
  
  return dashboardRoute;
}
