
import {render,screen,waitFor,act,} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../views/checkout";
import useAxiosClient from "../hooks/AxiosInstance";

jest.mock("../hooks/AxiosInstance");
jest.mock("react-toastify");

const mockAxiosClient = {
  get: jest.fn(),
  post: jest.fn(),
};

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Checkout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAxiosClient as jest.Mock).mockReturnValue(mockAxiosClient);
  });

  const mockCart = {
    items: [
      {
        productId: "1",
        name: "Product 1",
        price: 100,
        quantity: 1,
        images: ["image1.jpg"],
      },
      {
        productId: "2",
        name: "Product 2",
        price: 200,
        quantity: 1,
        images: ["image2.jpg"],
      },
      {
        productId: "3",
        name: "Product 3",
        price: 300,
        quantity: 1,
        images: ["image3.jpg"],
      },
    ],
    totalQuantity: 3,
    totalPrice: 600,
  };

  const renderCheckout = async () => {
    mockAxiosClient.get.mockResolvedValueOnce({ data: { cart: mockCart } });
    await act(async () => {
      render(
        <MemoryRouter>
          <Checkout />
        </MemoryRouter>,
      );
    });
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
    );
  };

  // ====================================================================
  it("renders checkout form when cart is loaded", async () => {
    await renderCheckout();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Street Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Town/City")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Delivery Date")).toBeInTheDocument();
  });
  it("renders loading state when cart is null", async () => {
    mockAxiosClient.get.mockResolvedValueOnce({ data: { cart: null } });
    render(<Checkout />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders checkout form when cart is loaded", async () => {
    mockAxiosClient.get.mockResolvedValueOnce({ data: { cart: mockCart } });
    render(<Checkout />);
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Country")).toBeInTheDocument();
      expect(screen.getByLabelText("Street Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Town/City")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(screen.getByLabelText("Delivery Date")).toBeInTheDocument();
    });
  });

  
});
