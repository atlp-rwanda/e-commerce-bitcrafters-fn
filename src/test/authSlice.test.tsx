import authReducer, {
  setIsLoggedIn,
  setAuthToken,
  setUsername,
  setAuthRole,
  clearAuthData,
  AuthState,
  setAuthUserId,
} from "../redux/authSlice";

describe("authSlice", () => {
  const initialState: AuthState = {
    isLoggedIn: false,
    authToken: null,
    username: null,
    authRole: null,
    authUserId: null,
  };

  it("should handle setIsLoggedIn", () => {
    const actual = authReducer(initialState, setIsLoggedIn(true));
    expect(actual.isLoggedIn).toEqual(true);
  });

  it("should handle setAuthToken", () => {
    const token = "test-token";
    const actual = authReducer(initialState, setAuthToken(token));
    expect(actual.authToken).toEqual(token);
  });

  it("should handle setUsername", () => {
    const username = "testuser";
    const actual = authReducer(initialState, setUsername(username));
    expect(actual.username).toEqual(username);
  });

  it("should handle setAuthRole", () => {
    const role = "admin";
    const actual = authReducer(initialState, setAuthRole(role));
    expect(actual.authRole).toEqual(role);
  });
  it("should handle setAuthUserId", () => {
    const id = "5";
    const actual = authReducer(initialState, setAuthUserId(id));
    expect(actual.authUserId).toEqual(id);
  });
  it("should handle clearAuthData", () => {
    const loggedInState: AuthState = {
      isLoggedIn: true,
      authToken: "token",
      username: "user",
      authRole: "admin",
      authUserId: "user",
    };
    const actual = authReducer(loggedInState, clearAuthData());
    expect(actual).toEqual(initialState);
  });
});
