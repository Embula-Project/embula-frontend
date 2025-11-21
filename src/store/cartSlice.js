import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, name, price, imageSrc, qty }
};

function getId(item) {
  return item?.itemId ?? item?.id ?? item?.foodItemId ?? item?.itemName ?? item?.imageName ?? Math.random().toString(36).slice(2);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const raw = action.payload;
      const id = getId(raw);
      const existing = state.items.find((it) => it.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({
          id,
          name: raw.itemName ?? raw.name ?? "Item",
          price: raw.price ?? 0,
          imageSrc: raw.imageSrc ?? null,
          qty: 1,
        });
      }
    },
    incrementItem: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((it) => it.id === id);
      if (existing) existing.qty += 1;
    },
    decrementItem: (state, action) => {
      const id = action.payload;
      const existing = state.items.find((it) => it.id === id);
      if (existing) {
        existing.qty -= 1;
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
