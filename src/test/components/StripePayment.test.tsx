import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import PaymentPage from "../../components/StripePayment";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn().mockReturnValue({ orderId: "12345" }),
}));

jest.mock("../../hooks/AxiosInstance", () => jest.fn());

jest.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardElement: () => <div data-testid="card-element" />,
  useStripe: jest.fn(),
  useElements: jest.fn(),
}));

jest.mock("@stripe/stripe-js", () => ({
  loadStripe: jest.fn(),
}));

const mockStore = configureStore([]);

describe("PaymentPage", () => {
  let store: any;
  let mockStripe: any;
  let mockElements: any;
  let mockNavigate: jest.Mock;
  let mockAxiosGet: jest.Mock;
  let mockAxiosPost: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
        authToken: "mock-token",
      },
    });

    mockStripe = {
      createPaymentMethod: jest.fn(),
      confirmCardPayment: jest.fn(),
      handleCardAction: jest.fn(),
    };

    mockElements = {
      getElement: jest.fn(),
    };

    mockNavigate = jest.fn();
    mockAxiosGet = jest.fn();
    mockAxiosPost = jest.fn();

    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    require("react-router-dom").useParams.mockReturnValue({ orderId: "12345" });
    require("../../hooks/AxiosInstance").mockReturnValue({
      get: mockAxiosGet,
      post: mockAxiosPost,
    });

    require("@stripe/react-stripe-js").useStripe.mockReturnValue(mockStripe);
    require("@stripe/react-stripe-js").useElements.mockReturnValue(
      mockElements,
    );
    require("@stripe/stripe-js").loadStripe.mockResolvedValue(mockStripe);

    mockAxiosGet.mockResolvedValue({
      data: {
        order: {
          id: "12345",
          totalAmount: 1000,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );
  };

  test("renders loading state initially", () => {
    renderComponent();
    expect(screen.getByText("Loading order details...")).toBeInTheDocument();
  });

  test("fetches and displays order details", async () => {
    const mockOrderDetails = {
      id: "12345",
      totalAmount: 1000,
    };

    mockAxiosGet.mockResolvedValue({ data: { order: mockOrderDetails } });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Payment")).toBeInTheDocument();
      expect(screen.getByText("Order Total: RWF 1000")).toBeInTheDocument();
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

  test("renders Stripe CardElement", async () => {
    mockAxiosGet.mockResolvedValue({
      data: { order: { id: "12345", totalAmount: 1000 } },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("card-element")).toBeInTheDocument();
    });
  });

  test("handles API error when fetching order details", async () => {
    mockAxiosGet.mockRejectedValue(new Error("API Error"));
    console.error = jest.fn();

    renderComponent();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch order details",
        expect.any(Error),
      );
    });
  });

  test("handles successful payment submission", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });

    mockAxiosPost.mockResolvedValue({
      data: {
        status: "requires_confirmation",
        clientSecret: "client_secret_123",
      },
    });

    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });

    console.log = jest.fn();
    console.error = jest.fn();

    renderComponent();

    await waitFor(() => {
      const payButton = screen.getByRole("button", { name: /Pay RWF 1000/i });
      expect(payButton).toBeInTheDocument();
      fireEvent.submit(payButton);
      console.log("Pay button clicked");
    });

    await waitFor(() => {
      expect(mockStripe.createPaymentMethod).toHaveBeenCalled();
      expect(mockAxiosPost).toHaveBeenCalled();
      expect(mockStripe.confirmCardPayment).toHaveBeenCalled();
      console.log("Payment process completed");
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Unexpected PaymentIntent status"),
      ).not.toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/confirmation/12345");
        console.log("Navigation occurred");
      },
      { timeout: 5000 },
    );

    expect(console.error).not.toHaveBeenCalled();
  });
  test("email input is required", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText("Email");
      expect(emailInput).toBeRequired();
    });
  });
  test("updates name input value", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText("Name on card");
      expect(nameInput).toBeInTheDocument();

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      expect(nameInput).toHaveValue("John Doe");
    });
  });
  test("handles payment requiring confirmation", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { status: "requires_confirmation", clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(mockStripe.confirmCardPayment).toHaveBeenCalledWith("cs_123", {
        payment_method: "pm_123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation/12345");
    });
  });

  test("handles 3D Secure authentication", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { status: "requires_confirmation", clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(mockStripe.handleCardAction).toHaveBeenCalledWith("cs_123");
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation/12345");
    });
  });

  test("handles payment creation error", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      error: { message: "Failed to create payment method" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create payment method"),
      ).toBeInTheDocument();
    });
  });

  test("handles unexpected PaymentIntent status", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "unknown_status" },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Unexpected PaymentIntent status"),
      ).toBeInTheDocument();
    });
  });
  test("handles payment confirmation error", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { status: "requires_confirmation", clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      error: { message: "Confirmation failed" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF/i }));
    });

    await waitFor(() => {
      expect(screen.getByText("Confirmation failed")).toBeInTheDocument();
    });
  });
  test("handles 3D Secure authentication error", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { status: "requires_confirmation", clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      error: { message: "3D Secure authentication failed" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("3D Secure authentication failed"),
      ).toBeInTheDocument();
    });
  });
  test("handles payment failure after 3D Secure authentication", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { status: "requires_confirmation", clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      paymentIntent: { status: "failed" },
    });

    renderComponent();

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Payment failed after 3D Secure authentication"),
      ).toBeInTheDocument();
    });
  });
  test("handles Stripe not loaded error", async () => {
    require("@stripe/react-stripe-js").useStripe.mockReturnValue(null);
    require("@stripe/react-stripe-js").useElements.mockReturnValue(null);

    console.log = jest.fn();
    console.error = jest.fn();

    renderComponent();

    await waitFor(() => {
      const payButton = screen.getByRole("button", { name: /Pay RWF 1000/i });
      expect(payButton).toBeInTheDocument();
      fireEvent.submit(payButton);
      console.log("Pay button clicked");
    });

    await waitFor(() => {
      expect(screen.getByText("Stripe has not loaded yet")).toBeInTheDocument();
    });

    const payButton = screen.getByRole("button", { name: /Pay RWF 1000/i });
    expect(payButton).not.toBeDisabled();

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(console.error).not.toHaveBeenCalled();
  });

  test("handles payment requiring 3D Secure authentication", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      paymentIntent: { status: "succeeded" },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(mockStripe.confirmCardPayment).toHaveBeenCalledWith("cs_123", {
        payment_method: "pm_123",
      });
      expect(mockStripe.handleCardAction).toHaveBeenCalledWith("cs_123");
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation/12345");
    });
  });

  test("handles failed 3D Secure authentication", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      error: { message: "3D Secure authentication failed" },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("3D Secure authentication failed"),
      ).toBeInTheDocument();
    });
  });

  test("handles payment failure after successful 3D Secure authentication", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { clientSecret: "cs_123" },
    });
    mockStripe.confirmCardPayment.mockResolvedValue({
      paymentIntent: { status: "requires_action" },
    });
    mockStripe.handleCardAction.mockResolvedValue({
      paymentIntent: { status: "failed" },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Payment failed after 3D Secure authentication"),
      ).toBeInTheDocument();
    });
  });

  test("handles missing client secret in payment intent data", async () => {
    mockStripe.createPaymentMethod.mockResolvedValue({
      paymentMethod: { id: "pm_123" },
    });
    mockAxiosPost.mockResolvedValue({
      data: { success: false },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PaymentPage />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: /Pay RWF 1000/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to get client secret from payment intent"),
      ).toBeInTheDocument();
    });
  });
});
