// import React, { useState } from 'react';
// import { ArrowLeft, Users, Clock, Calendar, Crown } from 'lucide-react';

// const TableLayout = ({ reservationData, onTableSelect, onBack }) => {
//   const [selectedTable, setSelectedTable] = useState(null);

//   // Enhanced table data with more realistic positioning and details
//   const tableData = {
//     'Ground Floor': {
//       tables: [
//         { id: 'T1', status: 'available', capacity: 4, position: { x: '20%', y: '30%' }, shape: 'round' },
//         { id: 'T2', status: 'available', capacity: 2, position: { x: '45%', y: '25%' }, shape: 'square' },
//         { id: 'T3', status: 'available', capacity: 6, position: { x: '70%', y: '35%' }, shape: 'oval' },
//         { id: 'T4', status: 'available', capacity: 4, position: { x: '85%', y: '60%' }, shape: 'round' },
//       ]
//     },
//     '1st Floor': {
//       tables: [
//         { id: 'T5', status: 'reserved', capacity: 2, position: { x: '15%', y: '40%' }, shape: 'square' },
//         { id: 'T6', status: 'available', capacity: 8, position: { x: '50%', y: '50%' }, shape: 'rectangular', isVIP: true },
//         { id: 'T7', status: 'available', capacity: 4, position: { x: '70%', y: '30%' }, shape: 'round' },
//         { id: 'T8', status: 'available', capacity: 4, position: { x: '75%', y: '70%' }, shape: 'round' },
//         { id: 'T9', status: 'reserved', capacity: 2, position: { x: '25%', y: '75%' }, shape: 'square' }
//       ]
//     },
//     '2nd Floor': {
//       tables: [
//         { id: 'T10', status: 'available', capacity: 6, position: { x: '25%', y: '35%' }, shape: 'oval' },
//         { id: 'T11', status: 'available', capacity: 4, position: { x: '50%', y: '25%' }, shape: 'round' },
//         { id: 'T12', status: 'available', capacity: 6, position: { x: '75%', y: '40%' }, shape: 'oval' },
//         { id: 'T13', status: 'available', capacity: 8, position: { x: '50%', y: '70%' }, shape: 'rectangular' }
//       ]
//     },
//     'Rooftop Terrace': {
//       tables: [
//         { id: 'T14', status: 'available', capacity: 4, position: { x: '30%', y: '30%' }, shape: 'round', isOutdoor: true },
//         { id: 'T15', status: 'available', capacity: 6, position: { x: '60%', y: '35%' }, shape: 'oval', isOutdoor: true },
//         { id: 'T16', status: 'reserved', capacity: 2, position: { x: '80%', y: '60%' }, shape: 'square', isOutdoor: true }
//       ]
//     }
//   };

//   const getTableStyle = (table, isSelected) => {
//     const baseStyle = "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer";
    
//     if (table.shape === 'round') {
//       return `${baseStyle} w-16 h-16 rounded-full`;
//     } else if (table.shape === 'square') {
//       return `${baseStyle} w-14 h-14 rounded-lg`;
//     } else if (table.shape === 'oval') {
//       return `${baseStyle} w-20 h-14 rounded-full`;
//     } else if (table.shape === 'rectangular') {
//       return `${baseStyle} w-24 h-16 rounded-xl`;
//     }
//     return `${baseStyle} w-16 h-16 rounded-full`;
//   };

//   const getTableColor = (table, isSelected) => {
//     if (isSelected) return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50 border-2 border-blue-300';
//     if (table.status === 'reserved') return 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30';
//     if (table.status === 'available') return 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30';
//     return 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30';
//   };

//   const isTableSuitable = (table) => {
//     const memberCount = parseInt(reservationData.members);
//     return table.capacity >= memberCount && table.status === 'available';
//   };

//   const handleTableClick = (table) => {
//     if (isTableSuitable(table)) {
//       setSelectedTable(table.id);
//     }
//   };

//   const handleConfirm = () => {
//     if (selectedTable) {
//       onTableSelect(selectedTable);
//     }
//   };

//   const renderChairs = (table) => {
//     const chairs = [];
//     const capacity = table.capacity;
//     const chairSize = "w-2.5 h-2.5";
//     const chairColor = "bg-amber-100 border border-amber-300 rounded-sm shadow-sm";

