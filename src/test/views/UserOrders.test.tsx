// import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserOrders from '../../views/UserOrders';
import * as axiosHook from '../../hooks/AxiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


jest.mock('../../hooks/AxiosInstance', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-loader-spinner', () => ({
  ThreeDots: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('UserOrders Component', () => {
  let mockAxiosGet:any;
  let mockNavigate:any;

  beforeEach(() => {
    mockAxiosGet = jest.fn();
    mockNavigate = jest.fn();
    (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {})); 

    render(<UserOrders />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders order summary and recent orders when data is fetched successfully', async () => {
    const mockOrdersData = {
      data: {
        orders: [
          {
            id: '123',
            createdAt: '2023-07-14T00:00:00Z',
            status: 'Completed',
            totalAmount: 100,
            paymentInfo: { method: 'Credit Card' },
            items: [{ id: 'item1' }, { id: 'item2' }]
          },
          {
            id: '456',
            createdAt: '2023-07-15T00:00:00Z',
            status: 'Pending',
            totalAmount: 200,
            paymentInfo: { method: 'PayPal' },
            items: [{ id: 'item3' }]
          },
          {
            id: '456',
            createdAt: '2023-07-15T00:00:00Z',
            status: 'Pending',
            totalAmount: 200,
            paymentInfo: { method: 'PayPal' },
            items: [{ id: 'item3' }]
          },
          {
            id: '456',
            createdAt: '2023-07-15T00:00:00Z',
            status: 'Pending',
            totalAmount: 200,
            paymentInfo: { method: 'PayPal' },
            items: [{ id: 'item3' }]
          }
        ]
      },
      status: 200
    };

    mockAxiosGet.mockResolvedValue(mockOrdersData);

    render(<UserOrders />);

    await waitFor(() => {
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Orders Completed')).toBeInTheDocument();
      expect(screen.getByText('Orders In Progress')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); 
      expect(screen.getByText('Orders Canceled')).toBeInTheDocument();

      expect(screen.getByText('Recent Orders')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument(); 
      expect(screen.getByText('14/July/2023')).toBeInTheDocument(); 
      expect(screen.getByText('100')).toBeInTheDocument(); 
      expect(screen.getByText('Credit Card')).toBeInTheDocument(); 
      expect(screen.getByText('Completed')).toBeInTheDocument(); 
    });
  });

  it('shows error toast when fetching orders fails', async () => {
    const errorMessage = 'Error fetching orders';
    mockAxiosGet.mockRejectedValue({ response: { data: { message: errorMessage } } });

    render(<UserOrders />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('navigates to order details when View is clicked', async () => {
    const mockOrdersData = {
      data: {
        orders: [
          {
            id: '123',
            createdAt: '2023-07-14T00:00:00Z',
            status: 'Completed',
            totalAmount: 100,
            paymentInfo: { method: 'Credit Card' },
            items: [{ id: 'item1' }, { id: 'item2' }]
          }
        ]
      },
      status: 200
    };

    mockAxiosGet.mockResolvedValue(mockOrdersData);

    render(<UserOrders />);

    await waitFor(() => {
      const viewButton = screen.getByText('View');
      viewButton.click();
      expect(mockNavigate).toHaveBeenCalledWith('/order/123', { state: { data: mockOrdersData.data.orders[0] } });
    });
  });
});