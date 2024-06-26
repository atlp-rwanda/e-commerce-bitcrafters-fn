import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import SignupForm from "../views/signup";
import * as userSlice from "../redux/userSlice";
import "@testing-library/jest-dom";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

jest.mock("react-icons/fc", () => ({
  FcGoogle: () => <div>Google Icon</div>,
}));

jest.mock("react-icons/io5", () => ({
  IoEyeOutline: () => <div>Eye Open Icon</div>,
  IoEyeOffOutline: () => <div>Eye Closed Icon</div>,
}));
jest.mock("../redux/userSlice", () => ({
  ...jest.requireActual("../redux/userSlice"),
  signupUser: jest.fn(),
}));

describe("SignupForm", () => {
  let store: EnhancedStore;
  let mockDispatch: jest.Mock;
  let userReducer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    userReducer = jest.fn((state = {}) => state);
    mockDispatch = jest.fn();
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    store.dispatch = mockDispatch;
  });
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      </Provider>
    );

  it("renders the form correctly", () => {
    renderComponent();
    expect(screen.getByText("CREATE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123@ex.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByText("Signup with Google")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: "Show password" });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAccessibleName("Hide password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAccessibleName("Show password");
  });

  it("submits the form with valid data", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
    };
  
    const mockSignupUser = userSlice.signupUser as jest.MockedFunction<typeof userSlice.signupUser>;
    mockSignupUser.mockReturnValue({
      type: "user/signupUser/fulfilled",
      payload: mockUser,
    } as any);
  
    mockDispatch.mockResolvedValue({
      type: "user/signupUser/fulfilled",
      payload: mockUser,
    });
  
    renderComponent();
  
    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("123@ex.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "12345678" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
  
    await waitFor(() => {
      expect(mockSignupUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "12345678",
      });
    });
  
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
  
    // Manually trigger the success callback
    await waitFor(() => mockDispatch.mock.results[0].value);
  
    // await waitFor(() => {
    //   expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
    //     "Account created successfully! Check your email to verify."
    //   );
    // });
  });
  
  it("disables submit button while submitting", async () => {
    const mockDispatch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ type: "user/signupUser/fulfilled" }), 100)
        )
    );
    store.dispatch = mockDispatch as any;

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("123@ex.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "12345678" },
    });

    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Signing Up...");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Sign Up");
    });
  });
});
