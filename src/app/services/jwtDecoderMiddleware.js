/**
 * JWT Decoder Middleware Service
 * Decodes JWT tokens for middleware authentication
 */

/**
 * Decode JWT token in middleware context
 * @param {string} token - JWT token string
 * @returns {Promise<Object>} Decoded token payload
 */
export async function decodeJwtTokenMiddleware(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided");
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Base64 decode - handle URL-safe base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add padding if needed
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    
    // Decode base64
    const jsonPayload = Buffer.from(paddedBase64, "base64").toString("utf-8");
    const decoded = JSON.parse(jsonPayload);

    // Check if token is expired
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        throw new Error("Token has expired");
      }
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT in middleware:", error.message);
    throw error;
  }
}

/**
 * Extract role from decoded JWT token
 * @param {Object} decoded - Decoded JWT payload
 * @returns {string|null} User role
 */
export function getRoleFromDecodedToken(decoded) {
  if (!decoded) {
    return null;
  }

  // Check for role in common JWT claim locations
  return decoded.role || decoded.Role || decoded.ROLE || decoded.authorities?.[0] || null;
}
