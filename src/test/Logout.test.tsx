import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { toast } from "react-toastify";
import Logout from "../components/Logout";
import useAxiosClient from "../hooks/AxiosInstance";
import { setIsLoggedIn, setAuthToken, setAuthRole } from "../redux/authSlice";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("../hooks/AxiosInstance");
jest.mock("react-icons/ri", () => ({
  RiLogoutCircleLine: () => <div>Logout Icon</div>,
}));

describe("Logout Component", () => {
  const mockedAxiosClient = {
    post: jest.fn(),
  };
  const mockedUseNavigate = jest.fn();
  const mockStore = configureStore([]);
  let store: any;

  beforeEach(() => {
    (useAxiosClient as jest.Mock).mockReturnValue(mockedAxiosClient);
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => mockedUseNavigate);
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "test-token",
        authRole: "user",
      },
    });
    store.dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handles successful logout", async () => {
    mockedAxiosClient.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Provider store={store}>
        <Router>
          <Logout />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockedAxiosClient.post).toHaveBeenCalledWith("/users/logout");
      expect(store.dispatch).toHaveBeenCalledWith(setIsLoggedIn(false));
      expect(store.dispatch).toHaveBeenCalledWith(setAuthToken(null));
      expect(store.dispatch).toHaveBeenCalledWith(setAuthRole(null));
      expect(mockedUseNavigate).toHaveBeenCalledWith("/login");
      expect(toast.success).toHaveBeenCalledWith("Logout successful");
    });
  });

  it("handles logout failure with non-200 status", async () => {
    mockedAxiosClient.post.mockResolvedValueOnce({ status: 400 });

    render(
      <Provider store={store}>
        <Router>
          <Logout />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockedAxiosClient.post).toHaveBeenCalledWith("/users/logout");
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Logout failed");
    });
  });

  it("handles logout error", async () => {
    mockedAxiosClient.post.mockRejectedValueOnce(new Error("Network error"));

    render(
      <Provider store={store}>
        <Router>
          <Logout />
        </Router>
      </Provider>,
    );

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(mockedAxiosClient.post).toHaveBeenCalledWith("/users/logout");
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Something went wrong!");
    });
  });
});
