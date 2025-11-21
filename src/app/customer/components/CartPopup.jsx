'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { selectCartItems, incrementItem, decrementItem, removeItem } from '../../../store/cartSlice';

export default function CartPopup({ isOpen, onClose }) {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    router.push('/customer/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity flex items-center justify-center"
        onClick={onClose}
      >
        {/* Cart Popup - Centered */}
        <div 
          className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-black to-gray-900 border border-amber-900/50 shadow-2xl rounded-2xl z-[70] transform transition-all duration-300 m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-6 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-white" size={28} />
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-full"
            >
              <X size={28} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-[50vh] overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingBag size={80} className="mb-4 opacity-50" />
              <p className="text-xl font-semibold">Your cart is empty</p>
              <p className="text-sm mt-2">Add delicious items from our menu!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-black/50 border border-amber-900/30 rounded-xl p-4 hover:border-amber-500/50 transition-all"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 border border-amber-900/30">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-2">{item.itemName}</h3>
                    <p className="text-amber-400 font-bold text-base">{item.price} LKR</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(decrementItem(item.id))}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-1 rounded border border-gray-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-medium text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementItem(item.id))}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-1 rounded border border-gray-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="ml-auto bg-red-900/50 hover:bg-red-900 text-red-400 p-1 rounded border border-red-800 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>

          {/* Footer */}
          <div className="border-t border-amber-900/30 p-6 bg-black/50 rounded-b-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-300 font-semibold text-lg">Total:</span>
              <span className="text-amber-400 font-bold text-2xl">{totalPrice.toFixed(2)} LKR</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                cartItems.length === 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg hover:shadow-amber-500/50 hover:scale-105'
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
