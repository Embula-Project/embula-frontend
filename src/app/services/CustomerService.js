import apiClient from './ApiClient';

const CUSTOMER_BASE_URL = '/api/v1/customer';

/**
 * Fetch a customer's profile (including address and phone) by id
 * @param {string} customerId - The customer's id
 * @returns {Promise<Object>} Customer data: { id, firstName, lastName, email, status, address, phone }
 */
export async function getCustomerById(customerId) {
  try {
    const response = await apiClient.get(`${CUSTOMER_BASE_URL}/${customerId}`);

    if (response.data.code === 200 && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch customer');
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
}
