import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Login from "../../views/Login";
import axiosClient from "../../hooks/AxiosInstance";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

jest.mock("jwt-decode");
jest.mock("../../hooks/AxiosInstance");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.useFakeTimers();

const mockStore = configureStore([]);

describe("Login view", () => {
  let store: any;
  const mockPost = jest.fn();
  const mockJwtDecode = jwtDecode as jest.Mock;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false, authToken: null },
    });
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockPost.mockReset();
    (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });

    mockJwtDecode.mockReturnValue({ id: "user-id", userRole: "user" });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should handle login and dispatch appropriate actions", async () => {
    const mockToken = "test-jwt";
    const mockResponse = {
      status: 200,
      data: { authToken: mockToken, message: "Login successful" },
    };

    mockPost.mockResolvedValueOnce(mockResponse);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        <ToastContainer />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    const expectedActions = [
      { type: "auth/setAuthToken", payload: mockToken },
      { type: "auth/setAuthRole", payload: "user" },
      { type: "auth/setIsLoggedIn", payload: true },
      { type: "auth/setAuthUserId", payload: "user-id" },
    ];

    expect(store.getActions()).toEqual(expectedActions);
    jest.advanceTimersByTime(2500);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("should handle login and navigate to admin if userRole is admin", async () => {
    const mockToken = "test-jwt";
    const mockResponse = {
      status: 200,
      data: { authToken: mockToken, message: "Login successful" },
    };

    mockPost.mockResolvedValueOnce(mockResponse);
    mockJwtDecode.mockReturnValueOnce({ id: "admin-id", userRole: "admin" });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
        <ToastContainer />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "adminpassword" },
    });
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    const expectedActions = [
      { type: "auth/setAuthToken", payload: mockToken },
      { type: "auth/setAuthRole", payload: "admin" },
      { type: "auth/setIsLoggedIn", payload: true },
      { type: "auth/setAuthUserId", payload: "admin-id" },
    ];

    expect(store.getActions()).toEqual(expectedActions);
    jest.advanceTimersByTime(2500);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });
});
