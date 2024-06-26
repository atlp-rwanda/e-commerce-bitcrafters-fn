import { configureStore } from "@reduxjs/toolkit";
import userReducer, {
  setUser,
  clearUser,
  signupUser,
  User,
  UserState,
} from "../redux/userSlice";
import { signup } from "../api/auth";

jest.mock("../api/auth");

const createMockStore = (initialState: UserState) => {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: initialState },
  });
};

describe("userSlice", () => {
  const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
  };

  describe("reducer", () => {
    it("should handle initial state", () => {
      expect(userReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle setUser", () => {
      const user: User = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
      };
      expect(userReducer(initialState, setUser(user))).toEqual({
        ...initialState,
        user,
      });
    });

    it("should handle clearUser", () => {
      const state: UserState = {
        ...initialState,
        user: { id: "1", username: "testuser", email: "test@example.com" },
      };
      expect(userReducer(state, clearUser())).toEqual(initialState);
    });
  });

  describe("signupUser", () => {
    it("should create a user when signup is successful", async () => {
      const user: User = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
      };
      const mockedSignup = signup as jest.MockedFunction<typeof signup>;
      mockedSignup.mockResolvedValue({ message: "Signup successful", user });

      const store = createMockStore(initialState);
      await store.dispatch(
        signupUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        }),
      );

      const state = store.getState().user;
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.error).toBeNull();
    });

    it("should handle signup failure", async () => {
      const error = { message: "Signup failed" };
      const mockedSignup = signup as jest.MockedFunction<typeof signup>;
      mockedSignup.mockRejectedValue({ response: { data: error } });

      const store = createMockStore(initialState);
      await store.dispatch(
        signupUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        }),
      );

      const state = store.getState().user;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe("Signup failed");
    });
    it("should handle signup failure with unknown error", async () => {
      const mockedSignup = signup as jest.MockedFunction<typeof signup>;
      mockedSignup.mockRejectedValue(new Error("Network error"));

      const store = createMockStore(initialState);
      await store.dispatch(
        signupUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        }),
      );

      const state = store.getState().user;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe("An unknown error occurred");
    });
  });

  describe("extraReducers", () => {
    it("should handle signupUser.pending", () => {
      const action = { type: signupUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("should handle signupUser.fulfilled", () => {
      const user: User = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
      };
      const action = { type: signupUser.fulfilled.type, payload: user };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(user);
      expect(state.error).toBeNull();
    });

    it("should handle signupUser.rejected with payload", () => {
      const error = { message: "Invalid email" };
      const action = { type: signupUser.rejected.type, payload: error };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe("Invalid email");
    });

    it("should handle signupUser.rejected without payload", () => {
      const action = { type: signupUser.rejected.type, payload: undefined };
      const state = userReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe("Signup failed");
    });
  });

  describe("auth API", () => {
    it("should call signup with correct parameters", async () => {
      const mockedSignup = signup as jest.MockedFunction<typeof signup>;
      const mockResponse = {
        message: "Signup successful",
        user: { id: "1", username: "testuser", email: "test@example.com" },
      };
      mockedSignup.mockResolvedValue(mockResponse);

      await signup("testuser", "test@example.com", "password123");

      expect(mockedSignup).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        "password123",
      );
    });
  });
});
