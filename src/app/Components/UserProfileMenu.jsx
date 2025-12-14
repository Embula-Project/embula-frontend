'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logout } from '../services/AuthService';
import { clearCart } from '../../store/cartSlice';

export default function UserProfileMenu({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      console.log('[UserProfileMenu] Logging out...');
      
      // Clear cart from Redux store
      dispatch(clearCart());
      
      // Call backend logout (clears HTTP-only cookies and memory cache)
      await logout();
      
      // Trigger navbar update
      window.dispatchEvent(new Event('authChange'));
      
      console.log('[UserProfileMenu] Logout complete, redirecting to home...');
      
      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('[UserProfileMenu] Logout error:', error);
      // Still redirect even if backend call fails
      router.push('/');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
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
            {/* Admin Dashboard Link - Only for Admin users */}
            {userData?.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-900/20 rounded-lg transition-all group"
                >
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Admin Dashboard</p>
                    <p className="text-gray-400 text-xs">Manage your restaurant</p>
                  </div>
                </Link>
                <div className="border-t border-amber-900/30 my-2"></div>
              </>
            )}

            {/* Customer Info - Only for Customer users */}
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

            {/* Logout Button - For all users */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                <LogOut size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </p>
                <p className="text-gray-400 text-xs">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
