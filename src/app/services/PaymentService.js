import apiClient from './ApiClient';

/**
 * Service for payment operations (Admin)
 */

/**
 * Get all payments
 * @returns {Promise} Promise resolving to array of payments
 */
export const getAllPayments = async () => {
  try {
    const response = await apiClient.get('/api/v1/payments');
    console.log('Fetched payments:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};
