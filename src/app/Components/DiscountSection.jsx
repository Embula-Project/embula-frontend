'use client';
import React from 'react';
import DiscountCard from './DiscountCard';
import { discounts } from '@/data/discounts';
import { Gift } from 'lucide-react';

const DiscountSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <Gift className="text-amber-400" size={18} />
            <span className="text-amber-300 text-sm font-medium">Special Offers</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Today's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Exclusive Deals</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't miss out on our limited-time offers and special promotions
          </p>
        </div>

        {/* Discount Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {discounts.map((discount) => (
            <DiscountCard key={discount.id} discount={discount} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-all duration-300">
            View All Offers
            <svg 
              className="group-hover:translate-x-1 transition-transform duration-300" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;
