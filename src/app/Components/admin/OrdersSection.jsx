'use client';
import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '@/app/services/OrderService';

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  
  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    order: null, 
    newStatus: null 
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders(currentPage, pageSize);
      
      console.log('Orders API Full Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response.data:', response.data);
      
      if (response && response.code === 200 && response.data) {
        const ordersList = response.data.list || [];
        console.log('Orders list:', ordersList);
        console.log('Orders list length:', ordersList.length);
        
        // Add index as fallback ID if orderId is missing
        const ordersWithIds = ordersList.map((order, index) => ({
          ...order,
          orderId: order.orderId || order.id || `order-${currentPage}-${index}`
        }));
        
        console.log('Orders with IDs:', ordersWithIds);
        
        setOrders(ordersWithIds);
        setTotalOrders(response.data.totalOrders || 0);
      } else {
        console.warn('Unexpected response structure:', response);
        setError('Failed to fetch orders - unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching orders - Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (order, newStatus) => {
    setConfirmDialog({ isOpen: true, order, newStatus });
  };

  const confirmStatusUpdate = async () => {
    const { order, newStatus } = confirmDialog;
    
    try {
      setUpdatingOrderId(order.orderId);
      setConfirmDialog({ isOpen: false, order: null, newStatus: null });
      
      await updateOrderStatus(order.orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(o => 
        o.orderId === order.orderId ? { ...o, orderStatus: newStatus } : o
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const cancelStatusUpdate = () => {
    setConfirmDialog({ isOpen: false, order: null, newStatus: null });
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'ALL' && order.orderStatus !== statusFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter && order.orderDate !== dateFilter) {
      return false;
    }
    
    // Today filter
    if (showTodayOnly && order.orderDate !== getTodayDate()) {
      return false;
    }
    
    return true;
  });

  // Calculate stats
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.orderStatus === 'Pending').length,
    completed: filteredOrders.filter(o => o.orderStatus === 'Completed').length,
    cancelled: filteredOrders.filter(o => o.orderStatus === 'Cancelled').length,
    totalRevenue: filteredOrders
      .filter(o => o.orderStatus === 'Completed')
      .reduce((sum, o) => sum + o.orderPaymentAmount, 0)
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
      Completed: 'bg-green-900/30 text-green-400 border-green-500/30',
      Cancelled: 'bg-red-900/30 text-red-400 border-red-500/30'
    };
    return styles[status] || 'bg-gray-900/30 text-gray-400 border-gray-500/30';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return 'N/A';
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
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
        <h2 className="text-2xl font-bold text-white">Orders Management</h2>
        <button 
          onClick={fetchOrders}
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

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            Debug: Total Orders from API: {totalOrders} | Orders in state: {orders.length} | Filtered: {filteredOrders.length}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cancelled</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.cancelled}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white mt-2">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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

          {/* Today's Orders Toggle */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Quick Filter</label>
            <button
              onClick={() => {
                setShowTodayOnly(!showTodayOnly);
                if (!showTodayOnly) {
                  setDateFilter('');
                }
              }}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                showTodayOnly
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              {showTodayOnly ? "Today's Orders ✓" : "Show Today's Orders"}
            </button>
          </div>

          {/* Clear Filters */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Actions</label>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setDateFilter('');
                setShowTodayOnly(false);
              }}
              className="w-full bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-900/20 border-b border-amber-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-amber-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    {statusFilter !== 'ALL' || dateFilter || showTodayOnly 
                      ? 'No orders found matching your filters' 
                      : 'No orders found'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">{order.orderName}</p>
                        <p className="text-gray-400 text-sm mt-1">{order.orderDescription}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white">{order.orderDate}</p>
                        <p className="text-gray-400 text-sm">{formatTime(order.orderTime)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{order.orderType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/30 text-blue-400 border border-blue-500/30">
                        {order.orderPaymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-semibold">{formatCurrency(order.orderPaymentAmount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {order.orderStatus !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange(order, 'Completed')}
                            disabled={updatingOrderId === order.orderId}
                            className="px-3 py-1.5 bg-green-900/30 text-green-400 border border-green-500/30 hover:bg-green-900/50 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Complete
                          </button>
                        )}
                        {order.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(order, 'Cancelled')}
                            disabled={updatingOrderId === order.orderId}
                            className="px-3 py-1.5 bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        )}
                        {order.orderStatus !== 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(order, 'Pending')}
                            disabled={updatingOrderId === order.orderId}
                            className="px-3 py-1.5 bg-yellow-900/30 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-900/50 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Pending
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-sm">
          Showing {filteredOrders.length} of {totalOrders} orders
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-amber-900/20 text-amber-400 border border-amber-500/30 rounded-lg">
            Page {currentPage + 1}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * pageSize >= totalOrders}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.order && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                confirmDialog.newStatus === 'Completed' 
                  ? 'bg-green-900/30 border-2 border-green-500/50' 
                  : confirmDialog.newStatus === 'Cancelled'
                  ? 'bg-red-900/30 border-2 border-red-500/50'
                  : 'bg-yellow-900/30 border-2 border-yellow-500/50'
              }`}>
                <svg className={`w-8 h-8 ${
                  confirmDialog.newStatus === 'Completed' 
                    ? 'text-green-400' 
                    : confirmDialog.newStatus === 'Cancelled'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Confirm Status Update
            </h3>

            {/* Message */}
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to change this order's status to{' '}
              <span className={`font-semibold ${
                confirmDialog.newStatus === 'Completed' 
                  ? 'text-green-400' 
                  : confirmDialog.newStatus === 'Cancelled'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }`}>
                {confirmDialog.newStatus}
              </span>?
            </p>

            {/* Order Info Card */}
            <div className="bg-black/40 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-white font-semibold mb-2">{confirmDialog.order.orderName}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{confirmDialog.order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{formatCurrency(confirmDialog.order.orderPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${getStatusBadge(confirmDialog.order.orderStatus)}`}>
                    {confirmDialog.order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelStatusUpdate}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                  confirmDialog.newStatus === 'Completed'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white hover:shadow-green-500/50'
                    : confirmDialog.newStatus === 'Cancelled'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:shadow-red-500/50'
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white hover:shadow-yellow-500/50'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
