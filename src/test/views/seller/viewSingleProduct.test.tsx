import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../../hooks/AxiosInstance';
import ViewSingleProduct from '../../../views/seller/viewSingleProduct';
import {store} from '../../../redux/store'; 

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

  it('renders product details after loading', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewSingleProduct />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Rwf100')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });

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
    const mockNotify = toast as jest.MockedFunction<typeof toast>;
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
      expect(mockNotify).toHaveBeenCalledWith('Error fetching product');
      expect(screen.getByText('No product found')).toBeInTheDocument();
    });
  });
});
