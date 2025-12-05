import apiClient from './ApiClient';

export async function loginUser(credentials){
  try{
    const response = await apiClient.post('/api/v1/login/authentication', credentials);
    console.log("[UserAuthServices] Login successful, cookies set by backend");
    return response.data;
  }catch(error){
    throw new Error(error.message || "Login failed. Invalid credentials.");
  }
}

export async function registerUser(userData){
  try{
    const response = await apiClient.post('/api/v1/user/register-user', userData);
    return response.data;
  }catch(error){
    throw new Error(error.message || "Failed to register user");
  }
}
