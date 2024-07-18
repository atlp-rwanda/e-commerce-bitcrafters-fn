import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signup } from "../api/auth";

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface SignupError {
  message: string;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk<
  User,
  { username: string; email: string; password: string },
  { rejectValue: SignupError }
>("user/signup", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const response = await signup(username, email.toLowerCase(), password);
    return response.user as User;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data as SignupError);
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(
        signupUser.rejected,
        (state, action: PayloadAction<SignupError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message ?? "Signup failed";
        },
      );
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
