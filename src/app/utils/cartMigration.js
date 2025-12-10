/**
 * Cart Migration Utility
 * Handles clearing old cart items that don't have proper foodItemId
 */

/**
 * Check if cart items have valid foodItemId and clear if not
 * Should be called on app startup
 */
export function validateAndMigrateCart() {
  if (typeof window === 'undefined') return;
  
  try {
    const cartItemsRaw = localStorage.getItem('cartItems');
    if (!cartItemsRaw) return;
    
    const cartItems = JSON.parse(cartItemsRaw);
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;
    
    // Check if any items are missing foodItemId
    const hasInvalidItems = cartItems.some(item => {
      const foodItemId = item.foodItemId || item.id;
      const parsed = Number(foodItemId);
      return isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed);
    });
    
    if (hasInvalidItems) {
      console.warn('[CartMigration] Found cart items without valid foodItemId. Clearing cart...');
      localStorage.removeItem('cartItems');
      
      // Show notification to user
      if (cartItems.length > 0) {
        console.info('[CartMigration] Cart cleared. Please re-add items from menu.');
        // You can dispatch a toast notification here if you have a toast system
      }
    } else {
      console.log('[CartMigration] Cart validation passed. All items have valid foodItemId.');
    }
  } catch (error) {
    console.error('[CartMigration] Error during cart validation:', error);
    // If there's any error, clear the cart to be safe
    localStorage.removeItem('cartItems');
  }
}
