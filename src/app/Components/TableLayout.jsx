'use client';
import React, { useState } from 'react';
import { ArrowLeft, Users, Crown, Wifi, CheckCircle, Circle } from 'lucide-react';

const TableLayout = ({ reservationData, onTableSelect, onBack }) => {
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
  const [selectedTable, setSelectedTable] = useState(null);

  // Modern 2-floor layout with 2, 4, and 8 seat tables
  const floors = {
    'Ground Floor': [
      { id: 'G1', seats: 2, status: 'available', type: 'Window Side', position: 'top-left' },
      { id: 'G2', seats: 2, status: 'available', type: 'Window Side', position: 'top-right' },
      { id: 'G3', seats: 4, status: 'available', type: 'Standard', position: 'center-left' },
      { id: 'G4', seats: 4, status: 'reserved', type: 'Standard', position: 'center' },
      { id: 'G5', seats: 4, status: 'available', type: 'Standard', position: 'center-right' },
      { id: 'G6', seats: 8, status: 'available', type: 'Family', position: 'bottom-center', isVIP: true }
    ],
    'First Floor': [
      { id: 'F1', seats: 2, status: 'available', type: 'Intimate', position: 'top-left' },
      { id: 'F2', seats: 2, status: 'reserved', type: 'Intimate', position: 'top-right' },
      { id: 'F3', seats: 4, status: 'available', type: 'Premium', position: 'center-left' },
      { id: 'F4', seats: 4, status: 'available', type: 'Premium', position: 'center-right' },
      { id: 'F5', seats: 8, status: 'available', type: 'VIP Lounge', position: 'bottom-left', isVIP: true },
      { id: 'F6', seats: 8, status: 'available', type: 'VIP Lounge', position: 'bottom-right', isVIP: true }
    ]
  };

  const memberCount = parseInt(reservationData.members) || 2;

  const isTableAvailable = (table) => {
    return table.status === 'available' && table.seats >= memberCount;
  };

  const handleTableSelect = (table) => {
    if (isTableAvailable(table)) {
      setSelectedTable(table.id);
    }
  };

  const handleConfirm = () => {
    if (selectedTable) {
      const table = floors[selectedFloor].find(t => t.id === selectedTable);
      onTableSelect(`${selectedTable} - ${table.type} (${table.seats} seats)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Select Your Table</h2>
          <p className="text-gray-400 text-sm mt-1">
            {reservationData.mealType} • {reservationData.selectedTime} • {memberCount} guests
          </p>
        </div>
        <div className="w-20 hidden sm:block"></div>
      </div>

      {/* Floor Selector */}
      <div className="flex gap-3 justify-center flex-wrap">
        {Object.keys(floors).map((floor) => (
          <button
            key={floor}
            onClick={() => {
              setSelectedFloor(floor);
              setSelectedTable(null);
            }}
            className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedFloor === floor
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
          <span className="text-gray-300">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded"></div>
          <span className="text-gray-300">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="text-amber-500" size={16} />
          <span className="text-gray-300">VIP Table</span>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {floors[selectedFloor].map((table) => {
          const isSelected = selectedTable === table.id;
          const available = isTableAvailable(table);
          const isReserved = table.status === 'reserved';

          return (
            <div
              key={table.id}
              onClick={() => handleTableSelect(table)}
              className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-500 shadow-xl shadow-blue-500/30 scale-105'
                  : available
                  ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-green-500/50 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer hover:scale-105'
                  : 'bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* VIP Badge */}
              {table.isVIP && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Crown size={12} />
                  VIP
                </div>
              )}

              {/* Status Indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                {isSelected ? (
                  <CheckCircle className="text-blue-400" size={20} />
                ) : available ? (
                  <Circle className="text-green-500" size={20} />
                ) : (
                  <Circle className="text-gray-600" size={20} fill="currentColor" />
                )}
              </div>

              {/* Table Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : available 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {table.id}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">{table.type}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{table.seats} Seats</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-700">
                    <Users size={10} className="inline mr-1" />
                    {table.seats} guests
                  </span>
                  {table.isVIP && (
                    <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded-full border border-amber-700">
                      <Wifi size={10} className="inline mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Status */}
                <div className={`text-xs sm:text-sm font-medium ${
                  isSelected 
                    ? 'text-blue-400' 
                    : available 
                    ? 'text-green-400' 
                    : 'text-gray-500'
                }`}>
                  {isSelected ? '✓ Selected' : available ? 'Available Now' : 'Reserved'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedTable}
          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 ${
            selectedTable
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 shadow-lg hover:shadow-amber-500/50 hover:scale-105'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};

export default TableLayout;
