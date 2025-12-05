/**
 * Auth Service - Handles authentication state management with HTTP-only cookies
 * 
 * SECURITY MODEL:
 * - Tokens (accessToken, refreshToken) are stored in HTTP-only cookies by backend
 * - Browser automatically sends cookies with every request
 * - JavaScript cannot access tokens (XSS protection)
 * - User data is fetched from /auth/me endpoint and stored in memory
 * - In-memory cache prevents excessive API calls
 * 
 * INDUSTRY BEST PRACTICES:
 * 1. HTTP-only cookies for token storage (OWASP recommendation)
 * 2. In-memory user state with cache invalidation
 * 3. Single source of truth via /auth/me endpoint
 * 4. Automatic re-fetch on page refresh
 * 5. Event-driven state updates across components
 */

import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_MENU_API_URL || 'http://localhost:8081';

// In-memory user state (cleared on page refresh)
let currentUser = null;
let isFetchingUser = false;
let userFetchPromise = null;

/**
 * Fetch current user from backend /auth/me endpoint
 * Uses HTTP-only cookie automatically sent by browser
 * Implements smart caching to prevent duplicate calls
 * 
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export async function fetchCurrentUser() {
  // Return cached user if available
  if (currentUser) {
    console.log('[AuthService] Returning cached user:', currentUser.email);
    return currentUser;
  }

  // If already fetching, return the existing promise to prevent duplicate calls
  if (isFetchingUser && userFetchPromise) {
    console.log('[AuthService] Fetch already in progress, waiting...');
    return userFetchPromise;
  }

  // Start new fetch
  isFetchingUser = true;
  userFetchPromise = (async () => {
    try {
      console.log('[AuthService] Fetching current user from /auth/me...');
      
      const response = await axios.get(`${BASE_URL}/api/v1/login/auth/me`, {
        withCredentials: true, // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.code === 200 && response.data.data) {
        currentUser = response.data.data;
        console.log('[AuthService] User fetched successfully:', currentUser.email, 'Role:', currentUser.role);
        return currentUser;
      } else {
        console.warn('[AuthService] Unexpected response format from /auth/me');
        currentUser = null;
        return null;
      }
    } catch (error) {
      console.error('[AuthService] Failed to fetch current user:', error.response?.status || error.message);
      currentUser = null;
      return null;
    } finally {
      isFetchingUser = false;
      userFetchPromise = null;
    }
  })();

  return userFetchPromise;
}

/**
 * Get current user from memory cache
 * Does NOT make API call - use fetchCurrentUser() for that
 * @returns {Object|null} Cached user object or null
 */
export function getUserData() {
  return currentUser;
}

/**
 * Get user ID from cached user data
 * @returns {number|null} User ID or null
 */
export function getUserId() {
  return currentUser?.id || null;
}

/**
 * Get user role from cached user data
 * @returns {string|null} User role or null
 */
export function getUserRole() {
  return currentUser?.role || null;
}

/**
 * Set user data in memory cache
 * Used after successful login or user fetch
 * @param {Object} userData - User object from backend
 */
export function setUserData(userData) {
  currentUser = userData;
  console.log('[AuthService] User data cached:', userData?.email);
}

/**
 * Clear user data from memory cache
 * Called on logout or authentication failure
 */
export function clearUserData() {
  currentUser = null;
  isFetchingUser = false;
  userFetchPromise = null;
  console.log('[AuthService] User data cleared from memory');
}

/**
 * Logout user - clears memory cache and calls backend logout endpoint
 * Backend will clear HTTP-only cookies
 * @returns {Promise<boolean>} Success status
 */
export async function logout() {
  try {
    console.log('[AuthService] Logging out...');
    
    // Call backend logout to clear HTTP-only cookies
    await axios.post(`${BASE_URL}/api/v1/login/logout`, {}, {
      withCredentials: true,
    });
    
    // Clear in-memory user data
    clearUserData();
    
    // Clear cart from localStorage
    localStorage.removeItem('cartItems');
    
    console.log('[AuthService] Logout successful');
    return true;
  } catch (error) {
    console.error('[AuthService] Logout error:', error);
    // Clear local state even if backend call fails
    clearUserData();
    localStorage.removeItem('cartItems');
    return false;
  }
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
      return "/";
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
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function isAuthenticated() {
  const user = await fetchCurrentUser();
  return user !== null;
}

/**
 * Handle login success - fetches user data and returns redirect route
 * Called after backend login returns success with HTTP-only cookies
 * 
 * @param {Object} loginResponse - Login response from backend (contains user data)
 * @returns {Promise<string>} Dashboard route to redirect to
 */
export async function handleLoginSuccess(loginResponse) {
  console.log('[AuthService] Processing login success...');
  
  // Fetch current user from /auth/me (HTTP-only cookie is now set)
  const user = await fetchCurrentUser();
  
  if (!user) {
    console.error('[AuthService] Failed to fetch user after login');
    return "/";
  }
  
  console.log(`[AuthService] User ${user.email} logged in, role: ${user.role}`);
  
  // Dispatch auth change events
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('authChange', { detail: { user } }));
  
  // Get appropriate dashboard route
  const dashboardRoute = getDashboardRoute(user.role);
  console.log(`[AuthService] Redirecting to: ${dashboardRoute}`);
  
  return dashboardRoute;
}
