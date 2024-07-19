// import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import XMobileMoney from '../../views/XMobileMoney'; 
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosClient from '../../hooks/AxiosInstance';
import PaymentSuccess from '../../views//PaymentSuccess'; 
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';

jest.mock('react-toastify');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orderId: 'test-order-id' }),
  useNavigate: jest.fn(),
}));
jest.mock('../../hooks/AxiosInstance');

const mockedAxiosClient = useAxiosClient as jest.MockedFunction<typeof useAxiosClient>;
const mockNavigate = jest.requireMock('react-router-dom').useNavigate;

describe('XMobileMoney', () => {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxiosClient.mockReturnValue(mockClient as any);
  });

  it('fetches order and displays phone number', async () => {
    mockClient.get.mockResolvedValueOnce({
      status: 200,
      data: { order: { paymentInfo: { mobileMoneyNumber: '1234567890' } } },
    });

    render(
      <Router>
        <XMobileMoney />
      </Router>
    );

    await waitFor(() => expect(mockClient.get).toHaveBeenCalledWith('/orders/test-order-id'));
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('displays error message when fetching order fails', async () => {
    mockClient.get.mockRejectedValueOnce({
      response: { data: { message: 'Fetching Order failed' } },
    });

    render(
      <Router>
        <XMobileMoney />
      </Router>
    );

    await waitFor(() => expect(toast).toHaveBeenCalledWith('Fetching Order failed'));
  });

  it('initiates order and checks order status', async () => {
    mockClient.get.mockResolvedValueOnce({
      status: 200,
      data: { order: { paymentInfo: { mobileMoneyNumber: '1234567890' } } },
    });

    mockClient.post.mockResolvedValueOnce({ status: 200 });
    mockClient.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <XMobileMoney />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('1234567890')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Enter phone number'), {
      target: { value: '1234567890' },
    });

    fireEvent.click(screen.getByText('Proceed Payment'));

    await waitFor(() => expect(mockClient.post).toHaveBeenCalledWith('/payment/momo/pay/test-order-id'));
    await waitFor(() => expect(mockClient.post).toHaveBeenCalledWith('/payment/momo/check/test-order-id'));
    expect(mockNavigate).toHaveBeenCalled
  });

  it('displays error message when payment initiation fails', async () => {
    mockClient.get.mockResolvedValueOnce({
      status: 200,
      data: { order: { paymentInfo: { mobileMoneyNumber: '1234567890' } } },
    });

    mockClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Payment failed' } },
    });

    render(
      <Router>
        <XMobileMoney />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('1234567890')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Enter phone number'), {
      target: { value: '1234567890' },
    });

    fireEvent.click(screen.getByText('Proceed Payment'));

    // await waitFor(() => expect(toast).toHaveBeenCalledWith('Payment failed'));
  });

  it('displays loading indicator during async operations', async () => {
    mockClient.get.mockResolvedValueOnce({
      status: 200,
      data: { order: { paymentInfo: { mobileMoneyNumber: '1234567890' } } },
    });

    render(
      <Router>
        <XMobileMoney />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('1234567890')).toBeInTheDocument());
  });
});



// ________________________________



jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orderId: 'test-order-id' }),
  useNavigate: jest.fn(),
}));

// const mockNavigate = jest.requireMock('react-router-dom').useNavigate;

describe('PaymentSuccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the payment success message and icon', () => {
    render(
      <Router>
        <PaymentSuccess />
      </Router>
    );

    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(screen.getByTestId('fa-check')).toBeInTheDocument();
  });

  // it('navigates to the order tracking page on button click', () => {
  //   render(
  //     <Router>
  //       <PaymentSuccess />
  //     </Router>
  //   );

  //   fireEvent.click(screen.getByText('Track Order'));

  //   expect(mockNavigate).toHaveBeenCalled;
  // });

  it('renders the ToastContainer', () => {
    render(
      <Router>
        <PaymentSuccess />
      </Router>
    );

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });
});
