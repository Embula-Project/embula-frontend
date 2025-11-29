'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { clearAuthData } from '../../services/authService';
import { clearCart } from '../../../store/cartSlice';

export default function UserProfileMenu({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear cart from Redux store
    dispatch(clearCart());
    
    // Clear auth data and cart from localStorage/cookies
    clearAuthData();
    
    setIsOpen(false);
    
    // Trigger storage event to update Navbar
    window.dispatchEvent(new Event('storage'));
    
    // Add smooth transition delay
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 150);
  };

  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    return userData?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
          {getInitials()}
        </div>
        <span className="hidden sm:inline text-sm">
          {userData?.firstName || 'User'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-black border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden z-[100]">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                {getInitials()}
              </div>
              <div>
                <p className="text-white font-semibold">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-white/80 text-sm">{userData?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {userData?.role === 'CUSTOMER' && (
              <>
                <div className="px-4 py-3 hover:bg-amber-900/20 rounded-lg transition-colors">
                  <p className="text-gray-400 text-xs mb-1">Phone</p>
                  <p className="text-white text-sm">{userData?.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="px-4 py-3 hover:bg-amber-900/20 rounded-lg transition-colors">
                  <p className="text-gray-400 text-xs mb-1">Address</p>
                  <p className="text-white text-sm">{userData?.address || 'Not provided'}</p>
                </div>
                <div className="border-t border-amber-900/30 my-2"></div>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 rounded-lg transition-colors text-left"
            >
              <LogOut size={18} className="text-red-400" />
              <span className="text-red-400 text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
