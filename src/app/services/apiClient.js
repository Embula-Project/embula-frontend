/**
 * Axios API Client with Auth Interceptor
 * Automatically adds Bearer token to requests
 * Handles automatic token refresh on 401 errors
 */

import axios from 'axios';
import { getAuthToken } from './authService';
import { refreshAccessToken } from './tokenRefreshService';

const BASE_URL = process.env.NEXT_PUBLIC_MENU_API_URL || 'http://localhost:8081';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - adds auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Get access token from storage
    const token = getAuthToken();
    
    if (token) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Bearer access token to request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
      
      console.error(`API Error [${status}]:`, message);
      
      // Handle 401 Unauthorized - try to refresh token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          console.log('Access token expired, attempting refresh...');
          const newAccessToken = await refreshAccessToken();
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      } else if (status === 403) {
        console.error('Forbidden - insufficient permissions');
      }
      
      // Reject with formatted error
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;
