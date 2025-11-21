'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/customer/customerMenu' },
    { name: 'Reservations', href: '/Reservation' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const openingHours = [
    { day: 'Monday - Thursday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Friday - Sunday', hours: '11:00 AM - 11:00 PM' },
    
  ];

  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black border-t border-amber-900/30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-amber-500">Embula</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience culinary excellence in an atmosphere of luxury and sophistication. 
              Where every meal is a celebration.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="mr-2 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Opening Hours
            </h3>
            <ul className="space-y-3">
              {openingHours.map((schedule, index) => (
                <li key={index} className="text-sm">
                  <div className="text-gray-300 font-medium">{schedule.day}</div>
                  <div className="text-amber-500">{schedule.hours}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-400 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                <div>
                  <p className="text-gray-400">No 123, Park Street</p>
                  <p className="text-gray-400">Bambalapitiya, Colombo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="text-amber-500 flex-shrink-0" size={18} />
                <a href="tel:+94 76 502 3921" className="text-gray-400 hover:text-amber-400 transition-colors">
                  +94 76 502 3921
                </a>
                   <a href="tel:+94 71 137 4744" className="text-gray-400 hover:text-amber-400 transition-colors">
                  +94 71 137 4744
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="text-amber-500 flex-shrink-0" size={18} />
                <a href="mailto:info@embula.com" className="text-gray-400 hover:text-amber-400 transition-colors">
                  embularesturant@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-900/30 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Embula Restaurant. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:text-amber-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