//     if (capacity === 2) {
//       if (table.shape === 'square') {
//         chairs.push(
//           <div key="chair1" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair2" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>
//         );
//       } else {
//         chairs.push(
//           <div key="chair1" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair2" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
//         );
//       }
//     } else if (capacity === 4) {
//       chairs.push(
//         <div key="chair1" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair2" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair3" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair4" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
//       );
//     } else if (capacity === 6) {
//       if (table.shape === 'oval') {
//         chairs.push(
//           <div key="chair1" className={`absolute -top-3 left-1/3 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair2" className={`absolute -top-3 right-1/3 transform translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair3" className={`absolute -bottom-3 left-1/3 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair4" className={`absolute -bottom-3 right-1/3 transform translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair5" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
//           <div key="chair6" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
//         );
//       }
//     } else if (capacity === 8) {
//       chairs.push(
//         <div key="chair1" className={`absolute -top-3 left-1/4 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair2" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair3" className={`absolute -top-3 right-1/4 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair4" className={`absolute -bottom-3 left-1/4 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair5" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair6" className={`absolute -bottom-3 right-1/4 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair7" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
//         <div key="chair8" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
//       );
//     }

//     return chairs;
//   };

//   const stats = {
//     totalTables: Object.values(tableData).reduce((acc, floor) => acc + floor.tables.length, 0),
//     availableTables: Object.values(tableData).reduce((acc, floor) => 
//       acc + floor.tables.filter(t => t.status === 'available').length, 0),
//     reservedTables: Object.values(tableData).reduce((acc, floor) => 
//       acc + floor.tables.filter(t => t.status === 'reserved').length, 0),
//     suitableTables: Object.values(tableData).reduce((acc, floor) => 
//       acc + floor.tables.filter(t => isTableSuitable(t)).length, 0)
//   };

//   return (
//     <div className="space-y-8">
//       {/* Elegant Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">Select Your Table</h2>
//         <div className="flex justify-center items-center space-x-8 text-amber-200 bg-gradient-to-r from-black/60 via-amber-900/20 to-black/60 rounded-xl p-6 backdrop-blur-sm border border-amber-800/30">
//           <div className="flex items-center space-x-2">
//             <Users className="w-5 h-5 text-amber-400" />
//             <span className="font-medium">{reservationData.members} Guests</span>
//           </div>
//           <div className="w-1 h-6 bg-amber-600/50"></div>
//           <div className="flex items-center space-x-2">
//             <Clock className="w-5 h-5 text-amber-400" />
//             <span className="font-medium">{reservationData.selectedTime}</span>
//           </div>
//           <div className="w-1 h-6 bg-amber-600/50"></div>
//           <div className="flex items-center space-x-2">
//             <Calendar className="w-5 h-5 text-amber-400" />
//             <span className="font-medium capitalize">{reservationData.mealType}</span>
//           </div>
//         </div>
//       </div>

//       {/* Elegant Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//         {[
//           { label: 'Total Tables', value: stats.totalTables, color: 'from-gray-600 to-gray-700', icon: '🍽️' },
//           { label: 'Available', value: stats.availableTables, color: 'from-green-500 to-green-600', icon: '✅' },
//           { label: 'Reserved', value: stats.reservedTables, color: 'from-red-500 to-red-600', icon: '🔒' },
//           { label: 'Perfect for You', value: stats.suitableTables, color: 'from-amber-500 to-amber-600', icon: '⭐' }
//         ].map((stat, index) => (
//           <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-center transform hover:scale-105 transition-all shadow-lg`}>
//             <div className="text-2xl mb-2">{stat.icon}</div>
//             <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
//             <div className="text-sm text-gray-200 font-medium">{stat.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Enhanced Legend */}
//       <div className="flex justify-center space-x-8 mb-8">
//         {[
//           { color: 'bg-gradient-to-r from-green-400 to-green-600', label: 'Available', icon: '✓' },
//           { color: 'bg-gradient-to-r from-red-400 to-red-600', label: 'Reserved', icon: '✗' },
//           { color: 'bg-gradient-to-r from-blue-400 to-blue-600', label: 'Selected', icon: '★' },
//           { color: 'bg-gradient-to-r from-purple-400 to-purple-600', label: 'VIP Table', icon: '👑' }
//         ].map((item, index) => (
//           <div key={index} className="flex items-center space-x-3">
//             <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
//               {item.icon}
//             </div>
//             <span className="text-gray-300 font-medium">{item.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Restaurant Floor Plans */}
//       {Object.entries(tableData).map(([floorName, floorData]) => (
//         <div key={floorName} className="bg-gradient-to-br from-gray-900/80 via-black/60 to-amber-950/40 rounded-2xl p-8 border-2 border-amber-800/30 shadow-2xl backdrop-blur-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-white flex items-center">
//               {floorName === 'Rooftop Terrace' && <span className="mr-2">🌟</span>}
//               {floorName}
//               {floorName === 'Rooftop Terrace' && <span className="ml-2 text-sm bg-amber-600 px-2 py-1 rounded-full">Outdoor</span>}
//             </h3>
//             <div className="text-amber-400 font-semibold">
//               {floorData.tables.filter(t => t.status === 'available').length}/{floorData.tables.length} Available
//             </div>
//           </div>
          
