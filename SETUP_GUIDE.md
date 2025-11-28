# Quick Setup Instructions

## 1. Install Axios
The apiClient requires axios. Install it:

```bash
npm install axios
```

## 2. Verify Environment Variables
Check `.env.local` has:
```bash
NEXT_PUBLIC_MENU_API_URL=http://localhost:8081
```

## 3. Test the Changes

### Test Cart Persistence
```bash
# Start dev server
npm run dev

# Navigate to http://localhost:3000/customer/customerMenu
# Add items to cart
# Refresh page → verify cart items remain
```

### Test Cart Total Calculation
- Add items to cart
- Open cart popup
- Verify total shows correct number (not NaN)
- Click increment/decrement
- Verify total updates correctly

### Test Authentication Flow
```bash
# 1. Without login, try to access checkout
http://localhost:3000/customer/checkout
# → Should redirect to /?login=true&redirect=/customer/checkout

# 2. Login with credentials
# 3. Try checkout again → Should show checkout page with user details

# 4. Check browser DevTools:
# - Application → Local Storage → Should see "authToken" and "userData"
# - Application → Cookies → Should see "authToken" cookie
# - Application → Local Storage → Should see "cartItems" array
```

### Test API Interceptor
After implementing backend order endpoint:

```javascript
// In checkout page or any component
import { submitOrder } from '../../services/orderService';

const handlePlaceOrder = async () => {
  try {
    const orderData = {
      items: cartItems,
      deliveryInfo: userData,
    };
    
    const result = await submitOrder(orderData);
    console.log('Order placed:', result);
    
    // Check Network tab in DevTools
    // Request headers should include: Authorization: Bearer <token>
  } catch (error) {
    console.error('Order failed:', error);
  }
};
```

## 4. Common Issues & Fixes

### Issue: "axios is not defined"
**Solution**: Run `npm install axios`

### Issue: Cart total shows NaN
**Solution**: Already fixed - ensure you're using latest code

### Issue: Cart clears on refresh
**Solution**: Check browser console for localStorage errors, ensure store.js has subscription code

### Issue: Checkout redirects to login even when logged in
**Solution**: 
1. Check browser cookies for "authToken"
2. Check token hasn't expired (JWT exp claim)
3. Verify middleware.js is checking correct cookie name

### Issue: API calls don't have Bearer token
**Solution**: 
1. Verify you're importing from `apiClient.js`
2. Check token exists in localStorage
3. Check apiClient interceptor console logs

## 5. File Changes Summary

**Modified Files:**
- ✅ `src/store/cartSlice.js` - Persistence + numeric handling
- ✅ `src/store/store.js` - localStorage subscriber
- ✅ `src/app/customer/components/CartPopup.jsx` - qty/name fix
- ✅ `src/app/customer/checkout/page.jsx` - qty/name fix
- ✅ `src/app/services/authService.js` - Enhanced storage
- ✅ `src/middleware.js` - Protected checkout
- ✅ `src/app/customer/page.jsx` - Amber theme

**New Files:**
- 🆕 `src/app/services/apiClient.js` - Axios interceptor
- 🆕 `src/app/services/orderService.js` - Example API calls
- 🆕 `AUTHENTICATION_CART_IMPLEMENTATION.md` - Full documentation

## 6. Verify All Features

Run through this checklist:

- [ ] `npm install axios` completed
- [ ] Dev server running (`npm run dev`)
- [ ] Can add items to cart
- [ ] Cart total shows correct number
- [ ] Cart persists after page refresh
- [ ] Can login successfully
- [ ] Token stored in cookies and localStorage
- [ ] Checkout redirects to login when not authenticated
- [ ] Checkout shows user details when authenticated
- [ ] Cart remains intact through login/logout
- [ ] API calls include Bearer token (check Network tab)

## 7. Testing with Backend

When backend is ready:

```javascript
// Example: Update checkout page to actually submit order
import { submitOrder } from '../../services/orderService';
import { clearCart } from '../../../store/cartSlice';

const handlePlaceOrder = async () => {
  try {
    setIsSubmitting(true);
    
    const orderData = {
      items: cartItems.map(item => ({
        foodItemId: item.id,
        quantity: item.qty,
        price: item.price
      })),
      deliveryAddress: userData.address,
      phoneNumber: userData.phoneNumber,
      totalAmount: totalPrice + 200, // Including delivery
    };
    
    const result = await submitOrder(orderData);
    
    // Success - clear cart and redirect
    dispatch(clearCart());
    router.push(`/customer/orders/${result.orderId}`);
    
  } catch (error) {
    alert(`Order failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};
```

## 8. Backend Integration Checklist

Ensure backend implements:

- [ ] `POST /api/v1/login/authentication` returns `{user, token}`
- [ ] JWT token includes: `role`, `sub` (email), `firstName`, `lastName`, `exp`
- [ ] `POST /api/v1/orders/create` accepts Bearer token in header
- [ ] All protected endpoints validate Bearer token
- [ ] Token expiration is reasonable (e.g., 5 hours)
- [ ] CORS configured to allow cookies and Authorization header

## 9. Production Considerations

Before deploying:

1. **Secure cookies**: Add `Secure; HttpOnly; SameSite=Strict` flags
2. **Token refresh**: Implement refresh token logic for expired tokens
3. **Error handling**: Add user-friendly error messages
4. **Loading states**: Show spinners during API calls
5. **Validation**: Validate cart items before checkout
6. **HTTPS**: Ensure production uses HTTPS for secure cookies
7. **Environment**: Use production API URL in prod environment

## 10. Quick Commands

```bash
# Install dependencies
npm install axios

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

