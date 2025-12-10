'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPaymentSuccess } from '../services/CheckoutService';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('No payment session found');
      return;
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        console.log('[PaymentSuccess] Verifying payment for session:', sessionId);
        const response = await verifyPaymentSuccess(sessionId);
        
        if (response.code === 200) {
          setStatus('success');
          setOrderDetails(response.data);
        } else {
          setStatus('error');
          setErrorMessage(response.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('[PaymentSuccess] Verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to verify payment');
      }
    };

    verifyPayment();
  }, [searchParams]);

  // Verifying state
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500/30"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-t-amber-500"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Payment Verification Failed</h1>
          <p className="text-gray-400 mb-8">{errorMessage}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/customer/customerMenu')}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-300"
            >
              Back to Menu
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-300 text-lg mb-2">Thank you for your order</p>
          <p className="text-gray-400">Your payment has been confirmed and your order is being processed</p>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-gradient-to-br from-black to-gray-900 border border-green-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order Details
            </h2>

            <div className="space-y-4">
              {orderDetails.orderId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white font-mono font-semibold">#{orderDetails.orderId}</span>
                </div>
              )}
              
              {orderDetails.paymentId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Payment ID</span>
                  <span className="text-white font-mono text-sm">{orderDetails.paymentId}</span>
                </div>
              )}

              {orderDetails.amount && (
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-green-400 font-bold text-xl">{orderDetails.amount} LKR</span>
                </div>
              )}

              {orderDetails.orderType && (
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Order Type</span>
                  <span className="text-white font-semibold">{orderDetails.orderType.replace('_', ' ')}</span>
                </div>
              )}

              {orderDetails.status && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Status</span>
                  <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                    {orderDetails.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">What's Next?</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Your order is being prepared by our kitchen</li>
                <li>• You will receive updates about your order status</li>
                <li>• Keep your order ID for reference</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/customer/customerMenu')}
            className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-300"
          >
            Order More
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