//           {/* Enhanced Floor Layout */}
//           <div className={`relative rounded-xl h-80 overflow-hidden border-2 ${
//             floorName === 'Rooftop Terrace' ? 'border-amber-600/50 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40' : 'border-gray-700/50 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-black/60'
//           }`}>
//             {/* Floor Pattern */}
//             <div className="absolute inset-0 opacity-10">
//               <div className="w-full h-full" style={{
//                 backgroundImage: `${floorName === 'Rooftop Terrace' 
//                   ? 'radial-gradient(circle at 25px 25px, #fbbf24 2px, transparent 2px)' 
//                   : 'radial-gradient(circle at 20px 20px, #6b7280 1px, transparent 1px)'
//                 }`,
//                 backgroundSize: '50px 50px'
//               }}></div>
//             </div>

//             {/* Tables */}
//             {floorData.tables.map(table => {
//               const isSelected = selectedTable === table.id;
//               const isSuitable = isTableSuitable(table);
              
//               return (
//                 <div
//                   key={table.id}
//                   className="absolute transform -translate-x-1/2 -translate-y-1/2"
//                   style={{
//                     left: table.position.x,
//                     top: table.position.y
//                   }}
//                 >
//                   <button
//                     onClick={() => handleTableClick(table)}
//                     disabled={!isSuitable}
//                     className={`relative ${getTableStyle(table, isSelected)} ${
//                       isSuitable ? 'hover:scale-110 hover:shadow-xl' : 'cursor-not-allowed opacity-60'
//                     } ${getTableColor(table, isSelected)} ${
//                       isSelected ? 'animate-pulse' : ''
//                     }`}
//                   >
//                     {/* VIP Crown */}
//                     {table.isVIP && (
//                       <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 text-yellow-400 animate-bounce" />
//                     )}

//                     {/* Outdoor indicator */}
//                     {table.isOutdoor && (
//                       <div className="absolute -top-2 -right-2 text-xs">🌿</div>
//                     )}

//                     {/* Table Number */}
//                     <div className="relative z-10 text-white font-bold text-sm flex items-center justify-center h-full">
//                       {table.id.replace('T', '')}
//                     </div>

//                     {/* Chairs */}
//                     {renderChairs(table)}

//                     {/* Table Details Tooltip */}
//                     <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
//                       <div className="text-xs text-gray-400 font-medium">{table.capacity} seats</div>
//                       {table.isVIP && <div className="text-xs text-yellow-400">VIP</div>}
//                       {table.isOutdoor && <div className="text-xs text-green-400">Outdoor</div>}
//                     </div>
//                   </button>
//                 </div>
//               );
//             })}

