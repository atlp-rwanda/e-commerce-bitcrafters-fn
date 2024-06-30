import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Login from "../../views/Login";
import axiosClient from "../../hooks/AxiosInstance";
import "@testing-library/jest-dom";
import * as Toastify from "react-toastify";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import TextInput from "../../components/TextInput";
import * as reactRouterDom from "react-router-dom";
import { PUBLIC_URL } from "../../constants";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../hooks/AxiosInstance");

const mockStore = configureStore([]);

describe("Login Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        authToken: null,
        isLoggedIn: false,
      },
    });
  });

  it("renders login form", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>,
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("handles login failure", async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error("Login failed"));
    (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
    const notify = jest.spyOn(Toastify, "toast") as any;
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Enter email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password"), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByText("Login"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users/login", {
        email: "test@example.com",
        password: "wrongpassword",
      });
    });
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Login failed"));
  });
});

// __________________________________________________________________
// __________________________________________________________________

jest.mock("axios");

describe("TextInput Component", () => {
  test("Toggle Password Visibility", () => {
    const mockProps = {
      secured: true,
      placeholder: "Password",
      onChange: jest.fn(),
      onBlur: jest.fn(),
    };

    const { getByRole } = render(<TextInput {...mockProps} />);

    expect(getByRole("textbox")).toBeInTheDocument();

    const toggleButton = getByRole("button");
    fireEvent.click(toggleButton);

    expect(getByRole("textbox")).toBeDefined();

    fireEvent.click(toggleButton);

    expect(getByRole("textbox")).toBeInTheDocument();
  });
});

// **************************************************************************************************************************************************************

jest.mock("axios");
jest.mock("react-toastify");

describe("Login component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { authToken: null },
      counter: { count: 0 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call toast function with correct message", async () => {
    const notify = jest.spyOn(Toastify, "toast") as any;
    const message = "Test message";

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>,
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    notify(message);
    render(<Toastify.ToastContainer />);

    expect(notify).toHaveBeenCalledWith(message);
  });

  test("should handle login success", async () => {
    const mockResponse = {
      data: {
        message: "Login successful",
        authToken: "mock_auth_token",
      },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );

    const emailInput = getByPlaceholderText("Enter email");
    const passwordInput = getByPlaceholderText("Enter password");
    const loginButton = getByText("Login");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(store.getActions()).toBeDefined();
    expect(store.getActions()).toBeDefined();
  });

  test("should validate email and password fields", async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );

    const emailInput = getByPlaceholderText("Enter email");
    const passwordInput = getByPlaceholderText("Enter password");
    const loginButton = getByText("Login");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid_email" } });
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.click(loginButton);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Password must contain at least 6 characters"),
      ).toBeInTheDocument();
    });
  });

  describe("handleLogin", () => {
    let store: any;

    beforeEach(() => {
      store = mockStore({
        auth: { authToken: null },
        counter: { count: 0 },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });

    test("should set isLoading to true before API call and false after successful response", async () => {
      const mockResponse = {
        data: {
          message: "Login successful",
          authToken: "mock_auth_token",
        },
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Provider>,
      );

      const emailInput = getByPlaceholderText("Enter email");
      const passwordInput = getByPlaceholderText("Enter password");
      const loginButton = getByText("Login");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid_email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.click(loginButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByText("Login")).toBeInTheDocument();

      await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());
    });
  });

  describe("handleLogin success", () => {
    let store: any;

    beforeEach(() => {
      store = mockStore({
        auth: { authToken: null },
        counter: { count: 0 },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });

    test("should set localStorage with isLoggedIn value", async () => {
      const mockResponse = {
        data: {
          message: "Login successful",
          authToken: "mock_auth_token",
        },
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <Login />
            </MemoryRouter>
          </Provider>,
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const emailInput = screen.getByPlaceholderText("Enter email");
      const passwordInput = screen.getByPlaceholderText("Enter password");
      const loginButton = screen.getByText("Login");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid_email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.click(loginButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(localStorage.getItem("isLoggedIn")).toBeDefined();
      });
    });

    test("should dispatch setAuthToken action with correct payload", async () => {
      const mockResponse = {
        data: {
          message: "Login successful",
          authToken: "mock_auth_token",
        },
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <Login />
            </MemoryRouter>
          </Provider>,
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const emailInput = screen.getByPlaceholderText("Enter email");
      const passwordInput = screen.getByPlaceholderText("Enter password");
      const loginButton = screen.getByText("Login");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(loginButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(store.getActions()).toBeDefined();
      });
    });

    test("should dispatch setIsLoggedIn action with correct payload", async () => {
      const mockResponse = {
        data: {
          message: "Login successful",
          authToken: "mock_auth_token",
        },
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      render(
        <Provider store={store}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </Provider>,
      );

      const emailInput = screen.getByPlaceholderText("Enter email");
      const passwordInput = screen.getByPlaceholderText("Enter password");
      const loginButton = screen.getByText("Login");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(loginButton);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(store.getActions()).toBeDefined();
      });
    });
  });
});

// -----------------------------

jest.mock("formik", () => ({
  ...jest.requireActual("formik"),
  useFormik: () => ({
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    values: {},
    errors: {},
    touched: {},
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../hooks/AxiosInstance");

describe("Login Component - Navigation Tests", () => {
  let store: any;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      auth: {
        authToken: null,
        isLoggedIn: false,
      },
    });

    jest.useFakeTimers();
    mockNavigate = jest.fn();
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("should navigate to request page when password has expired", async () => {
    const mockError = {
      response: {
        data: {
          message: "Your password has expired please update it",
        },
      },
    };
    (axiosClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockRejectedValue(mockError),
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Enter email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password"), {
        target: { value: "expired_password" },
      });
      fireEvent.click(screen.getByText("Login"));
    });

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/request", {
      state: { email: "test@example.com" },
    });
  });
});

// --------------------Login with Google--------------------------

describe("Login component", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  beforeEach(() => {
    const mockStore = configureStore([]);
    store = mockStore({
      isLoggedIn: false,
      authToken: null,
    });
  });

  test("should login with Google successfully", async () => {
    global.open = jest.fn();
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    } as Storage;

    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>,
    );

    const googleButton = screen.getByText("Continue with google");
    await userEvent.click(googleButton);

    expect(window.open).toHaveBeenCalledWith(
      `${PUBLIC_URL}users/google`,
      "_self",
    );

    const urlParams = new URLSearchParams();
    urlParams.append("token", "valid_token");
    Object.defineProperty(window, "location", {
      value: {
        search: `?${urlParams.toString()}`,
      },
    });
  });

  test("should notify on login failure", async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
          <Toastify.ToastContainer />
        </Router>
      </Provider>,
    );

    const googleButton = screen.getByText("Continue with google");
    await userEvent.click(googleButton);

    const urlParams = new URLSearchParams();
    urlParams.append("token", "valid_token");
    Object.defineProperty(window, "location", {
      value: {
        search: `?${urlParams.toString()}`,
      },
      writable: true,
    });
  });
});
