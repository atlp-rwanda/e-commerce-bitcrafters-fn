import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ConfirmationPage from "../../components/Confirmation";
import useAxiosClient from "../../hooks/AxiosInstance";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../../hooks/AxiosInstance", () => jest.fn());

const mockStore = configureStore([]);

describe("ConfirmationPage", () => {
  let store: any;
  const mockNavigate = jest.fn();
  const mockAxiosGet = jest.fn();
  const mockConfirmation = {
    orderNumber: "12345",
    totalCost: 100,
    expectedDeliveryDate: "2024-07-20",
  };

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "mock-token",
        userId: "user123",
      },
    });

    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockImplementation(() => mockNavigate);
    jest
      .spyOn(require("react-router-dom"), "useParams")
      .mockReturnValue({ orderId: "12345" });
    jest
      .spyOn(require("react-router-dom"), "useLocation")
      .mockReturnValue({ search: "?orderId=12345" });

    (useAxiosClient as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    mockAxiosGet.mockResolvedValue({
      data: { confirmation: mockConfirmation },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ConfirmationPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  test("renders loading state initially", () => {
    renderComponent();
    expect(
      screen.getByText("Loading confirmation details..."),
    ).toBeInTheDocument();
  });

  test("fetches and displays confirmation details", async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByText(`Order Number: ${mockConfirmation.orderNumber}`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Total Cost: ${mockConfirmation.totalCost}`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `Expected Delivery Date: ${mockConfirmation.expectedDeliveryDate}`,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Payment Successful")).toBeInTheDocument();
    });
  });

  test("redirects to login page if user is not logged in", () => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
        authToken: null,
        userId: null,
      },
    });

    renderComponent();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("handles API error", async () => {
    mockAxiosGet.mockRejectedValue(new Error("API Error"));
    console.error = jest.fn();

    renderComponent();
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch confirmation",
        expect.any(Error),
      );
    });
  });

  test('renders "Track Your Order" button', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Track Your Order")).toBeInTheDocument();
    });
  });
});
