import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  authToken: string | null;
  username: string | null;
  authRole: string | null;
  authUserId: string | null;
}

const initial: AuthState = {
  isLoggedIn: false,
  authToken: null,
  username: null,
  authRole: null,
  authUserId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
    setAuthRole: (state, action: PayloadAction<string | null>) => {
      state.authRole = action.payload;
    },
    setAuthUserId: (state, action: PayloadAction<string | null>) => {
      state.authUserId = action.payload;
    },
    clearAuthData: (state) => {
      state.isLoggedIn = false;
      state.authToken = null;
      state.username = null;
      state.authRole = null;
      state.authUserId = null;
    },
  },
});

export const {
  setIsLoggedIn,
  setAuthToken,
  setUsername,
  setAuthRole,
  clearAuthData,
  setAuthUserId,
} = authSlice.actions;

export default authSlice.reducer;
