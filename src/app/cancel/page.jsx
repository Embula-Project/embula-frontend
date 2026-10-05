'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearPendingCart, markLastOrderFailed } from '../services/checkoutService';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Stripe redirected here because the payment was cancelled or not completed.
    markLastOrderFailed('Your last order was not completed because the payment was cancelled.');
    clearPendingCart();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled and no order was placed. Your cart has been cleared — feel free to start a new order.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/menu')}
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
