import apiClient from './ApiClient';
import { getUserId } from './AuthService';

const CHECKOUT_BASE_URL = '/api/v1/food-order';

/**
 * Create checkout session for order
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Total amount in LKR
 * @param {number} orderData.quantity - Always 1 for orders
 * @param {string} orderData.orderName - Comma-separated food item names
 * @param {string} orderData.currency - Currency code (default: LKR)
 * @returns {Promise<Object>} Checkout session response
 */
export async function createCheckoutSession(orderData) {
  try {
    const customerId = getUserId();
    
    if (!customerId) {
      throw new Error('User not authenticated. Please login again.');
    }
    
    const payload = {
      amount: orderData.amount,
      quantity: orderData.quantity || 1,
      orderName: orderData.orderName,
      currency: orderData.currency || 'USD',
      customer_id: customerId
    };

    console.log('Creating checkout session with payload:', payload);

    const response = await apiClient.post(`${CHECKOUT_BASE_URL}/checkout`, payload);
    
    if (response.data.code === 200 && response.data.data) {
      console.log('Checkout session created successfully:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error.response) {
      throw new Error(
        error.response.data?.message || 
        `Checkout failed: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred during checkout');
    }
  }
}

/**
 * Prepare order data from cart items
 * @param {Array} cartItems - Array of cart items
 * @returns {Object} Order data for checkout
 */
export function prepareOrderData(cartItems) {
  // Calculate total amount
  const amount = cartItems.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (item.qty || 0);
  }, 0);

  // Add delivery fee
  const deliveryFee = 200.00;
  const totalAmount = amount + deliveryFee;

  // Create order name from all items
  const orderName = cartItems
    .map(item => `${item.name} (x${item.qty})`)
    .join(', ');

  return {
    amount: totalAmount,
    quantity: 1, // Always 1 for the entire order
    orderName: orderName,
    currency: 'LKR'
  };
}
