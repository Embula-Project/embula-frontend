'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background images array
  const backgroundImages = [
    '/home1.jpg',
    '/home2.jpg',
    '/home3.jpg',
    '/home4.jpg',
    '/home5.jpg'
  ];

  // Auto-slide background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Slider */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for content readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/60"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Side - Logo (smaller space) */}
          <div className="hidden lg:flex lg:col-span-4 justify-start items-center">
            <div className="relative">
              <Image
                src="/logo1.png"
                alt="Embula Restaurant Logo"
                width={300}
                height={300}
                className="object-contain drop-shadow-2xl animate-pulse"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content (more space) */}
          <div className="lg:col-span-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
              <Sparkles className="text-amber-400" size={16} />
              <span className="text-amber-300 text-sm font-medium">Finest Dining Experience</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-2">
                Embula Restaurant
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
              Indulge in an unforgettable culinary journey where exquisite flavors meet 
              elegant ambiance. Every dish is crafted with passion and perfection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/Reservation">
                <button className="group bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-2">
                  Reserve Your Table
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </button>
              </Link>
              <Link href="/customer/customerMenu">
                <button className="bg-transparent border-2 border-amber-500 text-amber-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg">
                  View Our Menu
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="flex flex-col items-center gap-2 text-amber-400">
          <span className="text-sm">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
