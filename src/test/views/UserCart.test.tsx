import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCart from "../../views/UserCart";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import * as axiosHook from "../../hooks/AxiosInstance";
import * as reactRedux from "react-redux";
import * as reactRouterDom from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../../hooks/AxiosInstance", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
  ToastContainer: () => null,
}));

jest.mock("react-loader-spinner", () => ({
  ThreeDots: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockStore = configureStore([]);

describe("UserCart Component", () => {
  let store: any;
  let mockAxiosGet: any;
  let mockUseSelector;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      cart: { count: 2 },
      auth: { authToken: "mock-token" },
    });

    mockAxiosGet = jest.fn();
    (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet });

    mockUseSelector = jest.spyOn(reactRedux, "useSelector");
    mockUseSelector.mockImplementation((selector) =>
      selector(store.getState()),
    );

    jest.useFakeTimers();
    mockNavigate = jest.fn();
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {}));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders empty cart state when no items", async () => {
    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: { cart: { items: [] } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("No items in cart.")).toBeInTheDocument();
      expect(screen.getByText("Go Shopping")).toBeInTheDocument();
    });
  });

  it("renders cart items when present", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 2,
            images: ["test-image.jpg"],
          },
        ],
        totalQuantity: 2,
        totalPrice: 200,
      },
    };

    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: mockCartData,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("My Cart")).toBeInTheDocument();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Rwf 200")).toBeInTheDocument();
      expect(screen.getByText("Checkout")).toBeInTheDocument();
    });
  });

  it("handles error when fetching cart fails", async () => {
    const errorMessage = "Error fetching cart";
    mockAxiosGet.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("handles error when fetching cart fails without response", async () => {
    mockAxiosGet.mockRejectedValue(new Error());

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Fetching cart failed");
    });
  });

  it('navigates to home when "Go Shopping" button is clicked', async () => {
    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: { cart: { items: [] } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Go Shopping"));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it('navigates to checkout when "Checkout" button is clicked', async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 1,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: mockCartData,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Checkout"));
      expect(mockNavigate).toHaveBeenCalledWith("/checkout");
    });
  });

  it("renders CartProductCard with correct props", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 17,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 13,
        totalPrice: 1000,
      },
    };

    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: mockCartData,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("13")).toBeInTheDocument();
      expect(screen.getByText("Rwf 1000")).toBeInTheDocument();
    });
  });

  it("deletes item when delete button is clicked", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 1,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockCartData,
    });

    const mockDelete = jest.fn().mockResolvedValue({
      status: 200,
      data: { message: "Item deleted from cart" },
    });

    (axiosHook.default as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
      delete: mockDelete,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("/cart/products/1");
    expect(toast).toHaveBeenCalledWith("Item deleted from cart");
    expect(mockAxiosGet).toHaveBeenCalledTimes(2);
  });

  it("handles error when deleting item fails with response", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 1,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockCartData,
    });

    const mockDelete = jest.fn().mockRejectedValue({
      response: {
        data: {
          message: "Failed to remove item from cart",
        },
      },
    });

    (axiosHook.default as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
      delete: mockDelete,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("/cart/products/1");
    expect(toast).toHaveBeenCalledWith("Failed to remove item from cart");
  });

  it("handles error when deleting item fails without response", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 1,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockCartData,
    });

    const mockDelete = jest.fn().mockRejectedValue(new Error("Network error"));

    (axiosHook.default as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
      delete: mockDelete,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      const deleteButton = screen.getByText("Delete");
      fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("/cart/products/1");
    expect(toast).toHaveBeenCalledWith("Failed to delete Item");
  });

  it("opens and closes update modal", async () => {
    const mockCartData = {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 1,
            images: ["test.jpg"],
          },
        ],
        totalQuantity: 1,
        totalPrice: 100,
      },
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockCartData,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("update-quantity-button")).toBeInTheDocument();
    });

    // Click the update button
    fireEvent.click(screen.getByTestId("update-quantity-button"));

    // Check if modal is open
    await waitFor(() => {
      expect(screen.getByText("Update Quantity")).toBeInTheDocument();
    });

    // Click the cancel button
    const cancelButton = await screen.findByTestId("modal-cancel-button");
    fireEvent.click(cancelButton);

    // Check if modal is closed
    await waitFor(() => {
      expect(screen.queryByText("Update Quantity")).not.toBeInTheDocument();
    });
  });

  it('clears the cart when "Clear Cart" button is clicked', async () => {
  const clearCartMessage = "Cart cleared successfully";
  const mockCartData = {
    cart: {
      items: [
        {
          productId: "1",
          name: "Test Product",
          price: 100,
          quantity: 2,
          images: ["test-image.jpg"],
        },
      ],
      totalQuantity: 2,
      totalPrice: 200,
    },
  };

  mockAxiosGet.mockResolvedValueOnce({
    status: 200,
    data: mockCartData,
  });

  const mockAxiosDelete = jest.fn().mockResolvedValue({
    status: 200,
    data: { message: clearCartMessage },
  });

  (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet, delete: mockAxiosDelete });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <UserCart />
      </BrowserRouter>
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Clear Cart'));

  await waitFor(() => {
    expect(toast).toHaveBeenCalledWith(clearCartMessage);
    expect(mockAxiosGet).toHaveBeenCalledTimes(2); 
  });
});
it('handles error when clearing cart fails with response message', async () => {
  const errorMessage = "Error clearing cart";
  mockAxiosGet.mockResolvedValue({
    status: 200,
    data: {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 2,
            images: ["test-image.jpg"],
          },
        ],
        totalQuantity: 2,
        totalPrice: 200,
      },
    },
  });

  const mockAxiosDelete = jest.fn().mockRejectedValue({
    response: { data: { message: errorMessage } },
  });

  (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet, delete: mockAxiosDelete });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <UserCart />
      </BrowserRouter>
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Clear Cart'));

  await waitFor(() => {
    expect(mockAxiosDelete).toHaveBeenCalledWith("/cart/clear");
    expect(toast).toHaveBeenCalledWith(errorMessage);
  });
});

it('handles error when clearing cart fails without response message', async () => {
  const fallbackErrorMessage = "Failed to clear cart";
  mockAxiosGet.mockResolvedValue({
    status: 200,
    data: {
      cart: {
        items: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            quantity: 2,
            images: ["test-image.jpg"],
          },
        ],
        totalQuantity: 2,
        totalPrice: 200,
      },
    },
  });

  const mockAxiosDelete = jest.fn().mockRejectedValue(new Error());

  (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet, delete: mockAxiosDelete });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <UserCart />
      </BrowserRouter>
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Clear Cart'));

  await waitFor(() => {
    expect(mockAxiosDelete).toHaveBeenCalledWith("/cart/clear");
    expect(toast).toHaveBeenCalledWith(fallbackErrorMessage);
  });
});

});
