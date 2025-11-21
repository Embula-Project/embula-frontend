'use client';
import React from 'react';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const DiscountCard = ({ discount }) => {
  // Handle both API structure and potential fallback/mock structure
  const percentage = discount.discountPercentage || discount.percentage;
  const imageUrl = discount.imageUrl || discount.image;
  const validTo = discount.validTo || discount.validUntil;
  
  // High-quality Unsplash fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070', // Food spread
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074', // Restaurant interior/food
    'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069', // Ribs/Steak
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070', // Fine dining plate
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981', // Pizza
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2110', // Sandwich/Greens
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2157', // Drinks/Cocktails
    'https://images.unsplash.com/photo-1563729768-7491131ba718?q=80&w=2069', // Dessert
    'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=2068', // Sushi
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070', // Pasta
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974', // Salad
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1965', // Cake
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=2098', // French Toast
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1972', // Meatballs
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070'  // Steak
  ];
  
  // Deterministic selection based on ID or Title
  const getImageSource = () => {
    if (imageUrl) return imageUrl;
    
    const seed = discount.id || discount.title || 'default';
    const seedString = String(seed);
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbackImages.length;
    return fallbackImages[index];
  };

  const displayImage = getImageSource();
  
  return (
    <Link href="/customer/customerMenu" className="block w-full h-full">
      <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-amber-800/30 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/40 flex flex-col md:flex-row h-full min-h-[320px]">
        
        {/* Image Section - Wider and taller */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 md:bg-gradient-to-r md:from-transparent md:to-black/90"></div>
          
          {/* Discount Badge */}
          <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse">
            {percentage}% OFF
          </div>

          <img 
             src={displayImage} 
             alt={discount.title}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             onError={(e) => {
               e.target.onerror = null;
               e.target.src = fallbackImages[0];
             }}
           />
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10 flex flex-col justify-center w-full md:w-1/2 space-y-6 relative">
          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-600/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-medium text-sm tracking-wider uppercase">
              <Tag size={16} />
              <span>Limited Time Offer</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 leading-tight">
              {discount.title}
            </h3>
          </div>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed line-clamp-3">
            {discount.description}
          </p>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-amber-600 font-medium flex items-center gap-2 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-900/50">
              <Clock size={16} />
              Valid until: {validTo ? new Date(validTo).toLocaleDateString() : 'N/A'}
            </div>
            
            <span className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
              Claim Now <ArrowRight size={20} className="text-amber-500" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiscountCard;
