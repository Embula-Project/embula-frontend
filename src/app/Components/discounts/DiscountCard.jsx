import React from 'react';

const DiscountCard = ({ discount }) => {
  const { title, description, discountPercentage, validFrom, validTo, imageUrl } = discount;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-md">
          {discountPercentage}% OFF
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm mb-4 flex-grow">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Valid: {formatDate(validFrom)} - {formatDate(validTo)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;
