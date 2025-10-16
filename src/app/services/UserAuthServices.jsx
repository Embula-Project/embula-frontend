const base_URL = process.env.NEXT_PUBLIC_MENU_API_URL;

export async function registerUser(userData) {
  const res = await fetch(`${base_URL}/api/v1/user/register-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to register user");
  }
  
  return res.json();
}
