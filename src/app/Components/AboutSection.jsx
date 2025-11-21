'use client';
import React from 'react';
import Link from 'next/link';
import { Award, Heart, Users, Calendar } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for culinary excellence'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every dish crafted with passion'
    },
    {
      icon: Users,
      title: 'Expert Chefs',
      description: 'World-class culinary team'
    },
    {
      icon: Calendar,
      title: 'Since 2010',
      description: '15 years of fine dining'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <span className="text-amber-300 text-sm font-medium">Our Story</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Experience the Art of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-2">
                Fine Dining
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed">
              At Embula, we believe dining is more than just a meal—it's an experience. 
              Since 2010, we've been crafting unforgettable moments through exceptional 
              cuisine, elegant ambiance, and impeccable service.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Our award-winning chefs combine traditional techniques with innovative flavors, 
              using only the finest locally-sourced ingredients to create dishes that delight 
              all your senses. Every plate tells a story of passion, precision, and perfection.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-800/30 rounded-xl p-4 hover:border-amber-500/50 transition-all duration-300"
                  >
                    <Icon className="text-amber-500 mb-2" size={24} />
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <Link href="/Reservation">
              <button className="group bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 inline-flex items-center gap-2 mt-6">
                Reserve Your Table
                <svg 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div 
                className="h-64 rounded-2xl bg-cover bg-center border-2 border-amber-800/30 hover:border-amber-500/50 transition-all duration-300"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070')"
                }}
              ></div>
              <div 
                className="h-48 rounded-2xl bg-cover bg-center border-2 border-amber-800/30 hover:border-amber-500/50 transition-all duration-300"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070')"
                }}
              ></div>
            </div>
            <div className="space-y-4 pt-8">
              <div 
                className="h-48 rounded-2xl bg-cover bg-center border-2 border-amber-800/30 hover:border-amber-500/50 transition-all duration-300"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2074')"
                }}
              ></div>
              <div 
                className="h-64 rounded-2xl bg-cover bg-center border-2 border-amber-800/30 hover:border-amber-500/50 transition-all duration-300"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071')"
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
