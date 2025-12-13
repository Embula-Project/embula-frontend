/**
 * useAuth Hook - Manages authentication state across the application
 * 
 * Features:
 * - Auto-fetches user on mount if not cached
 * - Subscribes to auth change events
 * - Prevents duplicate API calls with smart caching
 * - Returns loading state for better UX
 */

import { useState, useEffect } from 'react';
import { getUserData, fetchCurrentUser } from '../services/AuthService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        // Check memory cache first
        let userData = getUserData();
        
        // If cached, use it immediately for faster rendering
        if (userData) {
          console.log('[useAuth] User already cached:', userData.email);
          if (mounted) {
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
          }
          return;
        }
        
        // If not cached (page refresh), try fetching from backend
        console.log('[useAuth] User not cached, fetching from /auth/me...');
        userData = await fetchCurrentUser();
        
        if (mounted) {
          setUser(userData);
          setIsAuthenticated(!!userData);
          setIsLoading(false);
          console.log('[useAuth] Auth state ready - User:', userData?.email || 'none');
        }
      } catch (error) {
        console.error('[useAuth] Error loading user:', error);
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    loadUser();

    // Listen for auth changes
    const handleAuthChange = (event) => {
      console.log('[useAuth] Auth change event received');
      const userData = event.detail?.user || getUserData();
      if (mounted) {
        setUser(userData);
        setIsAuthenticated(!!userData);
        setIsLoading(false);
      }
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      mounted = false;
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
