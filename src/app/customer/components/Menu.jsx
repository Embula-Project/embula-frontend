"use client";
import { useEffect, useState } from "react";
import { fetchMenu } from "../services/menuService";

export default function Menu() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu(0, 10)
      .then(setMenu)
      .catch(() => setError("Failed to load menu"));
  }, []);

  if (error) return (
    <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
      <div className="flex items-center">
        <span className="text-red-400 mr-2">⚠</span>
        {error}
      </div>
    </div>
  );
  
  if (!menu) return (
    <div className="bg-gray-900 p-8 rounded-lg text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      <div className="text-gray-300">Loading menu...</div>
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mr-3">🍽️</span>
        Our Menu
      </h2>
      <div className="grid gap-4">
        {menu?.data?.list?.map((item, idx) => (
          <div key={idx} className="bg-black border border-gray-600 p-4 rounded-lg hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">{item.itemName}</h3>
              <span className="text-green-400 font-bold text-lg">{item.price} LKR</span>
            </div>
            <div className="text-gray-300 text-sm mb-2">
              <span className="inline-block bg-gray-800 px-2 py-1 rounded mr-2">
                {item.portionSize}
              </span>
              <span className="inline-block bg-gray-800 px-2 py-1 rounded">
                {item.type}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{item.description}</p>
            <div className="text-gray-500 text-xs">
              <span className="font-medium">Ingredients:</span> {item.ingredients}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
