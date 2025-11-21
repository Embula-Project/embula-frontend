'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/customer/customerMenu' },
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

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/Reservation">
                <button className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 text-sm xl:text-base">
                  Book Now
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-amber-400 hover:text-amber-300 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
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
    </>
  );
};

export default Navbar;
