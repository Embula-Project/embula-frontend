'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../../store/cartSlice';
import { getUserData } from '../../services/authService';

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load user data from JWT token (middleware already verified authentication)
    const user = getUserData();
    setUserData(user);
    setIsLoading(false);

    // If cart is empty, redirect to menu
    if (cartItems.length === 0) {
      router.push('/customer/customerMenu');
    }
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

  return (
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
                        {item.imageSrc ? (
                          <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" />
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

              {/* Delivery Details */}
              <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/50 border border-amber-900/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-semibold">{userData?.firstName} {userData?.lastName}</p>
                  </div>
                  <div className="bg-black/50 border border-amber-900/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Delivery Address</p>
                    <p className="text-white font-semibold">{userData?.address || 'Not provided'}</p>
                  </div>
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
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Fee</span>
                    <span>200.00 LKR</span>
                  </div>
                  <div className="border-t border-amber-900/30 pt-4 flex justify-between text-xl font-bold text-amber-400">
                    <span>Total</span>
                    <span>{(totalPrice + 200).toFixed(2)} LKR</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Order placed successfully! (This is a demo)');
                    router.push('/customer');
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105"
                >
                  Place Order
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
  );
}
