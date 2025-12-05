'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../../store/cartSlice';
import CartPopup from './CartPopUp';
import UserProfileMenu from './UserProfileMenu';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  
  // Use auth hook for centralized authentication state
  const { user: userData, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reserve Table', href: '/Reservation' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#contact' }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-lg shadow-lg border-b border-amber-900/30'
            : 'bg-black/50 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/logo1.png"
                  alt="Embula Logo"
                  width={80}
                  height={80}
                  className="object-contain h-16 sm:h-20 w-auto transition-all duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-200 hover:text-amber-400 font-medium transition-all duration-300 relative group text-sm xl:text-base"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/Reservation">
                <button className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 text-sm xl:text-base">
                  Book Now
                </button>
              </Link>
              
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile or Login */}
              {isLoading ? (
                // Loading skeleton to prevent flash of login button
                <div className="flex items-center gap-2 bg-gray-700/50 px-4 py-2 rounded-full animate-pulse">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="w-16 h-4 bg-gray-600 rounded hidden sm:block"></div>
                </div>
              ) : isAuthenticated && userData ? (
                <UserProfileMenu userData={userData} />
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105">
                    <LogIn size={18} />
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu, Cart & User Buttons */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile User Profile */}
              {isLoading ? (
                <div className="w-10 h-10 bg-gray-700/50 rounded-full animate-pulse"></div>
              ) : isAuthenticated && userData ? (
                <UserProfileMenu userData={userData} />
              ) : (
                <Link href="/login">
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-full">
                    <LogIn size={20} />
                  </button>
                </Link>
              )}
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-amber-400 hover:text-amber-300 transition-colors p-2"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="bg-black/98 backdrop-blur-lg border-t border-amber-900/30 px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-200 hover:text-amber-400 font-medium py-3 transition-colors duration-300 border-b border-gray-800 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/Reservation" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg mt-2">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
