'use client';
import React from 'react';
import { CheckCircle, Calendar, Users, Utensils, MapPin } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, reservationData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-green-900/30 w-full max-w-md animate-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="flex justify-center pt-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Reservation Confirmed!</h2>
          <p className="text-gray-400">Your table has been successfully reserved</p>
        </div>

        {/* Reservation Details */}
        <div className="px-6 pb-6">
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Confirmation ID</p>
                <p className="text-white font-bold text-lg">#{reservationData.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date</p>
                  <p className="text-white font-semibold text-sm">{reservationData.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Utensils size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Meal</p>
                  <p className="text-white font-semibold text-sm capitalize">{reservationData.mealType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Guests</p>
                  <p className="text-white font-semibold text-sm">{reservationData.numberOfGuests}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Table</p>
                  <p className="text-white font-semibold text-sm">{reservationData.tableNumber}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-green-700/30">
              <p className="text-gray-400 text-xs">Customer</p>
              <p className="text-white font-semibold">{reservationData.customerName}</p>
              <p className="text-gray-400 text-sm">{reservationData.customerEmail}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
