import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import RequestPasswordChange from '../../views/RequestPasswordChange';
import axiosClient from '../../hooks/AxiosInstance';
import "@testing-library/jest-dom";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ state: { email: 'test@example.com' } }),
}));

jest.mock('../../hooks/AxiosInstance.tsx');
jest.mock('react-toastify');

describe('RequestPasswordChange Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders RequestPasswordChange component', async() => {
    
    await act(async () => {
    render(
      <BrowserRouter>
        <RequestPasswordChange />
      </BrowserRouter>
    );
    })
    expect(screen.getByText('CHANGE PASSWORD')).toBeInTheDocument();
    expect(screen.getByText('Your password has expired. Please enter email associated with your account to renew it')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  test('pre-fills email from location state', async() => {

    await act(async () => {
    render(
      <BrowserRouter>
        <RequestPasswordChange />
      </BrowserRouter>
    );
})

    const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;
    expect(emailInput.value).toBe('test@example.com');
  });

  test('validates email input', async () => {
    await act(async () => {
    render(
      <BrowserRouter>
        <RequestPasswordChange />
      </BrowserRouter>
    );})

    const emailInput = screen.getByPlaceholderText('Enter email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    })

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.blur(emailInput);
    })

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('handles password reset request successfully', async () => {
    const mockAxiosPost = jest.fn().mockResolvedValue({
      status: 200,
      data: { message: 'Reset link sent successfully' },
    });
    (axiosClient as jest.Mock).mockReturnValue({ post: mockAxiosPost });

    await act(async () => {
    render(
      <BrowserRouter>
        <RequestPasswordChange />
      </BrowserRouter>
    );
})

    const emailInput = screen.getByPlaceholderText('Enter email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    })

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith('/users/reset/link', {
        email: 'test@example.com',
      });
      expect(toast).toHaveBeenCalledWith('Reset link sent successfully');
      expect(screen.getByText('An email with your password reset link has been sent to your account')).toBeInTheDocument();
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  test('handles password reset request error', async () => {
    const mockAxiosPost = jest.fn().mockRejectedValue({
      response: { data: { message: 'Reset link request failed' } },
    });
    (axiosClient as jest.Mock).mockReturnValue({ post: mockAxiosPost });

    render(
      <BrowserRouter>
        <RequestPasswordChange />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter email');
    const submitButton = screen.getByRole('button', { name: 'Continue' });

    await act(async () => {
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    })

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith('/users/reset/link', {
        email: 'test@example.com',
      });
      expect(toast).toHaveBeenCalledWith('Reset link request failed');
      expect(submitButton).toBeInTheDocument();
    });
  });
});