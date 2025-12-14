"use client";
import { useEffect, useState } from "react";
import { fetchMenu } from "../services/MenuService";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import ErrorDialog from "./ErrorDialog";
import { useErrorDialog } from "../hooks/UseErrorDialog";

function buildImageSrc(imageType, imageData) {
  if (!imageData || !imageType || !imageType.startsWith("image/")) return null;
  return `data:${imageType};base64,${imageData}`;
}

export default function CustomerMenu() {
  const [menu, setMenu] = useState(null);
  const { error, showError, clearError } = useErrorDialog();
  const [page, setPage] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMenu(0, 10)
      .then(setMenu)
      .catch(() => showError("Failed to load menu. Please try again later."));
  }, []);

  async function loadNextPage() {
    const currentList = menu?.data?.list ?? [];
    if (isLoadingNext || currentList.length < 10) return;
    try {
      setIsLoadingNext(true);
      const next = page + 1;
      const res = await fetchMenu(next, 10);
      setMenu(res);
      setPage(next);
    } catch (e) {
      showError("Failed to load next page. Please try again.");
    } finally {
      setIsLoadingNext(false);
    }
  }

  async function loadPrevPage() {
    if (isLoadingPrev || page <= 0) return;
    try {
      setIsLoadingPrev(true);
      const prev = page - 1;
      const res = await fetchMenu(prev, 10);
      setMenu(res);
      setPage(prev);
    } catch (e) {
      showError("Failed to load previous page. Please try again.");
    } finally {
      setIsLoadingPrev(false);
    }
  }

  if (!menu) return (
    <div className="min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black/50 backdrop-blur-lg border border-amber-900/30 p-8 rounded-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <div className="text-gray-300 text-lg">Loading our delicious menu...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title="Menu Error"
      />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-900/30 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-amber-400 text-2xl">🍽️</span>
            <span className="text-amber-300 text-sm font-medium">Curated with Excellence</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-2">
              Exquisite Menu
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Discover our carefully curated selection of dishes, crafted with passion and the finest ingredients
          </p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu?.data?.list?.map((item, idx) => {
            const imageSrc = buildImageSrc(item?.imageType, item?.imageData);
            return (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:scale-105 group"
              >
                {/* Image */}
                <div className="relative w-full h-56 bg-gray-800 overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item?.imageName || item?.itemName || "Food item"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    {item.price} LKR
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">
                    {item.itemName}
                  </h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center bg-amber-900/30 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                      {item.portionSize}
                    </span>
                    <span className="inline-flex items-center bg-amber-900/30 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="text-gray-400 text-xs mb-4 line-clamp-1">
                    <span className="font-semibold text-amber-400">Ingredients:</span> {item.ingredients}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => dispatch(addItem(item))}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-amber-900/30">
          <button
            type="button"
            onClick={loadPrevPage}
            disabled={isLoadingPrev || page <= 0}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-semibold ${
              isLoadingPrev || page <= 0
                ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-black border-amber-500/50 text-amber-400 hover:border-amber-500 hover:bg-amber-900/20 hover:scale-105 shadow-lg"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="bg-amber-900/30 border border-amber-500/30 text-amber-300 px-6 py-2 rounded-full text-sm font-semibold">
            Page {page + 1}
          </div>

          <button
            type="button"
            onClick={loadNextPage}
            disabled={isLoadingNext || (menu?.data?.list?.length ?? 0) < 10}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-semibold ${
              isLoadingNext || (menu?.data?.list?.length ?? 0) < 10
                ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-black border-amber-500/50 text-amber-400 hover:border-amber-500 hover:bg-amber-900/20 hover:scale-105 shadow-lg"
            }`}
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
