"use client";
import { useEffect, useState } from "react";
import { fetchMenu } from "../services/menuService";
import { useDispatch } from "react-redux";
import { addItem } from "../../../store/cartSlice";

function buildImageSrc(imageType, imageData) {
  if (!imageData || !imageType || !imageType.startsWith("image/")) return null;
  return `data:${imageType};base64,${imageData}`;
}

export default function Menu() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchMenu(0, 10)
      .then(setMenu)
      .catch(() => setError("Failed to load menu"));
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
      setError(null);
    } catch (e) {
      setError("Failed to load next page");
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
      setError(null);
    } catch (e) {
      setError("Failed to load previous page");
    } finally {
      setIsLoadingPrev(false);
    }
  }

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
      {(() => {
        // helper values for pager
        const listLen = menu?.data?.list?.length ?? 0;
        const hasNext = listLen >= 10;
        return null;
      })()}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mr-3">🍽️</span>
        Our Menu
      </h2>
      <div className="grid gap-4">
        {menu?.data?.list?.map((item, idx) => {
          const imageSrc = buildImageSrc(item?.imageType, item?.imageData);
          return (
            <div key={idx} className="bg-black border border-gray-600 p-4 rounded-lg hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
              <div className="flex gap-4">
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-800 border border-gray-700">
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
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => dispatch(addItem({ ...item, imageSrc }))}
                      className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm border border-purple-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pager */}
      <div className="mt-6 flex justify-between items-center">
        {/* Prev */}
        <button
          type="button"
          onClick={loadPrevPage}
          disabled={isLoadingPrev || page <= 0}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors duration-150
            ${isLoadingPrev || page <= 0
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-black border-gray-600 text-white hover:border-gray-500"}`}
          aria-label="Previous page"
          title={isLoadingPrev ? "Loading..." : "Go to previous 10 items"}
        >
          <span aria-hidden>⬅️</span>
          <span className="select-none">Prev</span>
        </button>

        {/* Page indicator */}
        <div className="text-gray-400 text-sm select-none">
          Page {page + 1}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={loadNextPage}
          disabled={isLoadingNext || (menu?.data?.list?.length ?? 0) < 10}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors duration-150
            ${isLoadingNext || (menu?.data?.list?.length ?? 0) < 10
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-black border-gray-600 text-white hover:border-gray-500"}`}
          aria-label="Next page"
          title={isLoadingNext ? "Loading..." : "View next 10 items"}
        >
          <span className="select-none">Next</span>
          <span aria-hidden>➡️</span>
        </button>
      </div>
    </div>
  );
}
