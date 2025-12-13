/**
 * Order Service - Handles order-related API calls
 * Uses apiClient with automatic Bearer token authentication
 */

import apiClient from './ApiClient';

/**
 * Submit an order (example - requires backend endpoint)
 * @param {Object} orderData - Order details
 * @param {Array} orderData.items - Cart items with {id, name, price, qty}
 * @param {Object} orderData.deliveryInfo - Delivery information
 * @returns {Promise<Object>} Order response
 */
export async function submitOrder(orderData) {
  try {
    console.log('Submitting order:', orderData);
    
    const response = await apiClient.post('/api/v1/orders/create', orderData);
    
    console.log('Order submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to submit order:', error.message);
    throw error;
  }
}

/**
 * Get user's order history
 * @returns {Promise<Array>} List of orders
 */
export async function getUserOrders() {
  try {
    const response = await apiClient.get('/api/v1/orders/my-orders');
    
    console.log('Fetched user orders:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user orders:', error.message);
    throw error;
  }
}

/**
 * Get order details by ID
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export async function getOrderById(orderId) {
  try {
    const response = await apiClient.get(`/api/v1/orders/${orderId}`);
    
    console.log('Fetched order details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error.message);
    throw error;
  }
}

/**
 * Cancel an order
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelOrder(orderId) {
  try {
    const response = await apiClient.post(`/api/v1/orders/${orderId}/cancel`);
    
    console.log('Order cancelled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel order:', error.message);
    throw error;
  }
}

/**
 * Get all orders with pagination (Admin)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated orders response
 */
export async function getAllOrders(page = 0, size = 10) {
  try {
    const response = await apiClient.get('/api/v1/order', {
      params: { page, size }
    });
    
    console.log('Fetched all orders:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all orders:', error.message);
    throw error;
  }
}

/**
 * Update order status (Admin)
 * @param {string|number} orderId - Order ID
 * @param {string} orderStatus - New status (Pending, Completed, Cancelled)
 * @returns {Promise<Object>} Update response
 */
export async function updateOrderStatus(orderId, orderStatus) {
  try {
    const response = await apiClient.put('/api/v1/order', null, {
      params: { orderId, orderStatus }
    });
    
    console.log('Order status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update order status:', error.message);
    throw error;
  }
}
