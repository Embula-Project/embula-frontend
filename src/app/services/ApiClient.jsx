/**
 * Axios API Client for HTTP-only Cookie Authentication
 * 
 * SECURITY MODEL:
 * - Browser automatically sends HTTP-only cookies with every request
 * - No manual Authorization header needed
 * - Tokens are inaccessible to JavaScript (XSS protection)
 * 
 * FEATURES:
 * - Automatic cookie inclusion with withCredentials
 * - Token refresh on 401 errors
 * - Re-fetches user data after refresh
 */

import axios from 'axios';
import { fetchCurrentUser, clearUserData } from './AuthService';

const BASE_URL = process.env.NEXT_PUBLIC_MENU_API_URL || 'http://localhost:8081';

// Create axios instance with cookie support
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include HTTP-only cookies in all requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - no token manipulation needed (cookies handled by browser)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[apiClient] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[apiClient] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      console.error(`[apiClient] Error [${status}]:`, message);
      
      // Handle 401 Unauthorized - call refresh endpoint
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          console.log('[apiClient] Access token expired, calling refresh...');
          
          // Call backend refresh endpoint (uses HTTP-only refreshToken cookie)
          await axios.post(`${BASE_URL}/api/v1/login/refresh-token`, {}, {
            withCredentials: true,
          });
          
          console.log('[apiClient] Token refreshed, re-fetching user data...');
          
          // Re-fetch user data with new accessToken
          await fetchCurrentUser();
          
          // Retry original request (new accessToken cookie will be sent automatically)
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('[apiClient] Token refresh failed, clearing user data');
          clearUserData();
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/?login=true';
          }
          
          return Promise.reject(refreshError);
        }
      } else if (status === 403) {
        console.error('[apiClient] Forbidden - insufficient permissions');
      }
      
      // Reject with formatted error
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      console.error('[apiClient] No response from server');
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something else happened
      console.error('[apiClient] Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;
