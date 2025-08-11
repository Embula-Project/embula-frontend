import React, { useState } from 'react';
import { Clock, ArrowLeft, Users } from 'lucide-react';

const TimeSlotSelector = ({ mealType, members, onTimeSelect, onBack }) => {
  const [selectedTime, setSelectedTime] = useState('');

  const getTimeSlots = (mealType) => {
    const slots = {
      breakfast: [
        '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', 
        '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
      ],
      lunch: [
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', 
        '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
      ],
      dinner: [
        '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', 
        '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM'
      ]
    };
    return slots[mealType] || [];
  };

  const isTimeAvailable = (time) => {
    // Mock availability logic - you can replace this with real data
    const unavailableTimes = ['08:00 AM', '01:00 PM', '07:30 PM', '09:00 PM'];
    return !unavailableTimes.includes(time);
  };

  const getAvailabilityStatus = (time) => {
    if (!isTimeAvailable(time)) return 'unavailable';
    
    // Mock limited availability
    const limitedTimes = ['07:30 AM', '12:30 PM', '06:30 PM', '10:30 PM'];
    if (limitedTimes.includes(time)) return 'limited';
    
    return 'available';
  };

  const handleTimeSelect = (time) => {
    if (isTimeAvailable(time)) {
      setSelectedTime(time);
    }
  };

  const handleContinue = () => {
    if (selectedTime) {
      onTimeSelect(selectedTime);
    }
  };

  const timeSlots = getTimeSlots(mealType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Select Time Slot</h2>
        <div className="flex items-center justify-center space-x-4 text-amber-200">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{members} members</span>
          </div>
          <span>•</span>
          <span className="capitalize">{mealType}</span>
        </div>
      </div>

      {/* Availability Legend */}
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Limited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm text-gray-300">Unavailable</span>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {timeSlots.map(time => {
          const status = getAvailabilityStatus(time);
          const isSelected = selectedTime === time;
          const isClickable = status !== 'unavailable';

          return (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              disabled={!isClickable}
              className={`relative p-4 rounded-lg font-medium transition-all transform ${
                isSelected 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                  : isClickable
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-105 border border-gray-700'
                    : 'bg-gray-900/50 text-gray-500 cursor-not-allowed border border-gray-800'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-2" />
              <div className="text-lg">{time}</div>
              
              {/* Status Indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                status === 'available' ? 'bg-green-500' :
                status === 'limited' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              
              {status === 'limited' && (
                <div className="text-xs text-amber-400 mt-1">Few tables left</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="flex items-center text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className={`font-semibold py-3 px-8 rounded-lg transition-all transform ${
            selectedTime
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white hover:scale-105 shadow-lg shadow-amber-600/30'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Table Selection
        </button>
      </div>
    </div>
  );
};

export default TimeSlotSelector;