'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';

const TableLayout = ({ reservationData, onTableSelect, onBack }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
  const [reservedTableIds, setReservedTableIds] = useState([]);

  useEffect(() => {
    const fetchTablesAndReservations = async () => {
      try {
        setLoading(true);
        
        // Fetch all tables
        const tablesResponse = await fetch('http://localhost:8081/api/reservations/available-tables');
        if (!tablesResponse.ok) {
          throw new Error('Failed to fetch tables. Please try again later.');
        }
        const tablesData = await tablesResponse.json();
        setTables(tablesData);
        
        // Fetch existing reservations for the selected date and mealType
        if (reservationData.selectedDate && reservationData.mealType) {
          try {
            // Convert mealType to uppercase to match backend enum
            const mealTypeUpperCase = reservationData.mealType.toUpperCase();
            const reservationsResponse = await fetch(
              `http://localhost:8081/api/reservations/check?date=${reservationData.selectedDate}&mealType=${mealTypeUpperCase}`
            );
            
            if (reservationsResponse.ok) {
              const reservationsData = await reservationsResponse.json();
              // Extract table IDs from reservations with BOOKED status
              const bookedTableIds = reservationsData
                .filter(res => res.status === 'BOOKED')
                .map(res => res.tableId);
              setReservedTableIds(bookedTableIds);
              console.log('Reserved table IDs for date', reservationData.selectedDate, 'and meal', mealTypeUpperCase, ':', bookedTableIds);
              console.log('Full reservation data:', reservationsData);
            } else {
              console.warn('Failed to fetch reservations:', reservationsResponse.status);
            }
          } catch (err) {
            console.warn('Could not fetch reservations:', err);
            // Continue without reservation data
          }
        }
        
        console.log('Fetched tables:', tablesData);
        console.log('Reservation data:', reservationData);
      } catch (err) {
        console.error("Error fetching tables:", err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTablesAndReservations();
  }, [reservationData.selectedDate, reservationData.mealType]);

  const handleTableClick = (table) => {
    setSelectedTableId(table.id);
  };

  const handleConfirm = () => {
    if (selectedTableId) {
      const table = tables.find(t => t.id === selectedTableId);
      onTableSelect(table.tableNumber); 
    }
  };

  const getTableLabel = (capacity) => {
    if (capacity <= 2) return "Couple / Friends";
    if (capacity <= 4) return "Family / Small Group";
    if (capacity <= 6) return "Group Party";
    return "Big Family / Party";
  };

  const renderChairs = (capacity) => {
    const chairs = [];
    const positions = {
      2: ['top-1/2 -left-3 -translate-y-1/2 h-8 w-2', 'top-1/2 -right-3 -translate-y-1/2 h-8 w-2'],
      3: ['top-1/2 -left-3 -translate-y-1/2 h-8 w-2', 'top-1/2 -right-3 -translate-y-1/2 h-8 w-2', 'bottom-[-12px] left-1/2 -translate-x-1/2 w-8 h-2'],
      4: ['top-[-12px] left-1/2 -translate-x-1/2 w-8 h-2', 'bottom-[-12px] left-1/2 -translate-x-1/2 w-8 h-2', 'top-1/2 -left-3 -translate-y-1/2 h-8 w-2', 'top-1/2 -right-3 -translate-y-1/2 h-8 w-2'],
      6: ['top-[-12px] left-1/4 -translate-x-1/2 w-8 h-2', 'top-[-12px] right-1/4 translate-x-1/2 w-8 h-2', 'bottom-[-12px] left-1/4 -translate-x-1/2 w-8 h-2', 'bottom-[-12px] right-1/4 translate-x-1/2 w-8 h-2', 'top-1/2 -left-3 -translate-y-1/2 h-8 w-2', 'top-1/2 -right-3 -translate-y-1/2 h-8 w-2'],
      8: ['top-[-12px] left-1/4 -translate-x-1/2 w-8 h-2', 'top-[-12px] left-1/2 -translate-x-1/2 w-8 h-2', 'top-[-12px] right-1/4 translate-x-1/2 w-8 h-2', 'bottom-[-12px] left-1/4 -translate-x-1/2 w-8 h-2', 'bottom-[-12px] left-1/2 -translate-x-1/2 w-8 h-2', 'bottom-[-12px] right-1/4 translate-x-1/2 w-8 h-2', 'top-1/2 -left-3 -translate-y-1/2 h-8 w-2', 'top-1/2 -right-3 -translate-y-1/2 h-8 w-2']
    };

    const defaultPos = positions[4]; // Fallback
    const currentPos = positions[capacity] || defaultPos;

    return currentPos.map((pos, i) => (
      <div key={i} className={`absolute bg-gray-300 rounded-full ${pos}`} />
    ));
  };

  const filteredTables = tables.filter(table => {
    const isGround = table.tableNumber.toLowerCase().startsWith('f0');
    return selectedFloor === 'Ground Floor' ? isGround : !isGround;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-amber-200">Loading restaurant layout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold text-white">Unable to load tables</h3>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Select Your Table</h2>
          <p className="text-gray-400 text-sm mt-1">
            {reservationData.mealType} • {reservationData.members} guests
          </p>
        </div>
        <div className="w-20 hidden sm:block"></div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-gray-300">Available & Suitable</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <div className="w-4 h-4 rounded bg-red-600"></div>
          <span className="text-gray-300">Already Reserved</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <div className="w-4 h-4 rounded bg-gray-600"></div>
          <span className="text-gray-300">Too Small</span>
        </div>
      </div>

      {/* Floor Selector */}
      <div className="flex justify-center gap-4">
        {['Ground Floor', 'First Floor'].map((floor) => {
          // Check if this floor has any suitable tables
          const memberCount = parseInt(reservationData.members);
          const hasSuitableTables = tables.some(table => {
            const isGround = table.tableNumber.toLowerCase().startsWith('f0');
            const isThisFloor = floor === 'Ground Floor' ? isGround : !isGround;
            return isThisFloor && !isNaN(memberCount) && table.capacity >= memberCount;
          });

          return (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`relative px-6 py-2 rounded-full font-medium transition-all ${
                selectedFloor === floor
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {floor}
              {hasSuitableTables && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reserved Tables Info */}
      {reservedTableIds.length > 0 && (
        <div className="text-center p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
          <p className="text-red-400 text-sm">
            ⚠️ {reservedTableIds.length} table{reservedTableIds.length !== 1 ? 's are' : ' is'} already reserved for {reservationData.mealType} on {new Date(reservationData.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 p-8 bg-gray-900/50 rounded-3xl border border-gray-800 min-h-[400px]">`
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const isReserved = reservedTableIds.includes(table.id);
          const memberCount = parseInt(reservationData.members);
          const isSuitable = !isNaN(memberCount) && table.capacity >= memberCount;
          const isClickable = isSuitable && !isReserved;
          
          // Debug logging for reserved tables
          if (isReserved) {
            console.log('Reserved table found:', {
              tableId: table.id,
              tableNumber: table.tableNumber,
              capacity: table.capacity,
              date: reservationData.selectedDate,
              mealType: reservationData.mealType
            });
          }
          
          // Color coding based on capacity
          let tableColor = 'bg-gray-200 hover:bg-gray-300';
          if (table.capacity <= 2) tableColor = 'bg-sky-200 hover:bg-sky-300';
          else if (table.capacity <= 6) tableColor = 'bg-violet-200 hover:bg-violet-300';
          else tableColor = 'bg-rose-200 hover:bg-rose-300';

          return (
            <div
              key={table.id}
              onClick={() => isClickable && handleTableClick(table)}
              className={`relative flex flex-col items-center justify-center group ${
                !isClickable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {/* Reserved Badge */}
              {isReserved && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10 shadow-lg">
                  Reserved
                </div>
              )}
              
              {/* Table Surface */}
              <div className={`relative w-24 h-20 rounded-xl transition-all duration-300 flex flex-col items-center justify-center mb-2
                ${isSelected 
                  ? 'bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.4)] scale-110 ring-4 ring-teal-500/50' 
                  : isReserved
                    ? 'bg-red-900/50 border-2 border-red-500'
                    : isClickable
                      ? `${tableColor} ring-2 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]`
                      : 'bg-gray-700'
                }`}
              >
                {/* Chairs */}
                {renderChairs(table.capacity)}
                
                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="absolute top-1 right-1 text-teal-900">
                    <CheckCircle size={16} fill="currentColor" className="text-white" />
                  </div>
                )}
                
                {/* Capacity Display */}
                <span className={`font-bold text-base ${isSelected ? 'text-teal-900' : isReserved ? 'text-red-200' : 'text-gray-600'}`}>
                  {table.capacity}
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-teal-800' : isReserved ? 'text-red-300' : 'text-gray-500'}`}>
                  Seats
                </span>
              </div>

              {/* Label */}
              <div className="text-center mt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isSelected ? 'bg-teal-900/50 text-teal-200' : 'text-gray-500'
                }`}>
                  {getTableLabel(table.capacity)}
                </span>
              </div>
            </div>
          );
        })}
        
        {filteredTables.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-12">
            <MapPin size={48} className="mb-4 opacity-50" />
            <p>No tables available on this floor</p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedTableId}
          className={`
            px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
            ${selectedTableId 
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-900/30 transform hover:-translate-y-0.5' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
          `}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default TableLayout;
