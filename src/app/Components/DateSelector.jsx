'use client';
import React, { useState } from 'react';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const DateSelector = ({ onDateSelect, onBack }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date) => {
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    return date >= today && date <= twoWeeksLater;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (isDateInRange(clickedDate)) {
      setSelectedDate(clickedDate);
    }
  };

  const handleContinue = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateSelect(formattedDate);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isInRange = isDateInRange(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={!isInRange}
          className={`relative p-2 sm:p-3 rounded-lg text-center transition-all duration-200 ${
            isSelected
              ? 'bg-amber-600 text-white font-bold scale-110 shadow-lg shadow-amber-900/50'
              : isInRange
              ? 'bg-gray-800 text-white hover:bg-amber-700/50 hover:scale-105'
              : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isToday && isInRange && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <span className="text-sm sm:text-base">{day}</span>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-white">Select Date</h2>
          <p className="text-gray-400 text-sm mt-1">Available for next 2 weeks</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-900/50 p-4 sm:p-6 rounded-2xl border border-gray-800">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-xl font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-amber-400 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {renderCalendar()}
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-center p-4 bg-amber-900/30 border border-amber-700 rounded-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar size={20} className="text-amber-400" />
            <p className="text-amber-200 text-sm font-medium">Selected Date</p>
          </div>
          <p className="text-white text-lg font-bold">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleContinue}
          disabled={!selectedDate}
          className={`
            px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
            ${selectedDate 
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-900/30 transform hover:-translate-y-0.5' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
          `}
        >
          Continue to Table Selection
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
