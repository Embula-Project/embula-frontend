/**
 * Token Refresh Service
 * Handles automatic token refresh using refresh token
 */

import axios from 'axios';
import { getRefreshToken, storeAuthData, clearAuthData } from './authService';

const BASE_URL = process.env.NEXT_PUBLIC_MENU_API_URL || 'http://localhost:8081';

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh completion
 * @param {Function} callback - Function to call when token is refreshed
 */
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers that token has been refreshed
 * @param {string} token - New access token
 */
function onTokenRefreshed(token) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<string>} New access token
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // If already refreshing, wait for it to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    console.log('Refreshing access token...');
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/login/refresh-token`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      throw new Error('No access token in refresh response');
    }

    // Store new tokens
    storeAuthData({
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });

    console.log('Access token refreshed successfully');

    // Notify all waiting requests
    onTokenRefreshed(accessToken);

    isRefreshing = false;
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    isRefreshing = false;
    
    // Clear auth data and redirect to login
    clearAuthData();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/?login=true';
    }
    
    throw error;
  }
}
