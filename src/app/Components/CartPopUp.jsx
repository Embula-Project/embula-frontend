'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { selectCartItems, incrementItem, decrementItem, removeItem } from '../../store/cartSlice';

export default function CartPopup({ isOpen, onClose }) {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 0), 0);

  const handleCheckout = () => {
    // Check if user is authenticated before proceeding to checkout
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    // Close cart with smooth transition
    onClose();
    
    // Add slight delay for smoother visual transition
    setTimeout(() => {
      if (!token) {
        // Not authenticated - redirect to login page
        console.log('User not authenticated, redirecting to login');
        router.push('/?login=true&return=/checkout');
      } else {
        // Authenticated - proceed to checkout
        router.push('/checkout');
      }
    }, 200);
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

          {/* Cart Items - Scrollable with custom scrollbar */}
          <div className="overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-gray-800" style={{ maxHeight: 'calc(90vh - 250px)' }}>
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
                className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-amber-900/40 rounded-xl p-4 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 border border-amber-900/40 shadow-md">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        <ShoppingBag size={24} className="opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base mb-1 truncate">{item.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-amber-400 font-bold text-lg">{item.price} LKR</p>
                      <p className="text-gray-400 text-sm">× {item.qty}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-black/50 rounded-lg border border-amber-900/30 p-1">
                        <button
                          onClick={() => dispatch(decrementItem(item.id))}
                          className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-amber-900 hover:to-amber-800 text-white p-1.5 rounded transition-all duration-200 hover:scale-110"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-bold text-sm min-w-[24px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch(incrementItem(item.id))}
                          className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-amber-900 hover:to-amber-800 text-white p-1.5 rounded transition-all duration-200 hover:scale-110"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className="ml-auto bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 p-2 rounded-lg border border-red-800/50 hover:border-red-600 transition-all duration-200 hover:scale-110"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Item Subtotal */}
                    <div className="mt-2 pt-2 border-t border-amber-900/20">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-amber-500 font-bold">{(item.price * item.qty).toFixed(2)} LKR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>

          {/* Footer */}
          <div className="border-t border-amber-900/50 p-6 bg-gradient-to-b from-black/60 to-black/80 rounded-b-2xl backdrop-blur-sm">
            {/* Items Count */}
            {cartItems.length > 0 && (
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-gray-400">Items in cart:</span>
                <span className="text-white font-semibold">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-900/30">
              <span className="text-gray-200 font-semibold text-xl">Total:</span>
              <span className="text-amber-400 font-bold text-3xl">{totalPrice.toFixed(2)} LKR</span>
            </div>
            
            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                cartItems.length === 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg hover:shadow-amber-500/50 hover:scale-105 active:scale-95'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Proceed to Checkout</span>
            </button>
            
            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full mt-3 py-2 text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
