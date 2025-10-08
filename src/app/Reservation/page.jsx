// 'use client';
// import React, { useState } from 'react';
// import { Calendar, Clock, Users, Check, ArrowLeft, MapPin } from 'lucide-react';

// // Constants and Configuration
// const TABLE_CONFIG = [
//   // Window side tables (2-seaters)
//   { id: 1, seats: 2, x: 60, y: 100, width: 90, height: 60, available: true, type: 'couple' },
//   { id: 2, seats: 2, x: 180, y: 100, width: 90, height: 60, available: true, type: 'couple' },
//   { id: 3, seats: 2, x: 300, y: 100, width: 90, height: 60, available: false, type: 'couple' },
//   { id: 4, seats: 2, x: 420, y: 100, width: 90, height: 60, available: true, type: 'couple' },
  
//   // Center area - Family tables (4-seaters)
//   { id: 5, seats: 4, x: 100, y: 200, width: 100, height: 80, available: true, type: 'family' },
//   { id: 6, seats: 4, x: 250, y: 200, width: 100, height: 80, available: true, type: 'family' },
//   { id: 7, seats: 4, x: 400, y: 200, width: 100, height: 80, available: true, type: 'family' },
  
//   // Larger group tables (6-seaters)
//   { id: 8, seats: 6, x: 80, y: 320, width: 120, height: 90, available: true, type: 'group' },
//   { id: 9, seats: 6, x: 250, y: 320, width: 120, height: 90, available: true, type: 'group' },
//   { id: 10, seats: 6, x: 420, y: 320, width: 120, height: 90, available: true, type: 'group' },
  
//   // Premium large table (8-seater)
//   { id: 11, seats: 8, x: 200, y: 440, width: 140, height: 100, available: true, type: 'large' }
// ];

// const TIME_SLOTS = [
//   '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
//   '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
// ];

// // Utility Functions
// const getTableColor = (table, selectedTable, partySize) => {
//   if (!table.available) return '#1f2937';
//   if (selectedTable?.id === table.id) return '#d97706';
//   if (table.seats === partySize) return '#92400e';
//   if (table.seats >= partySize) return '#78350f';
//   return '#374151';
// };

// const getTableTypeLabel = (seats) => {
//   const labels = { 2: 'Intimate', 4: 'Family', 6: 'Group', 8: 'Large Group' };
//   return labels[seats] || 'Table';
// };

