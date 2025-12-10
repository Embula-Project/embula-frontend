'use client';
import { useState, useEffect } from 'react';

export default function FoodItemsSection() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch food items from backend
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Food Items Management</h2>
        <button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Out of Stock</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-6">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-400 text-lg">No food items found</p>
          <p className="text-gray-500 text-sm mt-2">Click "Add New Item" to create your first food item</p>
        </div>
      </div>
    </div>
  );
}
