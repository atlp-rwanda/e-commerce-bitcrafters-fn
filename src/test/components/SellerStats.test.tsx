import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import SellerDashboard from "../../components/SellerStats";
import useAxiosClient from "../../hooks/AxiosInstance";

jest.mock("../../hooks/AxiosInstance", () => jest.fn());
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe("SellerDashboard", () => {
  let store: any;
  const mockNavigate = jest.fn();
  const mockAxiosGet = jest.fn();

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "mock-token",
      },
    });

    (useAxiosClient as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SellerDashboard />
        </BrowserRouter>
      </Provider>,
    );
  };

  test("renders loading state initially", () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {})); // Never resolves
    renderComponent();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("fetches and displays seller stats", async () => {
    const mockStats = {
      message: "Success",
      totalAmount: 1000,
      totalSoldItems: 50,
      orders: [
        { name: "Product 1", amount: 500, quantity: 25 },
        { name: "Product 2", amount: 500, quantity: 25 },
      ],
    };

    mockAxiosGet.mockResolvedValue({ data: mockStats });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("RWF1000.00")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("Sales Chart")).toBeInTheDocument();
    });
  });

  test("handles API error", async () => {
    mockAxiosGet.mockRejectedValue(new Error("API Error"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch seller stats"),
      ).toBeInTheDocument();
    });
  });

  test("redirects to login page if user is not logged in", () => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
        authToken: null,
      },
    });

    renderComponent();

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
