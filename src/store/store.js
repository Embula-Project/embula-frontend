import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Persist cart to localStorage on changes (client-side only)
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem("cartItems", JSON.stringify(state.cart.items));
    } catch (e) {
      console.error("Failed to persist cart items", e);
    }
  });
}