//             {/* Floor Label */}
//             <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg px-3 py-2">
//               <span className="text-amber-400 font-semibold text-sm">{floorName}</span>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Enhanced Selected Table Info */}
//       {selectedTable && (
//         <div className="bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-blue-600/30 border-2 border-blue-400/50 rounded-xl p-6 backdrop-blur-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="text-xl font-bold text-white mb-2 flex items-center">
//                 🎯 Table {selectedTable.replace('T', '')} Selected
//               </h4>
//               {(() => {
//                 const table = Object.values(tableData)
//                   .flatMap(floor => floor.tables)
//                   .find(t => t.id === selectedTable);
//                 return (
//                   <div className="text-blue-200 space-y-1">
//                     <p>📍 Capacity: {table?.capacity} guests (Perfect for your party of {reservationData.members})</p>
//                     <p>🪑 Table Shape: {table?.shape}</p>
//                     {table?.isVIP && <p className="text-yellow-300">👑 Premium VIP Experience</p>}
//                     {table?.isOutdoor && <p className="text-green-300">🌿 Beautiful Outdoor Setting</p>}
//                   </div>
//                 );
//               })()}
//             </div>
//             <div className="text-6xl">🍽️</div>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex justify-between items-center pt-8">
//         <button
//           onClick={onBack}
//           className="flex items-center text-amber-400 hover:text-amber-300 transition-all transform hover:scale-105 bg-amber-900/20 px-6 py-3 rounded-lg border border-amber-600/30"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Time Selection
//         </button>

//         <button
//           onClick={handleConfirm}
//           disabled={!selectedTable}
//           className={`font-bold py-4 px-12 rounded-xl transition-all transform ${
//             selectedTable
//               ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white hover:scale-105 shadow-xl shadow-green-500/30 border-2 border-green-400/50'
//               : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border-2 border-gray-600/30'
//           }`}
//         >
//           {selectedTable ? '🎉 Confirm Reservation' : '⏳ Select a Table'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TableLayout;
import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, Calendar, Crown, DoorOpen, Square, Trees, Sofa } from 'lucide-react';

