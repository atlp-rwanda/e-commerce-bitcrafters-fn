import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserOrderTrack from "../../views/UserOrderTrack";
import * as axiosHook from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../hooks/AxiosInstance", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("react-loader-spinner", () => ({
  ThreeDots: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("UserOrderTrack Component", () => {
  let mockAxiosGet: jest.Mock<any, any, any>;
  let mockAxiosPost: jest.Mock<any, any, any>;

  beforeEach(() => {
    mockAxiosGet = jest.fn();
    mockAxiosPost = jest.fn();

    (axiosHook.default as jest.Mock).mockReturnValue({
      get: mockAxiosGet,
      post: mockAxiosPost,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {}));
    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders order details when data is fetched successfully", async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('#123')).toBeInTheDocument();
      expect(screen.getByText('14/July/2023')).toBeInTheDocument();
      expect(screen.getByText('ORD001')).toBeInTheDocument();
      expect(screen.getByText('Order Completed')).toBeInTheDocument();
      expect(screen.getByText('Rwf 100')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it("shows error toast when fetching order fails", async () => {
    const errorMessage = "Fetching Order failed";
    mockAxiosGet.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('opens review modal when "Add Review" button is clicked', async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Review Product"));
      expect(screen.getByText("Leave Your FeedBack")).toBeInTheDocument();
    });
  });

  it("closes review modal when close button is clicked", async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Review Product"));
      expect(screen.getByText("Leave Your FeedBack")).toBeInTheDocument();
    });
  });
  it("renders different order statuses correctly", async () => {
    const statuses = ["Completed", "Pending", "Cancelled"];

    for (const status of statuses) {
      const mockOrderData = {
        data: {
          order: {
            id: "123",
            createdAt: "2023-07-14",
            orderNumber: "ORD001",
            status: status,
            totalAmount: 100,
            items: [
              {
                name: "Test Product",
                price: 50,
                quantity: 2,
                images: ["test.jpg"],
                productId: "1",
              },
            ],
          },
        },
        status: 200,
      };

      mockAxiosGet.mockResolvedValue(mockOrderData);

      render(
        <BrowserRouter>
          <UserOrderTrack />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText(`Order ${status}`)).toBeInTheDocument();
      });
      jest.clearAllMocks();
    }
  });

  it("opens review modal and handles star rating", async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
              productId: "1",
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Review Product"));
    });

    expect(screen.getByText("Leave Your FeedBack")).toBeInTheDocument();

    const stars = screen.getAllByTestId("star-icon");
    fireEvent.click(stars[2]);

    expect(stars[2]).toHaveClass("text-orange-500");
  });

  it("submits review successfully", async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
              productId: "1",
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);
    mockAxiosPost.mockResolvedValue({ status: 200 });

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Review Product"));
    });

    const feedbackInput = screen.getByPlaceholderText(
      "Type your feedback here",
    );
    fireEvent.change(feedbackInput, { target: { value: "Great product!" } });

    const stars = screen.getAllByTestId("star-icon");
    fireEvent.click(stars[4]);

    fireEvent.click(screen.getByText("Add Review"));

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        "/collections/product/1/reviews",
        { rating: 5, feedback: "Great product!" },
      );
      expect(toast).toHaveBeenCalledWith("Review added successfully");
    });
  });

  it("closes review modal when close button is clicked", async () => {
    const mockOrderData = {
      data: {
        order: {
          id: "123",
          createdAt: "2023-07-14",
          orderNumber: "ORD001",
          status: "Completed",
          totalAmount: 100,
          items: [
            {
              name: "Test Product",
              price: 50,
              quantity: 2,
              images: ["test.jpg"],
              productId: "1",
            },
          ],
        },
      },
      status: 200,
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

    render(
      <BrowserRouter>
        <UserOrderTrack />
      </BrowserRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Review Product"));
    });

    expect(screen.getByText("Leave Your FeedBack")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-modal-button"));

    await waitFor(() => {
      expect(screen.queryByText("Leave Your FeedBack")).not.toBeInTheDocument();
    });
  });
});