// // UI Components
// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md', 
//   disabled = false, 
//   onClick, 
//   className = '' 
// }) => {
//   const baseClasses = 'transition-all duration-300 font-medium rounded-xl focus:outline-none focus:ring-2';
//   const variants = {
//     primary: 'bg-amber-700 text-white hover:bg-amber-600 disabled:bg-gray-600 focus:ring-amber-500',
//     secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 focus:ring-gray-500',
//     outline: 'border-2 border-gray-600 bg-transparent text-gray-300 hover:border-amber-600 hover:bg-gray-700 focus:ring-amber-500'
//   };
//   const sizes = {
//     sm: 'px-3 py-2 text-sm',
//     md: 'px-4 py-3',
//     lg: 'px-6 py-4 text-lg'
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-gray-800 border border-amber-700 rounded-2xl shadow-2xl ${className}`}>
//     {children}
//   </div>
// );

// // Step Components
// const PartySelector = ({ partySize, setPartySize, setSelectedTable }) => (
//   <div className="space-y-3">
//     <label className="block text-sm font-medium text-amber-200">
//       <Users className="inline w-4 h-4 mr-2" />
//       Party Size
//     </label>
//     <div className="grid grid-cols-5 gap-2">
//       {[1, 2, 4, 6, 8].map(size => (
//         <Button
//           key={size}
//           variant={partySize === size ? 'primary' : 'outline'}
//           size="sm"
//           onClick={() => {
//             setPartySize(size);
//             setSelectedTable(null);
//           }}
//           className="aspect-square flex items-center justify-center"
//         >
//           {size}
//         </Button>
//       ))}
//     </div>
//   </div>
// );

// const DateTimeSelector = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => (
//   <div className="grid md:grid-cols-2 gap-6">
//     <div className="space-y-3">
//       <label className="block text-sm font-medium text-amber-200">
//         <Calendar className="inline w-4 h-4 mr-2" />
//         Select Date
//       </label>
//       <input
//         type="date"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//         min={new Date().toISOString().split('T')[0]}
//         className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white"
//       />
//     </div>

//     <div className="space-y-3">
//       <label className="block text-sm font-medium text-amber-200">
//         <Clock className="inline w-4 h-4 mr-2" />
//         Select Time
//       </label>
//       <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
//         {TIME_SLOTS.map(time => (
//           <Button
//             key={time}
//             variant={selectedTime === time ? 'primary' : 'outline'}
//             size="sm"
//             onClick={() => setSelectedTime(time)}
//           >
//             {time}
//           </Button>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const TableLegend = () => (
//   <div className="space-y-3">
//     <h4 className="font-medium text-amber-200">Table Legend</h4>
//     <div className="grid grid-cols-2 gap-3 text-sm">
//       {[
//         { color: 'bg-amber-800', label: 'Perfect Match' },
//         { color: 'bg-amber-900', label: 'Available' },
//         { color: 'bg-amber-600', label: 'Selected' },
//         { color: 'bg-gray-700', label: 'Unavailable' }
//       ].map(({ color, label }) => (
//         <div key={label} className="flex items-center gap-2">
//           <div className={`w-4 h-4 ${color} rounded border border-amber-600 flex-shrink-0`}></div>
//           <span className="text-gray-300 truncate">{label}</span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const SelectedTableInfo = ({ selectedTable }) => {
//   if (!selectedTable) return null;
  
//   return (
//     <div className="bg-amber-900 border border-amber-700 rounded-xl p-4">
//       <h4 className="font-medium text-amber-200 mb-2 flex items-center gap-2">
//         <MapPin className="w-4 h-4" />
//         Selected Table
//       </h4>
//       <p className="text-amber-100 text-sm">
//         {getTableTypeLabel(selectedTable.seats)} Table #{selectedTable.id}
//         <br />Seats {selectedTable.seats} people
//       </p>
//     </div>
//   );
// };

// const TableElement = ({ table, selectedTable, partySize, onTableClick }) => {
//   const tableColor = getTableColor(table, selectedTable, partySize);
//   const isClickable = table.available && table.seats >= partySize;
  
//   return (
//     <g>
//       {/* Table Shadow */}
//       <rect
//         x={table.x + 3}
//         y={table.y + 3}
//         width={table.width}
//         height={table.height}
//         fill="rgba(0,0,0,0.3)"
//         rx="12"
//       />
      
//       {/* Main Table */}
//       <rect
//         x={table.x}
//         y={table.y}
//         width={table.width}
//         height={table.height}
//         fill={tableColor}
//         stroke={selectedTable?.id === table.id ? '#d97706' : '#6b7280'}
//         strokeWidth={selectedTable?.id === table.id ? 3 : 2}
//         rx="12"
//         className={`transition-all duration-300 ${
//           isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'
//         }`}
//         onClick={() => isClickable && onTableClick(table)}
//       />
      
//       {/* Table Number */}
//       <circle
//         cx={table.x + 20}
//         cy={table.y + 20}
//         r="14"
//         fill={selectedTable?.id === table.id ? '#f59e0b' : '#374151'}
//         stroke={selectedTable?.id === table.id ? '#d97706' : '#9ca3af'}
//         strokeWidth="2"
//       />
//       <text
//         x={table.x + 20}
//         y={table.y + 26}
//         textAnchor="middle"
//         className="text-sm font-bold fill-white pointer-events-none"
//       >
//         {table.id}
//       </text>
      
//       {/* Seats Info */}
//       <text
//         x={table.x + table.width / 2}
//         y={table.y + table.height / 2 + 5}
//         textAnchor="middle"
//         className="text-base sm:text-lg font-semibold fill-amber-100 pointer-events-none"
//       >
//         {table.seats}
//       </text>
      
//       {/* Table Type (hidden on very small screens) */}
//       <text
//         x={table.x + table.width / 2}
//         y={table.y + table.height - 12}
//         textAnchor="middle"
//         className="hidden sm:block text-sm fill-amber-200 pointer-events-none opacity-90"
//       >
//         {getTableTypeLabel(table.seats)}
//       </text>
//     </g>
//   );
// };

// const FloorPlanView = ({ filteredTables, selectedTable, partySize, onTableClick }) => (
//   <Card className="p-4 sm:p-6">
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//       <h3 className="text-xl font-semibold text-amber-100">Restaurant Floor Plan</h3>
//       <div className="text-sm text-gray-400">
//         Party of {partySize} • {filteredTables.filter(t => t.available).length} available
//       </div>
//     </div>
    
//     <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-8">
//       <div className="w-full overflow-x-auto">
//         <svg 
//           width="600" 
//           height="580" 
//           viewBox="0 0 600 580" 
//           className="w-full min-w-[500px] sm:min-w-0"
//           preserveAspectRatio="xMidYMid meet"
//         >
//           {/* Kitchen Area */}
//           <rect x="50" y="20" width="500" height="50" fill="#92400e" stroke="#d97706" strokeWidth="2" rx="12" opacity="0.4"/>
//           <text x="300" y="50" textAnchor="middle" className="text-lg fill-amber-200 font-bold">🍳 KITCHEN</text>
          
//           {/* Window Wall */}
//           <line x1="40" y1="85" x2="560" y2="85" stroke="#6b7280" strokeWidth="4" strokeDasharray="15,8"/>
//           <text x="300" y="100" textAnchor="middle" className="text-sm fill-gray-400">— Windows —</text>
          
//           {/* Entrance */}
//           <rect x="240" y="540" width="120" height="30" fill="#92400e" stroke="#d97706" strokeWidth="2" rx="8"/>
//           <text x="300" y="560" textAnchor="middle" className="text-sm fill-amber-100 font-bold">🚪 ENTRANCE</text>
          
//           {/* Tables */}
//           {filteredTables.map(table => (
//             <TableElement
//               key={table.id}
//               table={table}
//               selectedTable={selectedTable}
//               partySize={partySize}
//               onTableClick={onTableClick}
//             />
//           ))}
          
//           {/* Decorative Elements */}
//           <text x="40" y="540" className="text-2xl opacity-60">🪴</text>
//           <text x="560" y="540" className="text-2xl opacity-60">🪴</text>
//           <text x="40" y="120" className="text-2xl opacity-60">🪴</text>
//           <text x="560" y="120" className="text-2xl opacity-60">🪴</text>
//         </svg>
//       </div>
//     </div>
    
//     <div className="mt-4 text-center text-sm text-gray-400">
//       Tap any available table to select it for your reservation
//     </div>
//   </Card>
// );

// const TableSelectionStep = ({ 
//   partySize, setPartySize, setSelectedTable, 
//   selectedDate, setSelectedDate, 
//   selectedTime, setSelectedTime, 
//   selectedTable, onNext, filteredTables, onTableClick 
// }) => (
//   <div className="space-y-6">
//     {/* Mobile-first layout */}
//     <div className="lg:hidden space-y-6">
//       <Card className="p-4 sm:p-6">
//         <h2 className="text-2xl font-bold text-amber-100 mb-6">Reserve Your Table</h2>
//         <div className="space-y-6">
//           <PartySelector 
//             partySize={partySize} 
//             setPartySize={setPartySize} 
//             setSelectedTable={setSelectedTable} 
//           />
//           <DateTimeSelector 
//             selectedDate={selectedDate} 
//             setSelectedDate={setSelectedDate}
//             selectedTime={selectedTime} 
//             setSelectedTime={setSelectedTime} 
//           />
//           <SelectedTableInfo selectedTable={selectedTable} />
//           <TableLegend />
//         </div>
//       </Card>
      
//       <FloorPlanView
//         filteredTables={filteredTables}
//         selectedTable={selectedTable}
//         partySize={partySize}
//         onTableClick={onTableClick}
//       />
      
//       <div className="sticky bottom-4 z-10">
//         <Button
//           onClick={onNext}
//           disabled={!selectedTable || !selectedDate || !selectedTime}
//           className="w-full shadow-lg"
//           size="lg"
//         >
//           Continue to Details
//         </Button>
//       </div>
//     </div>

//     {/* Desktop layout */}
//     <div className="hidden lg:block">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-amber-100 mb-2">Reserve Your Table</h1>
//         <p className="text-gray-400">Choose your perfect spot and make a reservation</p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-1">
//           <Card className="p-6 space-y-6">
//             <PartySelector 
//               partySize={partySize} 
//               setPartySize={setPartySize} 
//               setSelectedTable={setSelectedTable} 
//             />
//             <DateTimeSelector 
//               selectedDate={selectedDate} 
//               setSelectedDate={setSelectedDate}
//               selectedTime={selectedTime} 
//               setSelectedTime={setSelectedTime} 
//             />
//             <TableLegend />
//             <SelectedTableInfo selectedTable={selectedTable} />
            
//             <Button
//               onClick={onNext}
//               disabled={!selectedTable || !selectedDate || !selectedTime}
//               className="w-full shadow-lg"
//               size="lg"
//             >
//               Continue to Details
//             </Button>
//           </Card>
//         </div>
        
//         <div className="lg:col-span-2">
//           <FloorPlanView
//             filteredTables={filteredTables}
//             selectedTable={selectedTable}
//             partySize={partySize}
//             onTableClick={onTableClick}
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const CustomerDetailsStep = ({ 
//   selectedTable, selectedDate, selectedTime, partySize,
//   customerDetails, setCustomerDetails, 
//   onBack, onNext 
// }) => (
//   <div className="max-w-2xl mx-auto space-y-6">
//     <Card className="p-4 sm:p-8">
//       <div className="flex items-center gap-4 mb-6">
//         <Button variant="secondary" size="sm" onClick={onBack} className="lg:hidden">
//           <ArrowLeft className="w-4 h-4" />
//         </Button>
//         <h2 className="text-2xl sm:text-3xl font-bold text-amber-100">Complete Your Reservation</h2>
//       </div>
      
//       <div className="bg-amber-900 border border-amber-700 rounded-xl p-4 mb-6">
//         <h3 className="font-semibold text-amber-200 mb-2">Selected Details</h3>
//         <p className="text-amber-100 text-sm sm:text-base">
//           {getTableTypeLabel(selectedTable.seats)} Table #{selectedTable.id} • {selectedDate} at {selectedTime} • {partySize} people
//         </p>
//       </div>

//       <div className="space-y-6">
//         {[
//           { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Enter your full name' },
//           { key: 'email', label: 'Email Address *', type: 'email', placeholder: 'Enter your email' },
//           { key: 'phone', label: 'Phone Number *', type: 'tel', placeholder: 'Enter your phone number' }
//         ].map(({ key, label, type, placeholder }) => (
//           <div key={key}>
//             <label className="block text-sm font-medium text-amber-200 mb-2">{label}</label>
//             <input
//               type={type}
//               value={customerDetails[key]}
//               onChange={(e) => setCustomerDetails({...customerDetails, [key]: e.target.value})}
//               className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-400"
//               placeholder={placeholder}
//             />
//           </div>
//         ))}

//         <div>
//           <label className="block text-sm font-medium text-amber-200 mb-2">Special Requests</label>
//           <textarea
//             value={customerDetails.specialRequests}
//             onChange={(e) => setCustomerDetails({...customerDetails, specialRequests: e.target.value})}
//             className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-400 h-24 resize-none"
//             placeholder="Any dietary restrictions, celebrations, or special requests?"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 mt-8">
//         <Button 
//           variant="secondary"
//           onClick={onBack}
//           className="hidden lg:flex flex-1"
//         >
//           Back
//         </Button>
//         <Button 
//           onClick={onNext}
//           disabled={!customerDetails.name || !customerDetails.email || !customerDetails.phone}
//           className="flex-1 shadow-lg"
//           size="lg"
//         >
//           Confirm Reservation
//         </Button>
//       </div>
//     </Card>
//   </div>
// );

// const ConfirmationStep = ({ 
//   selectedTable, selectedDate, selectedTime, partySize, customerDetails, onReset 
// }) => (
//   <div className="max-w-2xl mx-auto">
//     <Card className="p-4 sm:p-8 text-center">
//       <div className="w-16 sm:w-20 h-16 sm:h-20 bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-6">
//         <Check className="w-8 sm:w-10 h-8 sm:h-10 text-amber-300" />
//       </div>
//       <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-4">Reservation Confirmed!</h2>
      
//       <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
//         <h3 className="text-lg sm:text-xl font-semibold mb-4 text-amber-200">Reservation Details</h3>
//         <div className="space-y-3 text-left text-sm sm:text-base">
//           <p className="text-gray-300">
//             <span className="font-medium text-amber-300">Table:</span> {getTableTypeLabel(selectedTable.seats)} for {selectedTable.seats} people (Table #{selectedTable.id})
//           </p>
//           <p className="text-gray-300"><span className="font-medium text-amber-300">Date:</span> {selectedDate}</p>
//           <p className="text-gray-300"><span className="font-medium text-amber-300">Time:</span> {selectedTime}</p>
//           <p className="text-gray-300"><span className="font-medium text-amber-300">Name:</span> {customerDetails.name}</p>
//           <p className="text-gray-300"><span className="font-medium text-amber-300">Party Size:</span> {partySize} people</p>
//           {customerDetails.specialRequests && (
//             <p className="text-gray-300">
//               <span className="font-medium text-amber-300">Special Requests:</span> {customerDetails.specialRequests}
//             </p>
//           )}
//         </div>
//       </div>
      
//       <Button onClick={onReset} className="shadow-lg" size="lg">
//         Make Another Reservation
//       </Button>
//     </Card>
//   </div>
// );

// // Main App Component
// const RestaurantReservation = () => {
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [partySize, setPartySize] = useState(2);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [step, setStep] = useState(1);
//   const [customerDetails, setCustomerDetails] = useState({
//     name: '', email: '', phone: '', specialRequests: ''
//   });

//   const filteredTables = TABLE_CONFIG.filter(table => 
//     partySize <= 2 ? table.seats >= 2 : table.seats >= partySize
//   );

//   const handleTableClick = (table) => {
//     if (table.available && table.seats >= partySize) {
//       setSelectedTable(table);
//     }
//   };

//   const handleNext = () => {
//     if (step === 1 && selectedTable && selectedDate && selectedTime) {
//       setStep(2);
//     } else if (step === 2 && customerDetails.name && customerDetails.email && customerDetails.phone) {
//       setStep(3);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const resetReservation = () => {
//     setStep(1);
//     setSelectedTable(null);
//     setSelectedDate('');
//     setSelectedTime('');
//     setCustomerDetails({ name: '', email: '', phone: '', specialRequests: '' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-amber-900 p-4">
//       <div className="max-w-7xl mx-auto py-4 sm:py-8">
//         {step === 1 && (
//           <TableSelectionStep
//             partySize={partySize}
//             setPartySize={setPartySize}
//             setSelectedTable={setSelectedTable}
//             selectedDate={selectedDate}
//             setSelectedDate={setSelectedDate}
//             selectedTime={selectedTime}
//             setSelectedTime={setSelectedTime}
//             selectedTable={selectedTable}
//             onNext={handleNext}
//             filteredTables={filteredTables}
//             onTableClick={handleTableClick}
//           />
//         )}

//         {step === 2 && (
//           <CustomerDetailsStep
//             selectedTable={selectedTable}
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             partySize={partySize}
//             customerDetails={customerDetails}
//             setCustomerDetails={setCustomerDetails}
//             onBack={handleBack}
//             onNext={handleNext}
//           />
//         )}

//         {step === 3 && (
//           <ConfirmationStep
//             selectedTable={selectedTable}
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             partySize={partySize}
//             customerDetails={customerDetails}
//             onReset={resetReservation}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RestaurantReservation;
'use client';
import React, { useState } from 'react';
import ReservationForm from '../Components/ReservationForm';
import TimeSlotSelector from '../Components/TimeSlotSelector';
import TableLayout from '../Components/TableLayout';
import { Users, Clock, Calendar } from 'lucide-react';

const ReservationPage = () => {
  const [step, setStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    members: '',
    mealType: '',
    selectedTime: '',
    selectedTable: null
  });

  const handleFormSubmit = (data) => {
    setReservationData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setReservationData(prev => ({ ...prev, selectedTime: time }));
    setStep(3);
  };

  const handleTableSelect = (table) => {
    setReservationData(prev => ({ ...prev, selectedTable: table }));
    // Here you would typically save the reservation
    alert(`Reservation confirmed for Table ${table} at ${reservationData.selectedTime} for ${reservationData.members} members`);
  };

  const resetForm = () => {
    setStep(1);
    setReservationData({
      members: '',
      mealType: '',
      selectedTime: '',
      selectedTable: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-amber-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Table Reservation</h1>
          <p className="text-amber-200">Reserve your perfect dining experience</p>
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
              <Clock size={20} />
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-amber-600' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              step >= 3 ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-600 text-gray-400'
            }`}>
              <Calendar size={20} />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-amber-800/30 p-6">
          {step === 1 && (
            <ReservationForm onSubmit={handleFormSubmit} />
          )}
          
          {step === 2 && (
            <TimeSlotSelector 
              mealType={reservationData.mealType}
              members={reservationData.members}
              onTimeSelect={handleTimeSelect}
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
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;