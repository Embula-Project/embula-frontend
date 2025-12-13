'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/AuthService';
import { clearCart } from '../../store/cartSlice';

export default function AdminHeader({ activeSection, onSectionChange }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);
    
    try {
      console.log('[AdminHeader] Logging out admin...');
      
      // Clear cart from Redux store
      dispatch(clearCart());
      
      // Call backend logout (clears HTTP-only cookies and memory cache)
      await logout();
      
      // Clear any local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));
      
      console.log('[AdminHeader] Logout complete, redirecting to home...');
      
      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('[AdminHeader] Logout error:', error);
      // Still redirect even if backend call fails
      router.push('/');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'A';
  };

  const sections = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'food-items', label: 'Food Items', icon: '🍽️' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'user-management', label: 'User Management', icon: '👥' }
  ];

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-black to-gray-900 border-b border-amber-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-800 rounded"></div>
            <div className="h-10 w-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-black to-gray-900 border-b border-amber-900/30 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Info */}
        <div className="py-4 border-b border-amber-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-400">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                disabled={isLoggingOut}
                className="flex items-center gap-3 bg-amber-900/20 border border-amber-500/30 rounded-lg px-4 py-2 hover:bg-amber-900/30 hover:border-amber-500/50 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center font-bold text-amber-400">
                  {getInitials()}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                  <p className="text-amber-400 text-xs">{user?.role}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-black to-gray-900 border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden z-[100]">
                  {/* User Info */}
                  <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl text-white">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-white/80 text-sm">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <div className="px-4 py-2 text-gray-400 text-xs font-semibold uppercase">
                      Role: {user?.role}
                    </div>
                    
                    {/* Go to Main Dashboard */}
                    <Link
                      href="/"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-amber-900/20 transition-all rounded-lg group"
                    >
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Main Dashboard</p>
                        <p className="text-gray-400 text-xs">Go to customer view</p>
                      </div>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-900/20 transition-all rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
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
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 overflow-x-auto py-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700'
              }`}
            >
              <span className="text-xl">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
