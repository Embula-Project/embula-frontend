'use client';
import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

const OwnerProfileCard = ({ name, role, photoUrl, phone, email }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-800/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 flex flex-col items-center text-center">
      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-500/50 mb-4 bg-gray-700 flex items-center justify-center">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="text-amber-500" size={48} />
        )}
      </div>

      <h3 className="text-xl font-semibold text-white">{name}</h3>
      {role && <p className="text-amber-400 text-sm mb-4">{role}</p>}

      <div className="space-y-2 w-full">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
        >
          <Phone className="text-amber-500 flex-shrink-0" size={16} />
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
        >
          <Mail className="text-amber-500 flex-shrink-0" size={16} />
          {email}
        </a>
      </div>
    </div>
  );
};

export default OwnerProfileCard;
