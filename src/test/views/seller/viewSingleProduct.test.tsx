import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../../hooks/AxiosInstance';
import ViewSingleProduct from '../../../views/seller/viewSingleProduct';
import { store } from '../../../redux/store';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '123' }),
}));

jest.mock('../../../hooks/AxiosInstance');
jest.mock('react-toastify');

const mockProduct = {
  id: '123',
  name: 'Test Product',
  category: 'Test Category',
  price: 100,
  quantity: 10,
  status: 'active',
  images: ['image1.jpg', 'image2.jpg'],
  expiryDate: '2023-12-31',
  averageRating: 4,
  seller: {
    id: 'seller123',
    username: 'TestSeller',
    email: 'seller@test.com',
  },
  reviews: [
    {
      id: 'review123',
      rating: 5,
      feedback: 'Great product!',
      buyerId: 'buyer123',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      buyer: {
        id: 'buyer123',
        username: 'TestBuyer',
      },
    },
  ],
};

describe('ViewSingleProduct', () => {
  beforeEach(() => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { item: mockProduct } }),
    });
    // toast.mockClear();
  });

  it('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // it('renders product details after loading', async () => {
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <ViewSingleProduct />
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Test Product')).toBeInTheDocument();
  //     expect(screen.getByText('Rwf100')).toBeInTheDocument();
  //     expect(screen.getByText('Test Category')).toBeInTheDocument();
  //   });
  // });

  it('displays seller information', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('TestSeller')).toBeInTheDocument();
      expect(screen.getByText('seller@test.com')).toBeInTheDocument();
    });
  });

  it('displays reviews', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Great product!')).toBeInTheDocument();
      expect(screen.getByText('TestBuyer')).toBeInTheDocument();
    });
  });

  it('handles error when fetching product', async () => {
    // const mockNotify = toast as jest.MockedFunction<typeof toast>;
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('API Error')),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('No product found')).toBeInTheDocument();
    });
  });

  it('handles no response error when adding product to cart', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: { item: mockProduct } }),
      post: jest.fn().mockRejectedValue({ request: {} }),
    };
    (axiosClient as jest.Mock).mockReturnValue(mockClient);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    const addToCartModalButton = screen.getByText('Add to Cart', { selector: 'button[type="submit"]' });
    await act(async () => {
      userEvent.click(addToCartModalButton);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('No response received from the server.');
    });
  });

  it('handles error setting up request when adding product to cart', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: { item: mockProduct } }),
      post: jest.fn().mockRejectedValue({}),
    };
    (axiosClient as jest.Mock).mockReturnValue(mockClient);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    const addToCartModalButton = screen.getByText('Add to Cart', { selector: 'button[type="submit"]' });
    await act(async () => {
      userEvent.click(addToCartModalButton);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Error setting up request.');
    });
  });

  it('handles API response error when adding product to cart', async () => {
    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: { item: mockProduct } }),
      post: jest.fn().mockRejectedValue({
        response: {
          data: { message: 'Error adding to cart' },
        },
      }),
    };
    (axiosClient as jest.Mock).mockReturnValue(mockClient);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    const addToCartModalButton = screen.getByText('Add to Cart', { selector: 'button[type="submit"]' });
    await act(async () => {
      userEvent.click(addToCartModalButton);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Error adding to cart');
    });
  });

  it('opens modal when "Add to Cart" button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    expect(screen.getByText('Add to Cart', { selector: 'h2' })).toBeInTheDocument();
  });

  it('updates quantity when input value changes', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    const quantityInput = screen.getByLabelText('Quantity:') as HTMLInputElement;
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(quantityInput.value).toBe('5');
  });

  it('adds product to cart successfully', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: { item: mockProduct } }),
      post: jest.fn().mockResolvedValue({}),
    };
    (axiosClient as jest.Mock).mockReturnValue(mockClient);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addToCartButton = screen.getByText('Add to Cart', { selector: 'button.flex' });
      fireEvent.click(addToCartButton);
    });

    const quantityInput = screen.getByLabelText('Quantity:');
    fireEvent.change(quantityInput, { target: { value: '5' } });

    const addToCartModalButton = screen.getByText('Add to Cart', { selector: 'button[type="submit"]' });
    await act(async () => {
      userEvent.click(addToCartModalButton);
    });

    await waitFor(() => {
      expect(mockClient.post).toHaveBeenCalledWith('/cart/products/123', { quantity: 5 });
      expect(mockNavigate).toHaveBeenCalledWith('/cart');
      expect(toast).toHaveBeenCalledWith('Product added to cart successfully!');
    });
  });
});
