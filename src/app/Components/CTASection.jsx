'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074')",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Decorative Element */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-3">
              <Calendar className="text-amber-400" size={20} />
              <span className="text-amber-300 font-medium">Limited Availability</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Ready for an
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-2">
              Unforgettable Experience?
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-300 leading-relaxed">
            Book your table today and discover why Embula is the destination 
            for those who appreciate the finer things in life.
          </p>

          {/* Features */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="text-amber-500" size={20} />
              <span>Quick & Easy Booking</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-amber-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Calendar className="text-amber-500" size={20} />
              <span>Flexible Reservations</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-amber-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              <svg className="text-amber-500" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Premium Service</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/Reservation">
              <button className="group bg-gradient-to-r from-amber-600 to-amber-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-110 inline-flex items-center gap-3">
                Book Your Table Now
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-500">10k+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-amber-900/30"></div>
            <div>
              <div className="text-3xl font-bold text-amber-500">4.9/5</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-amber-900/30"></div>
            <div>
              <div className="text-3xl font-bold text-amber-500">15+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
