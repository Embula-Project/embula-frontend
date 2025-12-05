
'use client';
import React, { useState, useEffect } from 'react';
import ReservationForm from '../components/ReservationForm';
import DateSelector from '../components/DateSelector';
import TableLayout from '../components/TableLayout';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import SuccessModal from '../components/SuccessModal';
import { Users, Clock, Calendar } from 'lucide-react';

const ReservationPage = () => {
  const [step, setStep] = useState(1);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);
  const [completedReservation, setCompletedReservation] = useState(null);
  const [reservationData, setReservationData] = useState({
    members: '',
    mealType: '',
    selectedDate: '',
    selectedTime: '',
    selectedTable: null
  });

  // Background images array - add your images to public folder
  const backgroundImages = [
    '/reservebg1.png',
    '/reservebg2.jpg',
    '/reservebg3.png',
    '/reservebg4.jpeg',
    '/reservebg5.png'
  ];

  // Auto-slide background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleFormSubmit = (data) => {
    setReservationData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setReservationData(prev => ({ ...prev, selectedDate: date }));
    setStep(3);
  };

  const handleTableSelect = async (tableNumber) => {
    const selectedTable = await findTableByNumber(tableNumber);
    if (!selectedTable) {
      alert('Error: Selected table not found');
      return;
    }

    setReservationData(prev => ({ ...prev, selectedTable: tableNumber }));
    setSelectedTableNumber(tableNumber);
    setShowCustomerModal(true);
  };

  const handleCustomerDetailsSubmit = async (customerData) => {
    const selectedTable = await findTableByNumber(selectedTableNumber);
    
    try {
      const response = await fetch('http://localhost:8081/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerData.customerName,
          customerEmail: customerData.customerEmail,
          customerPhone: customerData.customerPhone,
          date: reservationData.selectedDate,
          mealType: reservationData.mealType.toUpperCase(),
          numberOfGuests: parseInt(reservationData.members),
          tableId: selectedTable.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      const result = await response.json();
      
      // Set completed reservation data for success modal
      setCompletedReservation({
        ...result,
        customerName: customerData.customerName,
        customerEmail: customerData.customerEmail
      });
      
      // Close customer modal and show success modal
      setShowCustomerModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  const findTableByNumber = async (tableNumber) => {
    try {
      const response = await fetch('http://localhost:8081/api/reservations/available-tables');
      const tables = await response.json();
      return tables.find(t => t.tableNumber === tableNumber);
    } catch (error) {
      console.error('Error fetching tables:', error);
      return null;
    }
  };

  const resetForm = () => {
    setStep(1);
    setReservationData({
      members: '',
      mealType: '',
      selectedDate: '',
      selectedTime: '',
      selectedTable: null
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Slider */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-amber-950/70"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-24">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Table Reservation</h1>
            <p className="text-amber-200 drop-shadow">Reserve your perfect dining experience</p>
          </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              step >= 1 ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-600 text-gray-400'
            }`}>
              <Users size={20} />
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-amber-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              step >= 2 ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-600 text-gray-400'
            }`}>
              <Calendar size={20} />
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-amber-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              step >= 3 ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-600 text-gray-400'
            }`}>
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-amber-800/30 p-6 shadow-2xl">
          {step === 1 && (
            <ReservationForm onSubmit={handleFormSubmit} />
          )}
          
          {step === 2 && (
            <DateSelector 
              onDateSelect={handleDateSelect}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && (
            <TableLayout 
              reservationData={reservationData}
              onTableSelect={handleTableSelect}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        {/* Reset Button */}
        {step > 1 && (
          <div className="text-center mt-6">
            <button
              onClick={resetForm}
              className="text-amber-400 hover:text-amber-300 transition-colors drop-shadow"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={handleCustomerDetailsSubmit}
        reservationDetails={{
          date: reservationData.selectedDate,
          guests: reservationData.members,
          mealType: reservationData.mealType,
          table: selectedTableNumber
        }}
      />

      {/* Success Modal */}
      {completedReservation && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          reservationData={completedReservation}
        />
      )}
    </div>
  );
};
export default ReservationPage;