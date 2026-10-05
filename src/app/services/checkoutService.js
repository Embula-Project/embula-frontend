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
 * @param {string} orderData.orderType - DineIn, TakeAway, or Delivery
 * @param {Array} orderData.orderFoodItems - Array of food items with details
 * @param {string} [orderData.scheduledDate] - Requested date (yyyy-MM-dd) for DineIn/TakeAway
 * @param {string} [orderData.scheduledTime] - Requested time (HH:mm) for DineIn/TakeAway
 * @param {string} [orderData.deliveryAddress] - Delivery address for Delivery orders
 * @param {string} [orderData.deliveryPhone] - Delivery contact phone for Delivery orders
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
      orderType: orderData.orderType || 'DineIn',
      orderFoodItems: orderData.orderFoodItems,
      scheduledDate: orderData.scheduledDate,
      scheduledTime: orderData.scheduledTime,
      deliveryAddress: orderData.deliveryAddress,
      deliveryPhone: orderData.deliveryPhone
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
 * @param {string} orderType - Order type: 'DineIn', 'TakeAway', or 'Delivery'
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

  // Add delivery fee (only for Delivery type)
  const deliveryFee = orderType === 'Delivery' ? 200.00 : 0;
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

const LAST_ORDER_FAILED_KEY = 'lastOrderFailed';
const LAST_ORDER_SUCCEEDED_KEY = 'lastOrderSucceeded';

/**
 * Clear the cart from localStorage after a confirmed order outcome.
 * Call after payment is verified as successful, or after it fails/is cancelled.
 *
 * Note: this only clears localStorage. The checkout tab that still holds the
 * cart in Redux is a *different* browser tab (Stripe opens in a new tab), so
 * it won't see this change on its own — pair this with markLastOrderSucceeded()
 * or markLastOrderFailed() so that tab can clear its Redux state too once the
 * user returns to it (see consumeLastOrderSucceeded/consumeLastOrderFailed).
 */
export function clearPendingCart() {
  try {
    localStorage.removeItem('cartItems');
  } catch (e) {
    console.error('[CheckoutService] Failed to clear cart from localStorage', e);
  }
}

/**
 * Mark that the last checkout attempt succeeded, so the tab the user returns
 * to (e.g. Home) can clear its in-memory Redux cart, which otherwise doesn't
 * know the order in the other tab was completed.
 */
export function markLastOrderSucceeded() {
  try {
    localStorage.setItem(LAST_ORDER_SUCCEEDED_KEY, '1');
  } catch (e) {
    console.error('[CheckoutService] Failed to persist order-succeeded flag', e);
  }
}

/**
 * Read and clear the "last order succeeded" flag (one-time read).
 * @returns {boolean} True if a successful order is pending acknowledgement
 */
export function consumeLastOrderSucceeded() {
  try {
    const flag = localStorage.getItem(LAST_ORDER_SUCCEEDED_KEY);
    if (flag) {
      localStorage.removeItem(LAST_ORDER_SUCCEEDED_KEY);
    }
    return !!flag;
  } catch (e) {
    console.error('[CheckoutService] Failed to read order-succeeded flag', e);
    return false;
  }
}

/**
 * Mark that the last checkout attempt failed/was cancelled, so the next page
 * the user lands on (e.g. Home) can show a one-time notice.
 * @param {string} [message] - Optional reason to display
 */
export function markLastOrderFailed(message) {
  try {
    localStorage.setItem(LAST_ORDER_FAILED_KEY, message || 'Your last order could not be completed.');
  } catch (e) {
    console.error('[CheckoutService] Failed to persist order-failed flag', e);
  }
}

/**
 * Read and clear the "last order failed" flag (one-time read).
 * @returns {string|null} The failure message if one is pending, otherwise null
 */
export function consumeLastOrderFailed() {
  try {
    const message = localStorage.getItem(LAST_ORDER_FAILED_KEY);
    if (message) {
      localStorage.removeItem(LAST_ORDER_FAILED_KEY);
    }
    return message;
  } catch (e) {
    console.error('[CheckoutService] Failed to read order-failed flag', e);
    return null;
  }
}
