// import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserOrderTrack from '../../views/UserOrderTrack';
import * as axiosHook from '../../hooks/AxiosInstance';
import { toast } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";


jest.mock('../../hooks/AxiosInstance', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

jest.mock('react-loader-spinner', () => ({
  ThreeDots: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe('UserOrderTrack Component', () => {
  let mockAxiosGet: jest.Mock<any, any, any>;

  beforeEach(() => {
    mockAxiosGet = jest.fn();
    (axiosHook.default as jest.Mock).mockReturnValue({ get: mockAxiosGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockAxiosGet.mockReturnValue(new Promise(() => {})); 
    render(
      <BrowserRouter>
       <UserOrderTrack />
      </BrowserRouter>
  );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders order details when data is fetched successfully', async () => {
    const mockOrderData = {
      data: {
        order: {
          id: '123',
          createdAt: '2023-07-14',
          orderNumber: 'ORD001',
          status: 'Completed',
          totalAmount: 100,
          items: [
            { name: 'Test Product', price: 50, quantity: 2, images: ['test.jpg'] }
          ]
        }
      },
      status: 200
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

        render(
      <BrowserRouter>
       <UserOrderTrack />
      </BrowserRouter>
  );

    await waitFor(() => {
      expect(screen.getByText('#123')).toBeInTheDocument();
      expect(screen.getByText('14/July/2023')).toBeInTheDocument();
      expect(screen.getByText('ORD001')).toBeInTheDocument();
      expect(screen.getByText('Order Completed')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('shows error toast when fetching order fails', async () => {
    const errorMessage = 'Fetching Order failed';
    mockAxiosGet.mockRejectedValue({ response: { data: { message: errorMessage } } });

        render(
      <BrowserRouter>
       <UserOrderTrack />
      </BrowserRouter>
  );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('opens review modal when "Add Review" button is clicked', async () => {
    const mockOrderData = {
      data: {
        order: {
          id: '123',
          createdAt: '2023-07-14',
          orderNumber: 'ORD001',
          status: 'Completed',
          totalAmount: 100,
          items: [
            { name: 'Test Product', price: 50, quantity: 2, images: ['test.jpg'] }
          ]
        }
      },
      status: 200
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

        render(
      <BrowserRouter>
       <UserOrderTrack />
      </BrowserRouter>
  );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Review Product'));
      expect(screen.getByText('Rate Product')).toBeInTheDocument();
    });
  });

  it('closes review modal when close button is clicked', async () => {
    const mockOrderData = {
      data: {
        order: {
          id: '123',
          createdAt: '2023-07-14',
          orderNumber: 'ORD001',
          status: 'Completed',
          totalAmount: 100,
          items: [
            { name: 'Test Product', price: 50, quantity: 2, images: ['test.jpg'] }
          ]
        }
      },
      status: 200
    };

    mockAxiosGet.mockResolvedValue(mockOrderData);

        render(
      <BrowserRouter>
       <UserOrderTrack />
      </BrowserRouter>
  );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Review Product'));
      expect(screen.getByText('Rate Product')).toBeInTheDocument();
      
    //   fireEvent.click(screen.getByText('Rate Product').nextElementSibling);
    //   expect(screen.queryByText('Rate Product')).not.toBeInTheDocument();
    });
  });
});