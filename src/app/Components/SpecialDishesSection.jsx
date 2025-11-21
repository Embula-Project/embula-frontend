'use client';
import React, { useState } from 'react';
import { specials } from '@/data/specials';
import { ChefHat, Star, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const SpecialDishesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= specials.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, specials.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const visibleSpecials = specials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-20 bg-gradient-to-b from-black via-amber-950/10 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <ChefHat className="text-amber-400" size={18} />
            <span className="text-amber-300 text-sm font-medium">Chef's Selection</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Signature Dishes</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handcrafted culinary masterpieces that define excellence
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-amber-600 to-amber-500 text-white p-3 rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-110 hidden md:block"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-amber-600 to-amber-500 text-white p-3 rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-110 hidden md:block"
            disabled={currentIndex + itemsPerPage >= specials.length}
          >
            <ChevronRight size={24} />
          </button>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleSpecials.map((dish, index) => (
              <div
                key={dish.id}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-amber-800/30 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {dish.isNew && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Sparkles size={12} />
                      NEW
                    </div>
                  )}
                  {dish.isSpicy && (
                    <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Flame size={12} />
                      SPICY
                    </div>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
                  <Star size={14} fill="currentColor" />
                  {dish.rating}
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: dish.image.startsWith('http') 
                        ? `url('${dish.image}')` 
                        : `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080')`
                    }}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-400 transition-colors duration-300">
                      {dish.name}
                    </h3>
                    <span className="text-2xl font-bold text-amber-500 whitespace-nowrap">
                      ${dish.price}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed min-h-[60px]">
                    {dish.description}
                  </p>

                  <div className="pt-3 border-t border-gray-800">
                    <div className="text-xs text-gray-500 mb-3">
                      Category: <span className="text-amber-600 font-medium">{dish.category}</span>
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-900/50 to-amber-800/50 hover:from-amber-700 hover:to-amber-600 text-amber-200 hover:text-white py-3 rounded-lg font-semibold transition-all duration-300 border border-amber-700/30 hover:border-amber-500">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {Array.from({ length: Math.ceil(specials.length / itemsPerPage) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerPage) === idx
                    ? 'bg-amber-500 w-8'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View Full Menu Button */}
        <div className="text-center mt-12">
          <a href="/customer/customerMenu">
            <button className="group bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 inline-flex items-center gap-2">
              Explore Full Menu
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialDishesSection;
