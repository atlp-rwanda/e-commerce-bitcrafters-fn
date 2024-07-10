import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import TwoFactorAuth from "../../views/TwoFactorAuth";
import axiosClient from "../../hooks/AxiosInstance";
import { jwtDecode } from "jwt-decode";

jest.mock("../../hooks/AxiosInstance");

const mockStore = configureStore([]);

describe("TwoFactorAuth view", () => {
  let store: any;
  const mockPost = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false, authToken: null },
    });

    mockPost.mockReset();
    (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
  });

  test("should render the component correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("VERIFY OTP")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the OTP code sent to your email"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  test("should update OTP input values correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("4");
  });
  test("should handle backspace key to focus previous input", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "0" } });
    fireEvent.keyDown(inputs[1], { key: "Backspace", code: "Backspace" });

    expect(inputs[0]).toHaveFocus();
  });

  test("should verify OTP and handle success", async () => {
    mockPost.mockResolvedValueOnce({
      status: 200,
      data: { jwt: "test-jwt" },
    });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
  });

  test("should handle OTP verification failure", async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: "Invalid OTP" } },
    });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
  });
  test("should allow only numeric values and empty string in OTP input", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );

    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "a" } });
    fireEvent.change(inputs[2], { target: { value: " " } });
    fireEvent.change(inputs[3], { target: { value: "3" } });

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("");
    expect(inputs[2]).toHaveValue("");
    expect(inputs[3]).toHaveValue("3");
  });
});

jest.mock("jwt-decode");

describe("TwoFactorAuth view", () => {
  let store: any;
  const mockPost = jest.fn();
  const mockJwtDecode = jwtDecode as jest.Mock;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false, authToken: null },
    });

    mockPost.mockReset();
    (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
    mockJwtDecode.mockReturnValue({ id: "user-id" });
  });

  test("should verify OTP and handle success", async () => {
    const mockToken = "test-jwt";

    mockPost.mockResolvedValueOnce({
      status: 200,
      data: { jwt: mockToken },
    });

    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ state: { email: "test@example.com" } }]}
        >
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    const expectedActions = [
      { type: "auth/setAuthToken", payload: mockToken },
      { type: "auth/setAuthRole", payload: "seller" },
      { type: "auth/setIsLoggedIn", payload: true },
      { type: "auth/setAuthUserId", payload: "user-id" },
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  test("should use email from URL parameters if present", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/verify?email=test@example.com"]}>
          <TwoFactorAuth />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText("VERIFY OTP")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the OTP code sent to your email"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });
});