const TableLayout = ({ reservationData, onTableSelect, onBack }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  // Enhanced table data with adjusted positioning for better alignment and spacing
  const tableData = {
    'Ground Floor': {
      tables: [
        { id: 'T1', status: 'available', capacity: 4, position: { x: '25%', y: '30%' }, shape: 'round' },
        { id: 'T2', status: 'available', capacity: 2, position: { x: '50%', y: '25%' }, shape: 'square' },
        { id: 'T3', status: 'available', capacity: 6, position: { x: '75%', y: '35%' }, shape: 'oval' },
        { id: 'T4', status: 'available', capacity: 4, position: { x: '85%', y: '65%' }, shape: 'round' },
      ],
    },
    '1st Floor': {
      tables: [
        { id: 'T5', status: 'reserved', capacity: 2, position: { x: '20%', y: '40%' }, shape: 'square' },
        { id: 'T6', status: 'available', capacity: 8, position: { x: '50%', y: '50%' }, shape: 'rectangular', isVIP: true },
        { id: 'T7', status: 'available', capacity: 4, position: { x: '70%', y: '30%' }, shape: 'round' },
        { id: 'T8', status: 'available', capacity: 4, position: { x: '75%', y: '70%' }, shape: 'round' },
        { id: 'T9', status: 'reserved', capacity: 2, position: { x: '30%', y: '75%' }, shape: 'square' },
      ],
    },
    '2nd Floor': {
      tables: [
        { id: 'T10', status: 'available', capacity: 6, position: { x: '30%', y: '35%' }, shape: 'oval' },
        { id: 'T11', status: 'available', capacity: 4, position: { x: '50%', y: '30%' }, shape: 'round' },
        { id: 'T12', status: 'available', capacity: 6, position: { x: '70%', y: '40%' }, shape: 'oval' },
        { id: 'T13', status: 'available', capacity: 8, position: { x: '50%', y: '70%' }, shape: 'rectangular' },
      ],
    },
    'Rooftop Terrace': {
      tables: [
        { id: 'T14', status: 'available', capacity: 4, position: { x: '35%', y: '30%' }, shape: 'round', isOutdoor: true },
        { id: 'T15', status: 'available', capacity: 6, position: { x: '60%', y: '40%' }, shape: 'oval', isOutdoor: true },
        { id: 'T16', status: 'reserved', capacity: 2, position: { x: '80%', y: '60%' }, shape: 'square', isOutdoor: true },
      ],
    },
  };

  const getTableStyle = (table, isSelected) => {
    const baseStyle = 'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer';
    
    if (table.shape === 'round') {
      return `${baseStyle} w-16 h-16 rounded-full`;
    } else if (table.shape === 'square') {
      return `${baseStyle} w-14 h-14 rounded-lg`;
    } else if (table.shape === 'oval') {
      return `${baseStyle} w-20 h-14 rounded-full`;
    } else if (table.shape === 'rectangular') {
      return `${baseStyle} w-24 h-16 rounded-xl`;
    }
    return `${baseStyle} w-16 h-16 rounded-full`;
  };

  const getTableColor = (table, isSelected) => {
    if (isSelected) return 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50 border-2 border-blue-300';
    if (table.status === 'reserved') return 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30';
    if (table.status === 'available') return 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30';
    return 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30';
  };

  const isTableSuitable = (table) => {
    const memberCount = parseInt(reservationData.members);
    return table.capacity >= memberCount && table.status === 'available';
  };

  const handleTableClick = (table) => {
    if (isTableSuitable(table)) {
      setSelectedTable(table.id);
    }
  };

  const handleConfirm = () => {
    if (selectedTable) {
      onTableSelect(selectedTable);
    }
  };

  const renderChairs = (table) => {
    const chairs = [];
    const capacity = table.capacity;
    const chairSize = 'w-2.5 h-2.5';
    const chairColor = 'bg-amber-100 border border-amber-300 rounded-sm shadow-sm';

    if (capacity === 2) {
      if (table.shape === 'square') {
        chairs.push(
          <div key="chair1" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair2" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>
        );
      } else {
        chairs.push(
          <div key="chair1" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair2" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
        );
      }
    } else if (capacity === 4) {
      chairs.push(
        <div key="chair1" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair2" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair3" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair4" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
      );
    } else if (capacity === 6) {
      if (table.shape === 'oval') {
        chairs.push(
          <div key="chair1" className={`absolute -top-3 left-1/3 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair2" className={`absolute -top-3 right-1/3 transform translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair3" className={`absolute -bottom-3 left-1/3 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair4" className={`absolute -bottom-3 right-1/3 transform translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair5" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
          <div key="chair6" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
        );
      }
    } else if (capacity === 8) {
      chairs.push(
        <div key="chair1" className={`absolute -top-3 left-1/4 ${chairSize} ${chairColor}`}></div>,
        <div key="chair2" className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair3" className={`absolute -top-3 right-1/4 ${chairSize} ${chairColor}`}></div>,
        <div key="chair4" className={`absolute -bottom-3 left-1/4 ${chairSize} ${chairColor}`}></div>,
        <div key="chair5" className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair6" className={`absolute -bottom-3 right-1/4 ${chairSize} ${chairColor}`}></div>,
        <div key="chair7" className={`absolute -left-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>,
        <div key="chair8" className={`absolute -right-3 top-1/2 transform -translate-y-1/2 ${chairSize} ${chairColor}`}></div>
      );
    }

    return chairs;
  };

  const stats = {
    totalTables: Object.values(tableData).reduce((acc, floor) => acc + floor.tables.length, 0),
    availableTables: Object.values(tableData).reduce((acc, floor) => 
      acc + floor.tables.filter(t => t.status === 'available').length, 0),
    reservedTables: Object.values(tableData).reduce((acc, floor) => 
      acc + floor.tables.filter(t => t.status === 'reserved').length, 0),
    suitableTables: Object.values(tableData).reduce((acc, floor) => 
      acc + floor.tables.filter(t => isTableSuitable(t)).length, 0),
  };

  const renderDecorativeElements = (floorName) => {
    const elements = [];

    // Common elements: Windows on left and right
    elements.push(
      <div
        key="window-left"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-blue-900/30 rounded-r-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-blue-900/50"
        style={{ left: '0%', top: '50%' }}
        onMouseEnter={() => setHoveredElement('Window')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <Square className="w-5 h-5 text-blue-300" />
        {hoveredElement === 'Window' && (
          <div className="absolute left-full ml-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Scenic Window</div>
        )}
      </div>,
      <div
        key="window-right"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-blue-900/30 rounded-l-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-blue-900/50"
        style={{ right: '0%', top: '50%' }}
        onMouseEnter={() => setHoveredElement('Window')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <Square className="w-5 h-5 text-blue-300" />
        {hoveredElement === 'Window' && (
          <div className="absolute right-full mr-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Scenic Window</div>
        )}
      </div>
    );

    // Entrance at bottom center
    elements.push(
      <div
        key="entrance"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-amber-800/50 rounded-t-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-amber-800/70"
        style={{ left: '50%', bottom: '0%' }}
        onMouseEnter={() => setHoveredElement('Entrance')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <DoorOpen className="w-6 h-6 text-amber-300" />
        {hoveredElement === 'Entrance' && (
          <div className="absolute bottom-full mb-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Main Entrance</div>
        )}
      </div>
    );

    // Floor-specific elements
    if (floorName === 'Ground Floor') {
      // Add a lounge area
      elements.push(
        <div
          key="lounge"
          className="absolute top-0 right-0 w-20 h-16 bg-purple-900/30 rounded-bl-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-purple-900/50"
          style={{ right: '10%', top: '10%' }}
          onMouseEnter={() => setHoveredElement('Lounge')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <Sofa className="w-6 h-6 text-purple-300" />
          {hoveredElement === 'Lounge' && (
            <div className="absolute top-full mt-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Cozy Lounge</div>
          )}
        </div>
      );
    } else if (floorName === 'Rooftop Terrace') {
      // Add trees/plants
      elements.push(
        <div
          key="trees"
          className="absolute top-0 left-0 w-16 h-20 bg-green-900/30 rounded-br-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:bg-green-900/50"
          style={{ left: '5%', top: '5%' }}
          onMouseEnter={() => setHoveredElement('Trees')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <Trees className="w-6 h-6 text-green-300" />
          {hoveredElement === 'Trees' && (
            <div className="absolute top-full mt-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Garden Area</div>
          )}
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-8">
      {/* Elegant Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">Select Your Table</h2>
        <div className="flex justify-center items-center space-x-8 text-amber-200 bg-gradient-to-r from-black/60 via-amber-900/20 to-black/60 rounded-xl p-6 backdrop-blur-sm border border-amber-800/30">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span className="font-medium">{reservationData.members} Guests</span>
          </div>
          <div className="w-1 h-6 bg-amber-600/50"></div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="font-medium">{reservationData.selectedTime}</span>
          </div>
          <div className="w-1 h-6 bg-amber-600/50"></div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="font-medium capitalize">{reservationData.mealType}</span>
          </div>
        </div>
      </div>

      {/* Elegant Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Tables', value: stats.totalTables, color: 'from-gray-600 to-gray-700', icon: '🍽️' },
          { label: 'Available', value: stats.availableTables, color: 'from-green-500 to-green-600', icon: '✅' },
          { label: 'Reserved', value: stats.reservedTables, color: 'from-red-500 to-red-600', icon: '🔒' },
          { label: 'Perfect for You', value: stats.suitableTables, color: 'from-amber-500 to-amber-600', icon: '⭐' },
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-center transform hover:scale-105 transition-all shadow-lg`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-200 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enhanced Legend */}
      <div className="flex justify-center space-x-8 mb-8">
        {[
          { color: 'bg-gradient-to-r from-green-400 to-green-600', label: 'Available', icon: '✓' },
          { color: 'bg-gradient-to-r from-red-400 to-red-600', label: 'Reserved', icon: '✗' },
          { color: 'bg-gradient-to-r from-blue-400 to-blue-600', label: 'Selected', icon: '★' },
          { color: 'bg-gradient-to-r from-purple-400 to-purple-600', label: 'VIP Table', icon: '👑' },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
              {item.icon}
            </div>
            <span className="text-gray-300 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Restaurant Floor Plans */}
      {Object.entries(tableData).map(([floorName, floorData]) => (
        <div key={floorName} className="bg-gradient-to-br from-gray-900/80 via-black/60 to-amber-950/40 rounded-2xl p-8 border-2 border-amber-800/30 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              {floorName === 'Rooftop Terrace' && <span className="mr-2">🌟</span>}
              {floorName}
              {floorName === 'Rooftop Terrace' && <span className="ml-2 text-sm bg-amber-600 px-2 py-1 rounded-full">Outdoor</span>}
            </h3>
            <div className="text-amber-400 font-semibold">
              {floorData.tables.filter(t => t.status === 'available').length}/{floorData.tables.length} Available
            </div>
          </div>
          
          {/* Enhanced Floor Layout */}
          <div className={`relative rounded-xl h-80 overflow-hidden border-2 ${
            floorName === 'Rooftop Terrace' ? 'border-amber-600/50 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40' : 'border-gray-700/50 bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-black/60'
          }`}>
            {/* Floor Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `${floorName === 'Rooftop Terrace' 
                  ? 'radial-gradient(circle at 25px 25px, #fbbf24 2px, transparent 2px)' 
                  : 'radial-gradient(circle at 20px 20px, #6b7280 1px, transparent 1px)'
                }`,
                backgroundSize: '50px 50px',
              }}></div>
            </div>

            {/* Decorative Elements */}
            {renderDecorativeElements(floorName)}

            {/* Tables */}
            {floorData.tables.map((table) => {
              const isSelected = selectedTable === table.id;
              const isSuitable = isTableSuitable(table);
              
              return (
                <div
                  key={table.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: table.position.x,
                    top: table.position.y,
                  }}
                >
                  <button
                    onClick={() => handleTableClick(table)}
                    disabled={!isSuitable}
                    className={`relative ${getTableStyle(table, isSelected)} ${
                      isSuitable ? 'hover:scale-110 hover:shadow-xl' : 'cursor-not-allowed opacity-60'
                    } ${getTableColor(table, isSelected)} ${
                      isSelected ? 'animate-pulse' : ''
                    }`}
                  >
                    {/* VIP Crown */}
                    {table.isVIP && (
                      <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 text-yellow-400 animate-bounce" />
                    )}

                    {/* Outdoor indicator */}
                    {table.isOutdoor && (
                      <div className="absolute -top-2 -right-2 text-xs">🌿</div>
                    )}

                    {/* Table Number */}
                    <div className="relative z-10 text-white font-bold text-sm flex items-center justify-center h-full">
                      {table.id.replace('T', '')}
                    </div>

                    {/* Chairs */}
                    {renderChairs(table)}

                    {/* Table Details Tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="text-xs text-gray-400 font-medium">{table.capacity} seats</div>
                      {table.isVIP && <div className="text-xs text-yellow-400">VIP</div>}
                      {table.isOutdoor && <div className="text-xs text-green-400">Outdoor</div>}
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Floor Label */}
            <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg px-3 py-2">
              <span className="text-amber-400 font-semibold text-sm">{floorName}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Selected Table Info */}
      {selectedTable && (
        <div className="bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-blue-600/30 border-2 border-blue-400/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                🎯 Table {selectedTable.replace('T', '')} Selected
              </h4>
              {(() => {
                const table = Object.values(tableData)
                  .flatMap((floor) => floor.tables)
                  .find((t) => t.id === selectedTable);
                return (
                  <div className="text-blue-200 space-y-1">
                    <p>📍 Capacity: {table?.capacity} guests (Perfect for your party of {reservationData.members})</p>
                    <p>🪑 Table Shape: {table?.shape}</p>
                    {table?.isVIP && <p className="text-yellow-300">👑 Premium VIP Experience</p>}
                    {table?.isOutdoor && <p className="text-green-300">🌿 Beautiful Outdoor Setting</p>}
                  </div>
                );
              })()}
            </div>
            <div className="text-6xl">🍽️</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          onClick={onBack}
          className="flex items-center text-amber-400 hover:text-amber-300 transition-all transform hover:scale-105 bg-amber-900/20 px-6 py-3 rounded-lg border border-amber-600/30"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Time Selection
        </button>

        <button
          onClick={handleConfirm}
          disabled={!selectedTable}
          className={`font-bold py-4 px-12 rounded-xl transition-all transform ${
            selectedTable
              ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white hover:scale-105 shadow-xl shadow-green-500/30 border-2 border-green-400/50'
              : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border-2 border-gray-600/30'
          }`}
        >
          {selectedTable ? '🎉 Confirm Reservation' : '⏳ Select a Table'}
        </button>
      </div>
    </div>
  );
};

export default TableLayout;