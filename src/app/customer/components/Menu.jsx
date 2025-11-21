"use client";
import { useEffect, useState } from "react";
import { fetchMenu } from "../services/menuService";
import { useDispatch } from "react-redux";
import { addItem } from "../../../store/cartSlice";
import ErrorDialog from "./ErrorDialog";
import { useErrorDialog } from "../hooks/useErrorDialog";

function buildImageSrc(imageType, imageData) {
  if (!imageData || !imageType || !imageType.startsWith("image/")) return null;
  return `data:${imageType};base64,${imageData}`;
}

export default function Menu() {
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
    // If we don't have a current list or fewer than 10 items, assume there is no next page
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
    <div className="bg-black/50 backdrop-blur-lg border border-amber-900/30 p-8 rounded-xl text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
      <div className="text-gray-300 text-lg">Loading our delicious menu...</div>
    </div>
  );

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title="Menu Error"
      />
      
      <div className="bg-black/50 backdrop-blur-lg border border-amber-900/30 p-6 md:p-8 rounded-xl shadow-2xl">
      <div className="grid gap-6">
        {menu?.data?.list?.map((item, idx) => {
          const imageSrc = buildImageSrc(item?.imageType, item?.imageData);
          return (
            <div key={idx} className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 p-4 md:p-6 rounded-xl hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 transform hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-32 md:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800 border border-amber-900/30">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item?.imageName || item?.itemName || "Food item image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <h3 className="text-xl font-bold text-white mb-2 md:mb-0">{item.itemName}</h3>
                    <span className="text-amber-400 font-bold text-xl">{item.price} LKR</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center bg-amber-900/30 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                      {item.portionSize}
                    </span>
                    <span className="inline-flex items-center bg-amber-900/30 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{item.description}</p>
                  <div className="text-gray-400 text-xs mb-4">
                    <span className="font-semibold text-amber-400">Ingredients:</span> {item.ingredients}
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(addItem({ ...item, imageSrc }))}
                    className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pager */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-amber-900/30">
        {/* Prev */}
        <button
          type="button"
          onClick={loadPrevPage}
          disabled={isLoadingPrev || page <= 0}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-semibold
            ${isLoadingPrev || page <= 0
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              : "bg-black border-amber-500/50 text-amber-400 hover:border-amber-500 hover:bg-amber-900/20 hover:scale-105 shadow-lg"}`}
          aria-label="Previous page"
          title={isLoadingPrev ? "Loading..." : "Go to previous 10 items"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="select-none">Previous</span>
        </button>

        {/* Page indicator */}
        <div className="bg-amber-900/30 border border-amber-500/30 text-amber-300 px-6 py-2 rounded-full text-sm font-semibold select-none">
          Page {page + 1}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={loadNextPage}
          disabled={isLoadingNext || (menu?.data?.list?.length ?? 0) < 10}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 font-semibold
            ${isLoadingNext || (menu?.data?.list?.length ?? 0) < 10
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              : "bg-black border-amber-500/50 text-amber-400 hover:border-amber-500 hover:bg-amber-900/20 hover:scale-105 shadow-lg"}`}
          aria-label="Next page"
          title={isLoadingNext ? "Loading..." : "View next 10 items"}
        >
          <span className="select-none">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    </>
  );
}
