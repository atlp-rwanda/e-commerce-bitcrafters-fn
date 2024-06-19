import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './counter';
import authSlice from "./authSlice";
import userReducer from "./userSlice";

// Create and configure the store
const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authSlice,
    user: userReducer,
  },
});

// Define the types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
