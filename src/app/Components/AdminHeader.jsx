'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function AdminHeader({ activeSection, onSectionChange }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const sections = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'food-items', label: 'Food Items', icon: '🍽️' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'earnings', label: 'Earnings', icon: '💰' }
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
    <header className="bg-gradient-to-r from-black to-gray-900 border-b border-amber-900/30 sticky top-16 z-40">
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
            <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-500/30 rounded-lg px-4 py-2">
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                <p className="text-amber-400 text-xs">{user?.role}</p>
              </div>
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
