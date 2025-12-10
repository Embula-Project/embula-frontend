import { createSlice } from "@reduxjs/toolkit";

// Initialize cart from localStorage when available (client-side only)
let persistedCartItems = [];
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("cartItems");
    if (raw) persistedCartItems = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse persisted cart items", e);
  }
}

const initialState = {
  items: persistedCartItems || [], // { id, name, price, imageSrc, qty }
};

function getId(item) {
  // Prioritize itemId from backend, then other possible ID fields
  return item?.itemId ?? item?.foodItemId ?? item?.id ?? item?.itemName ?? item?.imageName ?? Math.random().toString(36).slice(2);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const raw = action.payload;
      console.log('[CartSlice] Adding item to cart:', raw);
      
      const id = getId(raw);
      const existing = state.items.find((it) => it.id === id);
      if (existing) {
        existing.qty = (existing.qty || 0) + 1;
        console.log('[CartSlice] Incremented existing item qty:', existing);
      } else {
        // Extract numeric foodItemId - try multiple possible fields
        let foodItemId = null;
        if (typeof raw.itemId === 'number') {
          foodItemId = raw.itemId;
        } else if (typeof raw.foodItemId === 'number') {
          foodItemId = raw.foodItemId;
        } else if (typeof raw.id === 'number') {
          foodItemId = raw.id;
        }
        
        const newItem = {
          id,
          foodItemId: foodItemId,
          name: raw.itemName ?? raw.name ?? "Item",
          price: Number(raw.price) || 0,
          imageType: raw.imageType || null,
          imageData: raw.imageData || null,
          qty: 1,
        };
        
        console.log('[CartSlice] Created new cart item:', newItem);
        state.items.push(newItem);
      }
    },
    incrementItem: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((it) => it.id === id);
      if (existing) existing.qty = (existing.qty || 0) + 1;
    },
    decrementItem: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((it) => it.id === id);
      if (existing) {
        existing.qty = (existing.qty || 0) - 1;
        if (existing.qty <= 0) {
          state.items = state.items.filter((it) => it.id !== id);
        }
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, incrementItem, decrementItem, removeItem, clearCart } = cartSlice.actions;

export const selectCartCount = (state) => state.cart.items.reduce((sum, it) => sum + (it.qty ?? 1), 0);
export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer;
