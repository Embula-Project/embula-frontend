import React, { useState } from 'react';
import { Users, Utensils, Coffee, Sun } from 'lucide-react';

const ReservationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    members: '',
    mealType: ''
  });

  const [errors, setErrors] = useState({});

  const memberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: Sun, color: 'amber' },
    { value: 'lunch', label: 'Lunch', icon: Utensils, color: 'orange' },
    { value: 'dinner', label: 'Dinner', icon: Coffee, color: 'amber' }
  ];

  const handleSubmit = (e) => {
    const newErrors = {};

    if (!formData.members) {
      newErrors.members = 'Please select number of members';
    }

    if (!formData.mealType) {
      newErrors.mealType = 'Please select meal type';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Reservation Details</h2>
        <p className="text-amber-200">Let's start with basic information</p>
      </div>

      {/* Number of Members */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-white mb-4">
          <Users className="inline-block w-5 h-5 mr-2" />
          Number of Members
        </label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {memberOptions.map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleChange('members', num.toString())}
              className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                formData.members === num.toString()
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        {errors.members && <p className="text-red-400 text-sm mt-2">{errors.members}</p>}
      </div>

      {/* Meal Type */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-white mb-4">
          <Utensils className="inline-block w-5 h-5 mr-2" />
          Meal Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mealTypes.map(meal => {
            const IconComponent = meal.icon;
            return (
              <button
                key={meal.value}
                type="button"
                onClick={() => handleChange('mealType', meal.value)}
                className={`p-6 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  formData.mealType === meal.value
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3" />
                <div className="text-xl font-semibold">{meal.label}</div>
                <div className="text-sm opacity-80 mt-1">
                  {meal.value === 'breakfast' && '7:00 AM - 11:00 AM'}
                  {meal.value === 'lunch' && '12:00 PM - 4:00 PM'}
                  {meal.value === 'dinner' && '6:00 PM - 11:00 PM'}
                </div>
              </button>
            );
          })}
        </div>
        {errors.mealType && <p className="text-red-400 text-sm mt-2">{errors.mealType}</p>}
      </div>

      {/* Submit Button */}
      <div className="text-center pt-6">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-12 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-600/30"
        >
          Continue to Time Selection
        </button>
      </div>
    </div>
  );
};

export default ReservationForm;