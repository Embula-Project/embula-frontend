"use client";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount, selectCartItems, incrementItem, decrementItem, removeItem } from "../../../store/cartSlice";

export default function Header() {
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount);
  const items = useSelector(selectCartItems);
  const [open, setOpen] = useState(false);

  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0), [items]);

  return (
    <header className="bg-black border-b border-gray-800 p-4 md:p-6 flex justify-between items-center shadow-lg sticky top-0 z-40">
      <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">Embula Portal</h1>
      <div className="flex items-center gap-3">
        {/* Cart button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-600"
          aria-label="Open cart"
        >
          <span aria-hidden>🛒</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border border-black">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Cart popup */}
      {open && (
        <div className="absolute right-4 top-full mt-2 w-[28rem] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-white font-semibold">Your Cart</h2>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">✖</button>
          </div>
          {items.length === 0 ? (
            <div className="text-gray-400 text-sm">Your cart is empty.</div>
          ) : (
            <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 bg-black border border-gray-700 p-3 rounded-md">
                  <div className="w-14 h-14 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                    {it.imageSrc ? (
                      <img src={it.imageSrc} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="text-white text-sm font-medium truncate">{it.name}</div>
                      <div className="text-green-400 font-semibold text-sm whitespace-nowrap">{(it.price ?? 0) * (it.qty ?? 1)} LKR</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700"
                        onClick={() => dispatch(decrementItem(it.id))}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <div className="px-2 text-gray-200 text-sm">{it.qty}</div>
                      <button
                        className="w-7 h-7 flex items-center justify-center bg-gray-800 border border-gray-700 rounded text-white hover:bg-gray-700"
                        onClick={() => dispatch(incrementItem(it.id))}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        className="ml-auto bg-transparent text-gray-400 hover:text-red-400 text-xs"
                        onClick={() => dispatch(removeItem(it.id))}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                      <button className="ml-2 bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs border border-purple-500">Checkout</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-3">
            <div className="text-gray-300 text-sm">Total</div>
            <div className="text-green-400 font-bold">{total} LKR</div>
          </div>
        </div>
      )}
    </header>
  );
}
