import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../../views/Home.tsx';
import axiosClient from '../../hooks/AxiosInstance.tsx';
import { AxiosInstance } from 'axios';

jest.mock('../../hooks/AxiosInstance.tsx');

jest.mock('../../components/SectionHeader.tsx', () => () => <div data-testid="section-header" />);
jest.mock('../../components/MainProductCard.tsx', () => () => <div data-testid="main-product-card" />);
jest.mock('../../components/Button.tsx', () => () => <div data-testid="button" />);
jest.mock('../../components/servicesSection.tsx', () => () => <div data-testid="services-section" />);
jest.mock('../../components/CollectionCard.tsx', () => () => <div data-testid="collection-card" />);

describe('Home Component', () => {
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({
        data: {
          products: [
            {
              id: '1',
              images: ['image1.jpg'],
              name: 'Test Product',
              price: '10.00',
              discount: '9.00',
              description: 'Test description',
              rating: '4.5'
            }
          ]
        }
      }),
    } as unknown as jest.Mocked<AxiosInstance>;

    (axiosClient as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  it('fetches and displays products', async () => {
    await act(async () => {
      render(
        <Router>
          <Home />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('main-product-card')).toHaveLength(3); // 1 for new arrivals, 1 for featured
    });
  });

  it('displays loading state while fetching products', async () => {
    mockAxiosInstance.get.mockReturnValue(new Promise(() => {})); // Never resolves to simulate loading

    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getAllByText('Loading...')).toHaveLength(3); // One for new arrivals, one for featured
  });

  it('renders all sections', async () => {
    await act(async () => {
      render(
        <Router>
          <Home />
        </Router>
      );
    });

    expect(screen.getAllByTestId('section-header')).toHaveLength(5); // New Arrival, Categories, Featured Products, Promotion
    expect(screen.getByText('For a limited time only')).toBeInTheDocument(); // Promotion section
    expect(screen.getByTestId('services-section')).toBeInTheDocument();
  });

  it('updates product pages every 60 seconds', async () => {
    jest.useFakeTimers();

    await act(async () => {
      render(
        <Router>
          <Home />
        </Router>
      );
    });

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/products/all?page=1');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/products/all?page=2');

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/products/all?page=2');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/products/all?page=3');
    });

    jest.useRealTimers();
  });
});
