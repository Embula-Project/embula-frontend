const base_URL = process.env.NEXT_PUBLIC_MENU_API_URL;

/**
 * Login user with HTTP-only cookie authentication
 * Backend sets accessToken and refreshToken in HTTP-only cookies
 * @param {Object} credentials - {username, password}
 * @returns {Promise<Object>} Login response with user data
 */
export async function loginUser(credentials) {
  const res = await fetch(`${base_URL}/api/v1/login/authentication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in request/response
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed. Invalid credentials.");
  }
  
  const response = await res.json();
  console.log("[UserAuthServices] Login successful, cookies set by backend");
  return response;
}

export async function registerUser(userData) {
  const res = await fetch(`${base_URL}/api/v1/user/register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to register user");
  }
  
  return res.json();
}
