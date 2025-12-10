'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, clearCart } from '../../store/cartSlice';
import { getUserData, fetchCurrentUser } from '../services/AuthService';
import { createCheckoutSession, prepareOrderData } from '../services/CheckoutService';
import ErrorDialog from '../components/ErrorDialog';
import { useErrorDialog } from '../hooks/UseErrorDialog';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [orderType, setOrderType] = useState('DineIn'); // DINE_IN, TAKE_AWAY, DELIVERY
  const { error, showError, clearError } = useErrorDialog();

  useEffect(() => {
    // Load user data (middleware already verified authentication)
    const loadUserData = async () => {
      // Check memory cache first
      let user = getUserData();
      
      // If not cached, fetch from backend
      if (!user) {
        console.log('[Checkout] Fetching user data from /auth/me...');
        user = await fetchCurrentUser();
      }
      
      setUserData(user);
      setIsLoading(false);

      // If cart is empty, redirect to menu
      if (cartItems.length === 0) {
        router.push('/menu');
      }
    };

    loadUserData();
  }, [cartItems, router]);

  // Show loading state only while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Middleware ensures user is authenticated and has CUSTOMER role
  // Show checkout page
  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 0), 0);
  const deliveryFee = orderType === 'DELIVERY' ? 200.00 : 0;
  const totalAmount = totalPrice + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessingPayment(true);
    try {
      // Prepare order data from cart items with selected order type
      const orderData = prepareOrderData(cartItems, orderType);
      
      console.log('Placing order with data:', orderData);
      
      // Create checkout session
      const session = await createCheckoutSession(orderData);
      
      if (session.sessionUrl) {
        // Show confirmation dialog before redirect
        setPaymentUrl(session.sessionUrl);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showError(error.message || 'Failed to process checkout. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmRedirect = () => {
    // Clear cart from Redux store
    dispatch(clearCart());
    
    // Clear cart from localStorage
    localStorage.removeItem('cartItems');
    
    console.log('[Checkout] Cart cleared, redirecting to payment');
    
    // Open Stripe payment page in new tab
    window.open(paymentUrl, '_blank');
    
    // Reset state and redirect to customer dashboard
    setPaymentUrl(null);
    setIsProcessingPayment(false);
    
    // Redirect to home page after short delay
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleCancelRedirect = () => {
    // User cancelled - stay on Embula site
    setPaymentUrl(null);
    setIsProcessingPayment(false);
  };

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title="Checkout Error"
      />
      
      {/* Payment Redirect Confirmation Modal */}
      {paymentUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative max-w-md w-full mx-4">
            <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-500/50 rounded-xl shadow-2xl p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Leaving Embula Site
              </h2>
              <p className="text-gray-300 text-center mb-6">
                You are about to be redirected to our secure payment provider (Stripe) to complete your order. 
                You will leave the Embula website temporarily.
              </p>

              {/* Security Note */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-green-300 text-sm">
                    Your payment information is processed securely by Stripe. We never store your card details.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCancelRedirect}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRedirect}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    <div className="min-h-screen bg-black">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Checkout
            </h1>
            <p className="text-gray-300">Review your order and complete payment</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-black/50 border border-amber-900/20 rounded-lg">
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-800">
                        {item.imageType && item.imageData ? (
                          <img src={`data:${item.imageType};base64,${item.imageData}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Quantity: {item.qty}</p>
                        <p className="text-amber-400 font-bold mt-1">{(Number(item.price) || 0) * (item.qty || 0)} LKR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Type Selection */}
              <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dine In */}
                  <button
                    onClick={() => setOrderType('DINE_IN')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      orderType === 'DINE_IN'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-700 bg-black/50 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className={`w-8 h-8 ${
                        orderType === 'DINE_IN' ? 'text-amber-400' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className={`font-semibold ${
                        orderType === 'DINE_IN' ? 'text-amber-400' : 'text-gray-300'
                      }`}>Dine In</span>
                    </div>
                  </button>

                  {/* Take Away */}
                  <button
                    onClick={() => setOrderType('TakeAway')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      orderType === 'TAKE_AWAY'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-700 bg-black/50 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className={`w-8 h-8 ${
                        orderType === 'TAKE_AWAY' ? 'text-amber-400' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className={`font-semibold ${
                        orderType === 'TAKE_AWAY' ? 'text-amber-400' : 'text-gray-300'
                      }`}>Take Away</span>
                    </div>
                  </button>

                  {/* Delivery */}
                  <button
                    onClick={() => setOrderType('DELIVERY')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      orderType === 'DELIVERY'
                        ? 'border-amber-500 bg-amber-500/20'
                        : 'border-gray-700 bg-black/50 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className={`w-8 h-8 ${
                        orderType === 'DELIVERY' ? 'text-amber-400' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <span className={`font-semibold ${
                        orderType === 'DELIVERY' ? 'text-amber-400' : 'text-gray-300'
                      }`}>Delivery</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {orderType === 'DELIVERY' ? 'Delivery Details' : 'Customer Details'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/50 border border-amber-900/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-semibold">{userData?.firstName} {userData?.lastName}</p>
                  </div>
                  {orderType === 'DELIVERY' && (
                    <div className="bg-black/50 border border-amber-900/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                      <p className="text-white font-semibold">{userData?.address || 'Not provided'}</p>
                    </div>
                  )}
                  <div className="bg-black/50 border border-amber-900/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                    <p className="text-white font-semibold">{userData?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(2)} LKR</span>
                  </div>
                  {orderType === 'DELIVERY' && (
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee.toFixed(2)} LKR</span>
                    </div>
                  )}
                  <div className="border-t border-amber-900/30 pt-4 flex justify-between text-xl font-bold text-amber-400">
                    <span>Total</span>
                    <span>{totalAmount.toFixed(2)} LKR</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${
                    isProcessingPayment
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white hover:shadow-amber-500/50 hover:scale-105'
                  }`}
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-gray-400 text-xs text-center mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
