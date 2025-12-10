import apiClient from './ApiClient';
import { getUserId,getUserEmail } from './AuthService';

const CHECKOUT_BASE_URL = '/api/v1/food-order';

/**
 * Create checkout session with complete order details
 * @param {Object} orderData - Complete order data
 * @param {number} orderData.amount - Total amount in LKR
 * @param {number} orderData.quantity - Always 1 for orders
 * @param {string} orderData.orderName - Summary of order items
 * @param {string} orderData.currency - Currency code (LKR)
 * @param {string} orderData.orderDescription - Detailed order description
 * @param {string} orderData.orderType - DINE_IN, TAKE_AWAY, or DELIVERY
 * @param {Array} orderData.orderFoodItems - Array of food items with details
 * @returns {Promise<Object>} Checkout session response with payment URL
 */
export async function createCheckoutSession(orderData) {
  try {
    const customerId = getUserId();
    const customerEmail= getUserEmail();
    
    if (!customerId) {
      throw new Error('User not authenticated. Please login again.');
    }
    
    const payload = {
      amount: orderData.amount,
      quantity: orderData.quantity || 1,
      orderName: orderData.orderName,
      currency: orderData.currency || 'LKR',
      customerId: customerId.toString(),
      customerEmail:customerEmail,
      orderDescription: orderData.orderDescription,
      orderType: orderData.orderType || 'DINE_IN',
      orderFoodItems: orderData.orderFoodItems
    };

    console.log('[CheckoutService] Creating checkout session with payload:', JSON.stringify(payload, null, 2));
    console.log('[CheckoutService] Food items:', payload.orderFoodItems);

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
 * Prepare complete order data from cart items for backend
 * Formats cart items into backend-expected structure with all required fields
 * 
 * @param {Array} cartItems - Array of cart items from Redux
 * @param {string} orderType - Order type: 'DINE_IN', 'TAKE_AWAY', or 'DELIVERY'
 * @returns {Object} Complete order data for checkout API
 */
export function prepareOrderData(cartItems, orderType = 'DineIn') {
  // Validate cart items
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty. Please add items before checkout.');
  }

  console.log('[CheckoutService] Preparing order data for cart items:', cartItems);

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (item.qty || 0);
  }, 0);

  // Add delivery fee (only for DELIVERY type)
  const deliveryFee = orderType === 'DELIVERY' ? 200.00 : 0;
  const totalAmount = subtotal + deliveryFee;

  // Create order name (short summary)
  const orderName = cartItems
    .map(item => `${item.name} (x${item.qty})`)
    .join(', ');

  // Create detailed description
  const orderDescription = `Order contains ${cartItems.length} item(s): ${
    cartItems.map(item => `${item.name} x${item.qty}`).join(', ')
  }${deliveryFee > 0 ? ` + Delivery Fee LKR ${deliveryFee.toFixed(2)}` : ''}`;

  // Format food items for backend
  const orderFoodItems = cartItems.map(item => {
    console.log('[CheckoutService] Processing cart item:', item);
    
    const foodItemId = item.foodItemId || item.id;
    const parsedFoodItemId = Number(foodItemId);
    
    // Validate foodItemId is a valid number
    if (isNaN(parsedFoodItemId) || parsedFoodItemId <= 0) {
      console.error('[CheckoutService] Invalid foodItemId for item:', item);
      console.error('[CheckoutService] Available fields - id:', item.id, 'foodItemId:', item.foodItemId, 'type:', typeof item.foodItemId);
      throw new Error(`Invalid food item ID for "${item.name}". The item doesn't have a valid numeric ID. Please clear your cart and re-add items from the menu.`);
    }
    
    return {
      itemName: item.name,
      qty: item.qty,
      amount: Number(item.price) || 0,
      foodItemId: parsedFoodItemId
    };
  });

  return {
    amount: totalAmount,
    quantity: 1, // Always 1 for the entire order
    orderName: orderName,
    currency: 'LKR',
    orderDescription: orderDescription,
    orderType: orderType,
    orderFoodItems: orderFoodItems
  };
}

/**
 * Verify payment success with backend
 * @param {string} sessionId - Stripe session ID from URL
 * @returns {Promise<Object>} Payment verification response
 */
export async function verifyPaymentSuccess(sessionId) {
  try {
    console.log('[CheckoutService] Verifying payment with session:', sessionId);
    
    const response = await apiClient.get(`${CHECKOUT_BASE_URL}/payment-success`, {
      params: { session_id: sessionId }
    });

    if (response.data.code === 200) {
      console.log('[CheckoutService] Payment verified successfully');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('[CheckoutService] Error verifying payment:', error);
    throw error;
  }
}
