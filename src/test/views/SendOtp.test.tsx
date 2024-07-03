import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Login from "../../views/Login";
import axiosClient from "../../hooks/AxiosInstance";
import "@testing-library/jest-dom";
import * as Toastify from "react-toastify";

jest.mock("react-toastify");
jest.mock("../../hooks/AxiosInstance");

const mockStore = configureStore([]);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  let store: any;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      auth: {
        authToken: null,
        isLoggedIn: false,
      },
    });
    mockNavigate = jest.fn();
    (require("react-router-dom").useNavigate as jest.Mock).mockReturnValue(
      mockNavigate,
    );

    (axiosClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        status: 200,
        data: {
          message: "OTP sent to your email",
        },
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handle OTP message in login response", async () => {
    const notify = jest.spyOn(Toastify, "toast");

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
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Login"));
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter email")).toHaveValue(
        "test@example.com",
      );
      expect(screen.getByPlaceholderText("Enter password")).toHaveValue(
        "password123",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/verify-otp", {
        state: { email: "test@example.com" },
      });
      expect(notify).toHaveBeenCalledWith("OTP sent to your email");
    });
  });
});
