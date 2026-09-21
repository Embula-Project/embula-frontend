'use client';
import React from 'react';
import OwnerProfileCard from './OwnerProfileCard';

const owners = [
  {
    name: 'Mr. Kamal Perera',
    role: 'Co-Founder & Head Chef',
    photoUrl: '',
    phone: '+94 77 123 4567',
    email: 'kamal.perera@embula.com'
  },
  {
    name: 'Mr. Saman Bandara',
    role: 'Co-Founder & Managing Director',
    photoUrl: '',
    phone: '+94 77 765 4321',
    email: 'saman.bandara@embula.com'
  }
];

const AboutUs = () => {
  return (
    <div className="bg-black min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <section>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-4">
              <span className="text-amber-300 text-sm font-medium">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">About Embula</h1>
          </div>

          <div className="space-y-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-800/30 rounded-2xl p-6 sm:p-10">
            <p className="text-gray-400 italic leading-loose text-lg first-letter:text-5xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left first-letter:not-italic">
              Embula was founded in 2010 with a simple dream: to bring authentic, heartfelt
              cuisine to every table it serves. What began as a small family-run eatery on the
              streets of Colombo has since grown into one of the city's most beloved fine
              dining destinations, cherished for both its warm hospitality and unforgettable
              flavors.
            </p>
            <p className="text-gray-400 italic leading-loose text-lg">
              In our early years, we operated out of a modest kitchen with just a handful of
              tables, relying entirely on word of mouth and the loyalty of our first customers.
              Every recipe was perfected through trial, patience, and a deep respect for
              traditional Sri Lankan cooking techniques passed down through generations.
            </p>
            <p className="text-gray-400 italic leading-loose text-lg">
              As our reputation grew, so did our ambitions. By 2015, we expanded into a larger
              space, introduced an extended menu blending local and international cuisine, and
              built a team of passionate chefs dedicated to culinary excellence. This period
              marked our transformation from a neighborhood favorite into a destination
              restaurant.
            </p>
            <p className="text-gray-400 italic leading-loose text-lg">
              Today, Embula continues to honor its roots while embracing innovation. We source
              ingredients locally, support sustainable farming practices, and continuously
              refine our menu to surprise and delight our guests. Our commitment to quality,
              consistency, and genuine hospitality remains unchanged since the day we opened
              our doors.
            </p>
            <p className="text-gray-400 italic leading-loose text-lg">
              Looking ahead, we remain dedicated to creating memorable dining experiences for
              every guest who walks through our doors, staying true to the values that started
              it all: passion, quality, and community.
            </p>
          </div>
        </section>

        {/* Owners - scrollable */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Meet the Owners</h2>
            <p className="text-gray-400 mt-2">The people behind Embula's story</p>
          </div>

          <div className="max-h-[28rem] overflow-y-auto pr-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {owners.map((owner) => (
                <OwnerProfileCard key={owner.email} {...owner} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
