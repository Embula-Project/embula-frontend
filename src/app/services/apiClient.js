/**
 * Axios API Client with Auth Interceptor
 * Automatically adds Bearer token to requests
 */

import axios from 'axios';
import { getAuthToken } from './authService';

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
    // Get token from storage
    const token = getAuthToken();
    
    if (token) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Bearer token to request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      console.error(`API Error [${status}]:`, message);
      
      // Handle specific status codes
      if (status === 401) {
        console.error('Unauthorized - token may be expired');
        // Could dispatch logout action here if needed
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
