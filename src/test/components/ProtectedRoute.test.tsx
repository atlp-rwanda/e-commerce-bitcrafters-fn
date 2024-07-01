import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: jest.fn(({ to }) => <div>{`Redirected to ${to}`}</div>),
  Outlet: jest.fn(() => <div>Protected Content</div>),
}));

jest.mock("jwt-decode");

const mockStore = configureMockStore();

const renderWithProviders = (store: any, ui: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
};

describe("ProtectedRoute", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
        authToken: null,
        authRole: null,
      },
    });
    jest.clearAllMocks();
  });

  test("should redirect to login if user is not logged in", () => {
    renderWithProviders(store, <ProtectedRoute requiredRole="admin" />);
    expect(screen.getByText("Redirected to /login")).toBeInTheDocument();
  });

  test("should redirect to login if token is invalid", () => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "invalid-token",
        authRole: null,
      },
    });

    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    renderWithProviders(store, <ProtectedRoute requiredRole="admin" />);
    expect(screen.getByText("Redirected to /login")).toBeInTheDocument();
  });

  test("should redirect to home if user role does not match required role", () => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "valid-token",
        authRole: "user",
      },
    });

    (jwtDecode as jest.Mock).mockReturnValue({ userRole: "user" });

    renderWithProviders(store, <ProtectedRoute requiredRole="admin" />);
    expect(screen.getByText("Redirected to /")).toBeInTheDocument();
  });

  test("should render the outlet if logged in and role matches", () => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "valid-token",
        authRole: "admin",
      },
    });

    (jwtDecode as jest.Mock).mockReturnValue({ userRole: "admin" });

    renderWithProviders(store, <ProtectedRoute requiredRole="admin" />);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
  test("should navigate to home if user is logged in but role does not match required role", () => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
        authToken: "valid-token",
        authRole: "user",
      },
    });

    (jwtDecode as jest.Mock).mockReturnValue({ userRole: "admin" });

    renderWithProviders(store, <ProtectedRoute requiredRole="admin" />);
    expect(screen.getByText("Redirected to /")).toBeInTheDocument();
  });
});
