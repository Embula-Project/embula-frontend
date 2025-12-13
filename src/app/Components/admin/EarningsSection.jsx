'use client';
import { useState, useEffect } from 'react';
import { getAllPayments } from '../../services/PaymentService';

export default function EarningsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPayments();
      
      if (response.code === 200) {
        setPayments(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (err) {
      setError('Failed to load earnings data');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter payments by date if filter is set
  const filteredPayments = dateFilter 
    ? payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate).toISOString().split('T')[0];
        return paymentDate === dateFilter;
      })
    : payments;

  // Calculate statistics
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Total earnings
    const totalEarnings = filteredPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
    
    // Today's earnings
    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate).toISOString().split('T')[0];
      return paymentDate === today;
    });
    const todayEarnings = todayPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
    
    // Payment method preferences
    const cardPayments = filteredPayments.filter(p => p.paymentMethod === 'CARD').length;
    const cashPayments = filteredPayments.filter(p => p.paymentMethod === 'CASH').length;
    const totalPayments = filteredPayments.length;
    const cardPercentage = totalPayments > 0 ? ((cardPayments / totalPayments) * 100).toFixed(1) : 0;
    const cashPercentage = totalPayments > 0 ? ((cashPayments / totalPayments) * 100).toFixed(1) : 0;
    
    // Busiest dates (group by date and find top 5)
    const dateGroups = {};
    payments.forEach(payment => {
      const date = new Date(payment.paymentDate).toISOString().split('T')[0];
      if (!dateGroups[date]) {
        dateGroups[date] = { date, count: 0, amount: 0 };
      }
      dateGroups[date].count++;
      dateGroups[date].amount += payment.paymentAmount;
    });
    
    const busiestDates = Object.values(dateGroups)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalEarnings,
      todayEarnings,
      cardPayments,
      cashPayments,
      cardPercentage,
      cashPercentage,
      totalPayments,
      busiestDates
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold">{error}</p>
        </div>
        <button 
          onClick={fetchPayments}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
            💰 Earnings Overview
          </h2>
          <p className="text-gray-400 mt-1">Track your revenue and payment insights</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Filter by Date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-800 border border-amber-900/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatCurrency(stats.totalEarnings)}</p>
          <p className="text-green-400 text-sm">
            {dateFilter ? `For ${formatDate(dateFilter)}` : 'All time revenue'}
          </p>
        </div>

        {/* Today's Earnings */}
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">Today's Earnings</p>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatCurrency(stats.todayEarnings)}</p>
          <p className="text-blue-400 text-sm">{formatDate(new Date().toISOString())}</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">Total Transactions</p>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.totalPayments}</p>
          <p className="text-purple-400 text-sm">
            {dateFilter ? 'Filtered payments' : 'Total payments'}
          </p>
        </div>

        {/* Average Transaction */}
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">Average Transaction</p>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatCurrency(stats.totalPayments > 0 ? stats.totalEarnings / stats.totalPayments : 0)}
          </p>
          <p className="text-amber-400 text-sm">Per transaction</p>
        </div>
      </div>

      {/* Payment Method Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Distribution */}
        <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment Method Preferences
          </h3>
          
          <div className="space-y-4">
            {/* Card Payments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Card Payments
                </span>
                <span className="text-white font-bold">{stats.cardPercentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.cardPercentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">{stats.cardPayments} transactions</p>
            </div>

            {/* Cash Payments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cash Payments
                </span>
                <span className="text-white font-bold">{stats.cashPercentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.cashPercentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">{stats.cashPayments} transactions</p>
            </div>
          </div>
        </div>

        {/* Busiest Dates */}
        <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Busiest Dates
          </h3>

          {stats.busiestDates.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-600 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">No date data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.busiestDates.map((dateData, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-500/20 text-amber-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-orange-700/20 text-orange-500' :
                      'bg-gray-700 text-gray-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{formatDate(dateData.date)}</p>
                      <p className="text-gray-400 text-sm">{dateData.count} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(dateData.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Footer */}
      {!dateFilter && (
        <div className="text-center text-gray-500 text-sm bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          💡 Tip: Use the date filter above to view earnings for a specific date
        </div>
      )}
    </div>
  );
}
