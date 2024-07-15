import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserCart from "../../views/UseWishList";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import * as axiosHook from "../../hooks/AxiosInstance";
import * as reactRedux from "react-redux";
import * as reactRouterDom from "react-router-dom";
import { toast } from "react-toastify";
import WishListProductCard from "../../components/WishListProductCard";
import MainProductCard from "../../components/WishListProductCard";
import MainProductCards from "../../components/MainProductCard";
import axiosClient from '../../hooks/AxiosInstance';

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

describe("UserCart (WishList) Component", () => {
  let store: any;
  let mockAxiosGet: any;
  let mockUseSelector;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      wishList: { count: 2 },
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

  it("renders empty wishlist state when no items", async () => {
    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: { wishlist: [{ products: [] }] },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("No items in your WishList.")).toBeInTheDocument();
      expect(screen.getByText("Go Shopping")).toBeInTheDocument();
    });
  });

  it("renders wishlist items when present", async () => {
    const mockWishListData = {
      wishlist: [{
        products: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            images: ["test-image.jpg"],
          },
        ],
      }],
    };

    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: mockWishListData,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserCart />
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("My WishList")).toBeInTheDocument();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Rwf 100")).toBeInTheDocument();
    });
  });

  it("handles error when fetching wishlist fails", async () => {
    const errorMessage = "Error fetching wishlist";
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

  it('navigates to home when "Go Shopping" button is clicked', async () => {
    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: { wishlist: [{ products: [] }] },
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


  it("handles error when deleting item fails with response", async () => {
    const mockWishListData = {
      wishlist: [{
        products: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            images: ["test.jpg"],
          },
        ],
      }],
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockWishListData,
    });

    const mockDelete = jest.fn().mockRejectedValue({
      response: {
        data: {
          message: "Failed to remove item from wishlist",
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
        const deleteButton = screen.getByTestId("delete-icon");
        fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("/wishList/products/1");
    expect(toast).toHaveBeenCalledWith("Failed to remove item from wishlist");
  });

  it("handles error when deleting item fails without response", async () => {
    const mockWishListData = {
      wishlist: [{
        products: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            images: ["test.jpg"],
          },
        ],
      }],
    };

    mockAxiosGet.mockResolvedValueOnce({
      status: 200,
      data: mockWishListData,
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
        const deleteButton = screen.getByTestId("delete-icon");
        fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("/wishList/products/1");
    expect(toast).toHaveBeenCalledWith("Failed to delete Item");
  });


  it("renders WishListProductCard with correct props", async () => {
    const mockWishListData = {
      wishlist: [{
        products: [
          {
            productId: "1",
            name: "Test Product",
            price: 100,
            images: ["test.jpg"],
          },
        ],
      }],
    };

    mockAxiosGet.mockResolvedValue({
      status: 200,
      data: mockWishListData,
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
      expect(screen.getByText("Rwf 100")).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
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
      expect(toast).toHaveBeenCalledWith("Fetching wishList failed");
    });
  });
  jest.mock("react-icons/md", () => ({
    MdDelete: () => <div data-testid="delete-icon">DeleteIcon</div>,
  }));
  
  describe("UserCart (WishList) Component", () => {

    it("renders WishListProductCard correctly", () => {
      const mockDeleteItem = jest.fn();
  
      render(
        <WishListProductCard
          Image="test.jpg"
          name="Test Product"
          price={100}
          id="1"
          deleteItem={mockDeleteItem}
        />
      );
  
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Rwf 100")).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg');
      expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
  
      const deleteButton = screen.getByTestId("delete-icon");
      fireEvent.click(deleteButton);
  
      expect(mockDeleteItem).toHaveBeenCalled();
    });
  });

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
          expect(screen.getByText("Go Shopping")).toBeInTheDocument();
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
          expect(toast).toHaveBeenCalledWith("Fetching wishList failed");
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
    });
    jest.mock('react-icons/ai', () => ({
        AiOutlineShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCartIcon</div>,
        AiOutlineHeart: () => <div data-testid="wishlist-icon">WishlistIcon</div>,
      }));
    describe('MainProductCard', () => {
        const mockProps = {
          id: '1',
          name: 'Test Product',
          price: '100',
          Image: 'test.jpg',
          rating: 4,
        };
      
        beforeEach(() => {
          jest.clearAllMocks();
        });
      
        test('opens and closes modal', () => {
          render(
            <BrowserRouter>
              <MainProductCard {...mockProps} />
            </BrowserRouter>
          );

          fireEvent.click(screen.getByTestId('shopping-cart-icon'));
          expect(screen.getAllByText('Add to Cart').length).toBeGreaterThanOrEqual(2);

          fireEvent.click(screen.getByText('Cancel'));
        });
      
        test('handles quantity change', () => {
          render(
            <BrowserRouter>
              <MainProductCard {...mockProps} />
            </BrowserRouter>
          );
      
          fireEvent.click(screen.getByTestId('shopping-cart-icon'));
          const quantityInput = screen.getByLabelText('Quantity:');
          fireEvent.change(quantityInput, { target: { value: '5' } });
          expect(quantityInput).toHaveValue(5);
        });
      
        test('adds product to cart successfully', async () => {
          const mockPost = jest.fn().mockResolvedValue({ data: {} });
          (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
      
          render(
            <BrowserRouter>
              <MainProductCard {...mockProps} />
            </BrowserRouter>
          );
      
          fireEvent.click(screen.getByTestId('shopping-cart-icon'));
          fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
      
          await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/cart/products/1', { quantity: 1 });
            expect(toast).toHaveBeenCalledWith('Product added to cart successfully!');
          });
        });
      
        test('handles error when adding product to cart', async () => {
          const mockPost = jest.fn().mockRejectedValue({ response: { data: { message: 'Error message' } } });
          (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
      
          render(
            <BrowserRouter>
              <MainProductCard {...mockProps} />
            </BrowserRouter>
          );
      
          fireEvent.click(screen.getByTestId('shopping-cart-icon'));
          fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
      
          await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('Error message');
          });
        });
      
        test('handles view item click', () => {
          const mockNavigate = jest.fn();
          jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
      
          render(
            <BrowserRouter>
              <MainProductCard {...mockProps} />
            </BrowserRouter>
          );
      
          fireEvent.click(screen.getByRole('button', { name: /view item/i }));
          expect(mockNavigate).toHaveBeenCalledWith('/product-detail/1');
        });
        describe('addProductToWishList', () => {
            test('adds product to wishlist successfully', async () => {
              const mockPost = jest.fn().mockResolvedValue({ data: {} });
              (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
        
              render(
                <BrowserRouter>
                  <MainProductCards {...mockProps} />
                </BrowserRouter>
              );
        
              await act(async () => {
                fireEvent.click(screen.getByTestId('wishlist-icon'));
              });
        
              await waitFor(() => {
                expect(mockPost).toHaveBeenCalledWith('/wishList/products/1');
                expect(toast).toHaveBeenCalledWith('Product added to WishList successfully!');
              });
            });
        
            test('handles error when adding product to wishlist - with response', async () => {
              const mockPost = jest.fn().mockRejectedValue({ 
                response: { data: { message: 'Error adding to wishlist' } } 
              });
              (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
        
              render(
                <BrowserRouter>
                  <MainProductCards {...mockProps} />
                </BrowserRouter>
              );
        
              await act(async () => {
                fireEvent.click(screen.getByTestId('wishlist-icon'));
              });
        
              await waitFor(() => {
                expect(toast).toHaveBeenCalledWith('Error adding to wishlist');
              });
            });
        
            test('handles error when adding product to wishlist - no response', async () => {
              const mockPost = jest.fn().mockRejectedValue({ request: {} });
              (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
        
              render(
                <BrowserRouter>
                  <MainProductCards {...mockProps} />
                </BrowserRouter>
              );
        
              await act(async () => {
                fireEvent.click(screen.getByTestId('wishlist-icon'));
              });
        
              await waitFor(() => {
                expect(toast).toHaveBeenCalledWith('No response received from the server.');
              });
            });
        
            test('handles error when adding product to wishlist - request setup error', async () => {
              const mockPost = jest.fn().mockRejectedValue(new Error('Setup error'));
              (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
        
              render(
                <BrowserRouter>
                  <MainProductCards {...mockProps} />
                </BrowserRouter>
              );
        
              await act(async () => {
                fireEvent.click(screen.getByTestId('wishlist-icon'));
              });
        
              await waitFor(() => {
                expect(toast).toHaveBeenCalledWith('Error setting up request.');
              });
            });
        
            test('sets loading state correctly', async () => {
              const mockPost = jest.fn().mockImplementation(() => 
                new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
              );
              (axiosClient as jest.Mock).mockReturnValue({ post: mockPost });
        
              render(
                <BrowserRouter>
                  <MainProductCards {...mockProps} />
                </BrowserRouter>
              );
        
              act(() => {
                fireEvent.click(screen.getByTestId('wishlist-icon'));
              });
    
            });
          });
    })
});
