/**
 * useAuth Hook - Custom React hook for authentication
 * Provides easy access to auth functions in components
 */

"use client";
import { useState, useEffect } from "react";
import { 
  isAuthenticated, 
  getUserRole, 
  getUserData, 
  clearAuthData,
  getAuthToken 
} from "./AuthService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    
    const isAuth = isAuthenticated();
    setAuthenticated(isAuth);

    if (isAuth) {
      const userData = getUserData();
      const userRole = getUserRole();
      
      setUser(userData);
      setRole(userRole);
    } else {
      setUser(null);
      setRole(null);
    }

    setLoading(false);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    setRole(null);
    setAuthenticated(false);
  };

  const getToken = () => {
    return getAuthToken();
  };

  return {
    user,
    role,
    authenticated,
    loading,
    logout,
    getToken,
    checkAuth,
  };
}
