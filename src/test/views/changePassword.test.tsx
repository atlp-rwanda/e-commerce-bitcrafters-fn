import { render, screen, fireEvent, waitFor , act} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChangePassword from '../../views/ChangePassword';
import axiosClient from '../../hooks/AxiosInstance';
import "@testing-library/jest-dom";
import * as reactRouterDom from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ token: 'test-token' }),
}));

jest.mock('../../hooks/AxiosInstance.tsx');
jest.mock('react-toastify');

describe('ChangePassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders ChangePassword component', async () => {
    await act(async () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
    })
    expect(screen.getByText('RESET PASSWORD')).toBeInTheDocument();
    expect(screen.getByText('Set a new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  test('validates password input', async () => {

        render(
          <BrowserRouter>
            <ChangePassword />
          </BrowserRouter>
        );

    
    const passwordInput = screen.getByPlaceholderText('Enter new password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    expect(submitButton).not.toBeDisabled();

    await act(async () => {
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);

    })

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least 6 characters')).toBeInTheDocument();
    });

    await act(async () => {
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.blur(passwordInput);
    })

    await waitFor(() => {
      expect(screen.queryByText('Password must contain at least 6 characters')).not.toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('handles password change successfully', async () => {
    const mockAxiosPost = jest.fn().mockResolvedValue({
      status: 200,
      data: { message: 'Password changed successfully' },
    });
    (axiosClient as jest.Mock).mockReturnValue({ post: mockAxiosPost });

        render(
          <BrowserRouter>
            <ChangePassword />
          </BrowserRouter>
        );

    const passwordInput = screen.getByPlaceholderText('Enter new password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);
    })

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith('/users/reset/password/test-token', {
        password: 'newpassword123',
      });
      expect(toast).toHaveBeenCalledWith('Password changed successfully');
    });
  });

  test('handles password change error', async () => {
    const mockAxiosPost = jest.fn().mockRejectedValue({
      response: { data: { message: 'Password change failed' } },
    });
    (axiosClient as jest.Mock).mockReturnValue({ post: mockAxiosPost });

    
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Enter new password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    await act(async () => {
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);
    })

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith('/users/reset/password/test-token', {
        password: 'newpassword123',
      });
      expect(toast).toHaveBeenCalledWith('Password change failed');
    });
  });
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ token: 'test-token' }),
  }));
  
  jest.mock('../../hooks/AxiosInstance')

  describe('ChangePassword Component - Navigation Tests', () => {
    let mockNavigate: jest.Mock;
  
    beforeEach(() => {
      jest.useFakeTimers();
      mockNavigate = jest.fn();
      (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      (reactRouterDom.useParams as jest.Mock).mockReturnValue({ token: 'mock-token' });
      
    });
  
    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
    });
  
    test('should navigate to login after password changed', async () => {
      const mockResponse = {
        status: 200,
        data: {
          message: 'Password changed successfully',
        },
      };
      (axiosClient as jest.Mock).mockReturnValue({ post: jest.fn().mockResolvedValue(mockResponse) });
  
      render(
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      );
  
      const passwordInput = screen.getByPlaceholderText('Enter new password');
      const submitButton = screen.getByRole('button', { name: 'Reset Password' });
  
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
        fireEvent.click(submitButton);
      });
  
      act(() => {
        jest.advanceTimersByTime(2500);
      });
  
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });