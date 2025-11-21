'use client';
import React from 'react';
import { Tag, Clock } from 'lucide-react';

const DiscountCard = ({ discount }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-amber-800/30 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50">
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10 bg-gradient-to-br from-amber-600 to-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
        {discount.percentage}% OFF
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: discount.image.startsWith('http') 
              ? `url('${discount.image}')` 
              : `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070')`
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex items-start gap-2">
          <Tag className="text-amber-500 mt-1 flex-shrink-0" size={18} />
          <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-400 transition-colors duration-300">
            {discount.title}
          </h3>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">
          {discount.description}
        </p>

        <div className="pt-3 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>{discount.terms}</span>
          </div>
          <div className="text-xs text-amber-600 font-medium">
            Valid until: {new Date(discount.validUntil).toLocaleDateString()}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-amber-900/50 to-amber-800/50 hover:from-amber-700 hover:to-amber-600 text-amber-200 hover:text-white py-3 rounded-lg font-semibold transition-all duration-300 border border-amber-700/30 hover:border-amber-500">
          Claim Offer
        </button>
      </div>
    </div>
  );
};

export default DiscountCard;
