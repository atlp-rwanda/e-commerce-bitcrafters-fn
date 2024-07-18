import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainProductCard from '../../components/MainProductCard';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosClient from '../../hooks/AxiosInstance';
import { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../hooks/AxiosInstance');
const mockedAxiosClient = axiosClient as jest.MockedFunction<typeof axiosClient>;

jest.mock('react-modal', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('react-toastify', () => ({
  toast: jest.fn(),
  ToastContainer: () => null,
}));

describe('MainProductCard', () => {
  const mockProps = {
    id: '1',
    name: 'Test Product',
    Image: 'test-image.jpg',
    rating: 4,
    price: '1000',
    discount: '1200',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <Router>
          {ui}
        </Router>
      </Provider>
    );
  };

  it('renders the component with correct props', () => {
    renderWithProviders(<MainProductCard {...mockProps} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Rwf 1000')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('opens modal when add to cart button is clicked', () => {
    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('calls addProductToCart when form is submitted', async () => {
    const mockPost = jest.fn().mockResolvedValue({});
    mockedAxiosClient.mockReturnValue({ post: mockPost } as unknown as AxiosInstance);

    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    expect(mockPost).toHaveBeenCalledWith('/cart/products/1', { quantity: 1 });
  });

  it('navigates to product detail page when view item is clicked', async () => {
    const mockNavigate = jest.fn();
   (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByLabelText('view item'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/product-detail/1');
    });
  });

  it('updates quantity when input value changes', () => {
    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    const input = screen.getByLabelText('Quantity:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2' } });

    expect(input.value).toBe('2');
  });

  it('shows error toast when addProductToCart fails with response error', async () => {
    const mockPost = jest.fn().mockRejectedValue({
      response: { data: { message: 'Error response message' } },
    });
    mockedAxiosClient.mockReturnValue({ post: mockPost } as unknown as AxiosInstance);

    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Error response message');
    });
  });

  it('shows error toast when addProductToCart fails with request error', async () => {
    const mockPost = jest.fn().mockRejectedValue({ request: {} });
    mockedAxiosClient.mockReturnValue({ post: mockPost } as unknown as AxiosInstance);

    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('No response received from the server.');
    });
  });

  it('shows error toast when addProductToCart fails with other errors', async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error('Unknown error'));
    mockedAxiosClient.mockReturnValue({ post: mockPost } as unknown as AxiosInstance);

    renderWithProviders(<MainProductCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));

    await waitFor(() => {
      const form = screen.getByRole('form');
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Error setting up request.');
    });
  });
});
