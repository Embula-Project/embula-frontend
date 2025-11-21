"use client";
import React, { useEffect, useState } from 'react';
import { getDiscounts } from '../../services/discountService';
import DiscountCard from './DiscountCard';

const DiscountList = ({ refreshTrigger }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await getDiscounts();
      
      // Filter discounts: isActive is true AND current date is between validFrom and validTo
      const now = new Date();
      const activeDiscounts = data.filter(discount => {
        if (!discount.isActive) return false;
        
        const validFrom = new Date(discount.validFrom);
        const validTo = new Date(discount.validTo);
        
        // Set time to midnight for accurate date comparison if needed, 
        // or keep as is for precise timestamp comparison.
        // Assuming inclusive dates:
        return now >= validFrom && now <= validTo;
      });

      setDiscounts(activeDiscounts);
      setError(null);
    } catch (err) {
      setError('Failed to load discounts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 bg-white/5 rounded-xl border border-red-500/20">
        <p>{error}</p>
        <button 
          onClick={fetchDiscounts}
          className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-200 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center text-gray-400 p-12 bg-white/5 rounded-xl border border-white/10">
        <p className="text-xl">No active discounts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {discounts.map((discount) => (
        <div key={discount.id || Math.random()} className="h-full">
          <DiscountCard discount={discount} />
        </div>
      ))}
    </div>
  );
};

export default DiscountList;
