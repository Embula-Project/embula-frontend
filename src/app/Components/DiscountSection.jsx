'use client';
import React, { useState, useEffect, useRef } from 'react';
import DiscountCard from './DiscountCard';
import { getDiscounts } from '../services/discountService';
import { Gift, ChevronLeft, ChevronRight } from 'lucide-react';

const DiscountSection = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Fetch discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await getDiscounts();
        // Filter active discounts
        const now = new Date();
        const activeDiscounts = data.filter(d => {
          if (!d.isActive) return false;
          const validFrom = new Date(d.validFrom);
          const validTo = new Date(d.validTo);
          return now >= validFrom && now <= validTo;
        });
        setDiscounts(activeDiscounts);
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  // Auto-slide logic
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (discounts.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === discounts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // 5 seconds per slide
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, discounts.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === discounts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? discounts.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </section>
    );
  }

  if (discounts.length === 0) {
    return null; // Don't show section if no discounts
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
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

        {/* Carousel Container */}
        <div className="relative group max-w-5xl mx-auto">
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-amber-600/80 text-white p-3 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 -ml-4 lg:-ml-12"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-amber-600/80 text-white p-3 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 -mr-4 lg:-mr-12"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slides Window */}
          <div className="overflow-hidden rounded-2xl h-[550px] md:h-[400px] bg-gray-900/50 border border-white/5">
            <div 
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {discounts.map((discount) => (
                <div 
                  key={discount.id || Math.random()} 
                  className="w-full flex-shrink-0 h-full p-1"
                >
                  <div className="mx-auto h-full">
                     <DiscountCard discount={discount} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {discounts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-amber-500' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;
