import apiClient from './ApiClient';

/**
 * Service for user management operations
 */

/**
 * Fetch all users
 * @returns {Promise} Promise resolving to array of users
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/v1/user/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Update user status (set to INACTIVE or ACTIVE)
 * @param {string} userId - The ID of the user
 * @param {string} status - The new status (ACTIVE or INACTIVE)
 * @returns {Promise} Promise resolving to updated user data
 */
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await apiClient.patch(`/api/v1/user/setStatus/${userId}`, {
      status: status
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user status for user ${userId}:`, error);
    throw error;
  }
};
