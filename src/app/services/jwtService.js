/**
 * JWT Service - Handles JWT token decoding and validation
 * Placed in src/app/services as per project structure
 */

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token string
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token || typeof token !== "string") {
    console.error("Invalid token provided to decodeJWT");
    return null;
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    
    if (parts.length !== 3) {
      console.error("Invalid JWT format - expected 3 parts");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Base64 decode - handle URL-safe base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    console.log("Decoded JWT payload:", decoded);
    
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Extract role from decoded JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} User role (CUSTOMER, ADMIN, etc.) or null
 */
export function getRoleFromToken(token) {
  const decoded = decodeJWT(token);
  
  if (!decoded) {
    return null;
  }

  // Check for role in common JWT claim locations
  const role = decoded.role || decoded.Role || decoded.ROLE || decoded.authorities?.[0];
  
  if (role) {
    console.log("Extracted role from token:", role);
    return role;
  }

  console.warn("No role found in JWT token");
  return null;
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  const isExpired = decoded.exp < currentTime;
  
  if (isExpired) {
    console.warn("JWT token has expired");
  }
  
  return isExpired;
}

/**
 * Get user information from JWT token
 * @param {string} token - JWT token string
 * @returns {Object|null} User info object or null
 */
export function getUserInfoFromToken(token) {
  const decoded = decodeJWT(token);
  
  if (!decoded) {
    return null;
  }

  return {
    email: decoded.sub || decoded.email || decoded.username,
    firstName: decoded.firstName || decoded.first_name,
    lastName: decoded.lastName || decoded.last_name,
    role: decoded.role || decoded.Role,
    exp: decoded.exp,
    iat: decoded.iat,
  };
}
