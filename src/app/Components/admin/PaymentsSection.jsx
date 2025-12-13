'use client';
import { useState, useEffect } from 'react';
import { getAllPayments } from '@/app/services/PaymentService';

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPayments();
      
      console.log('Payments response:', response);
      
      if (response.code === 200 && response.data) {
        setPayments(response.data);
      } else {
        setError('Failed to fetch payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    // Payment method filter
    if (paymentMethodFilter !== 'ALL' && payment.paymentMethod !== paymentMethodFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter) {
      const paymentDate = new Date(payment.paymentDate).toISOString().split('T')[0];
      if (paymentDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    totalPayments: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + p.paymentAmount, 0),
    avgAmount: filteredPayments.length > 0 
      ? filteredPayments.reduce((sum, p) => sum + p.paymentAmount, 0) / filteredPayments.length 
      : 0,
    cardPayments: filteredPayments.filter(p => p.paymentMethod === 'CARD').length,
    cashPayments: filteredPayments.filter(p => p.paymentMethod === 'CASH').length,
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Payments Management</h2>
        <button 
          onClick={fetchPayments}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Payments</p>
          <p className="text-3xl font-bold text-white mt-2">{stats.totalPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Card Payments</p>
          <p className="text-3xl font-bold text-white mt-2">{stats.cardPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Avg. Amount</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(Math.round(stats.avgAmount))}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Payment Method Filter */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Filter by Payment Method</label>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Methods</option>
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Filter by Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Clear Filters */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Actions</label>
            <button
              onClick={() => {
                setPaymentMethodFilter('ALL');
                setDateFilter('');
              }}
              className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-900/20 border-b border-amber-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-400 text-lg">No payments found</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {paymentMethodFilter !== 'ALL' || dateFilter 
                          ? 'No payments matching your filters' 
                          : 'Payment transactions will appear here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => {
                  const { date, time } = formatDateTime(payment.paymentDate);
                  return (
                    <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.paymentMethod === 'CARD' 
                            ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' 
                            : 'bg-green-900/30 text-green-400 border border-green-500/30'
                        }`}>
                          {payment.paymentMethod === 'CARD' && (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                          {payment.paymentMethod === 'CASH' && (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-bold text-lg">{formatCurrency(payment.paymentAmount)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300">{date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-400">{time}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-gray-500 text-sm">
        Showing {filteredPayments.length} of {payments.length} payments
      </div>
    </div>
  );
}
                  