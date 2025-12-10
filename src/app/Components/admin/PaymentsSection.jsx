'use client';
import { useState, useEffect } from 'react';

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch payments from backend
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Payments Management</h2>
        <div className="flex gap-3">
          <select className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg">
            <option>All Methods</option>
            <option>Card</option>
            <option>Cash</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Payments</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-3xl font-bold text-white mt-2">0%</p>
        </div>
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-white mt-2">0 LKR</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Avg. Order Value</p>
          <p className="text-3xl font-bold text-white mt-2">0 LKR</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-900/20 border-b border-amber-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-gray-400 text-lg">No payments found</p>
                    <p className="text-gray-500 text-sm mt-2">Payment transactions will appear here</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
