'use client';
import React from 'react';
import ContactUsForm from './ContactUsForm';

const ContactUs = () => {
  return (
    <div className="bg-black min-h-screen pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-amber-300 text-sm font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-400 mt-3">
            Have a complaint, feedback, or a suggestion? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-800/30 rounded-2xl p-6 sm:p-10">
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
