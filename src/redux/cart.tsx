import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  count: number;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    count: 0,
    cartItems:[],
    totalPrice:0,
    totalProducts:0,
    cartId:null
  },
  reducers: {
    incrementCart: (state) => {
      state.count += 1;
    },
    decrementCart: (state) => {
      state.count -= 1;
    },
    setCart: (state, action: PayloadAction<number>) => {
        state.count = action.payload;
      },
    clearCart: (state) => {
      state.count = 0;
    },

  },
});

export const { incrementCart, decrementCart, clearCart, setCart} = cartSlice.actions;
export type RootState = ReturnType<typeof cartSlice.reducer>;
export default cartSlice.reducer;
