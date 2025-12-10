'use client';
import { useState, useEffect } from 'react';

export default function EarningsSection() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch earnings data from backend
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
        <h2 className="text-2xl font-bold text-white">Earnings Overview</h2>
        <select className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">0 LKR</p>
          <p className="text-green-400 text-sm mt-2">+0% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Net Profit</p>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">0 LKR</p>
          <p className="text-blue-400 text-sm mt-2">+0% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Avg. Order Value</p>
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">0 LKR</p>
          <p className="text-amber-400 text-sm mt-2">Per transaction</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-purple-400 text-sm mt-2">Completed orders</p>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Revenue Trend</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-600 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-400">Chart will appear here</p>
            <p className="text-gray-500 text-sm mt-1">Once you have earnings data</p>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Top Selling Items</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p className="text-gray-400">No sales data yet</p>
          <p className="text-gray-500 text-sm mt-1">Top selling items will appear here</p>
        </div>
      </div>
    </div>
  );
}
