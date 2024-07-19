import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchComponent from '../../components/SearchComponent';
import axiosClient from '../../hooks/AxiosInstance';
import { BrowserRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';


jest.mock("../../hooks/AxiosInstance");
jest.mock('react-toastify');
jest.mock('lodash/debounce', () => {
  return jest.fn((fn) => {
    const debouncedFn = jest.fn(fn) as unknown as any;;
    debouncedFn.cancel  = jest.fn() 
    return debouncedFn;
  });
});

const mockedDebounce = debounce as jest.MockedFunction<typeof debounce>;

describe('SearchComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search component', () => {
    render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );
    expect(screen.getByText('Search Here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('search here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimum price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Maximum price')).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );
    
    const queryInput = screen.getByPlaceholderText('search here');
    const minPriceInput = screen.getByPlaceholderText('Minimum price');
    const maxPriceInput = screen.getByPlaceholderText('Maximum price');

    fireEvent.change(queryInput, { target: { value: 'test query' } });
    fireEvent.change(minPriceInput, { target: { value: '10' } });
    fireEvent.change(maxPriceInput, { target: { value: '100' } });

    expect(queryInput).toHaveValue('test query');
    expect(minPriceInput).toHaveValue(10);
    expect(maxPriceInput).toHaveValue(100);
  });

  it('calls the API with correct parameters when inputs change', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      status: 200,
      data: { items: [] }
    });
    (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);


    render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );

    const queryInput = screen.getByPlaceholderText('search here');
    fireEvent.change(queryInput, { target: { value: 'test query' } });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('collections/products/all/search', {
        params: {
          query: 'test query',
          minPrice: '',
          maxPrice: '',
        }
      });
    });
  });

  it('displays products when API returns results', async () => {
    const mockProducts = [
      { name: 'Product 1', price: 50, category: 'Category 1', images: ['image1.jpg'] },
      { name: 'Product 2', price: 100, category: 'Category 2', images: ['image2.jpg'] },
    ];

    const mockGet = jest.fn().mockResolvedValue({
      status: 200,
      data: { items: mockProducts }
    });
        (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);

    render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );

    const queryInput = screen.getByPlaceholderText('search here');
    fireEvent.change(queryInput, { target: { value: 'test query' } });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('debounces the search function', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      status: 200,
      data: { items: [] }
    });
    (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);

    render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );

    const queryInput = screen.getByPlaceholderText('search here');
    
    act(() => {
      fireEvent.change(queryInput, { target: { value: 't' } });
      fireEvent.change(queryInput, { target: { value: 'te' } });
      fireEvent.change(queryInput, { target: { value: 'tes' } });
      fireEvent.change(queryInput, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(mockedDebounce).toHaveBeenCalled;
      expect(mockGet).toHaveBeenCalled;
      expect(mockGet).toHaveBeenCalledWith('collections/products/all/search', {
        params: {
          query: 'test',
          minPrice: '',
          maxPrice: '',
        }
      });
    });
  });

  it('cancels the debounced search on unmount', () => {
    const { unmount } = render(
      <BrowserRouter>
        <SearchComponent />
      </BrowserRouter>
    );

    unmount();

    expect(mockedDebounce.mock.results[0].value.cancel).toHaveBeenCalled();
  });

  describe('SearchComponent - No Products Found', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  

  
    it('clears searched products when no results are found', async () => {
      const mockGet = jest.fn()
        .mockResolvedValueOnce({
          status: 200,
          data: { items: [{ name: 'Initial Product', price: 100, category: 'Test', images: ['image.jpg'] }] }
        })
        .mockResolvedValueOnce({
          status: 204,
          data: { items: [] }
        });
      (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);
  
      render(
        <BrowserRouter>
          <SearchComponent />
        </BrowserRouter>
      );
  
      const queryInput = screen.getByPlaceholderText('search here');
      
      fireEvent.change(queryInput, { target: { value: 'initial' } });
      
      await waitFor(() => {
        expect(screen.getByText('Initial Product')).toBeInTheDocument();
      });
  
      fireEvent.change(queryInput, { target: { value: 'nonexistent' } });
  
      await waitFor(() => {
        expect(screen.queryByText('Initial Product')).not.toBeInTheDocument();
      });
    });
  
    it('handles different price ranges with no results', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        status: 204,
        data: { items: [] }
      });
      (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);
  
      render(
        <BrowserRouter>
          <SearchComponent />
        </BrowserRouter>
      );
  
      const minPriceInput = screen.getByPlaceholderText('Minimum price');
      const maxPriceInput = screen.getByPlaceholderText('Maximum price');
  
      fireEvent.change(minPriceInput, { target: { value: '1000' } });
      fireEvent.change(maxPriceInput, { target: { value: '2000' } });
  
      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('collections/products/all/search', {
          params: {
            query: '',
            minPrice: '1000',
            maxPrice: '2000',
          }
        });
      });
    });
  
    it('handles API errors when searching', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('API Error'));
      (axiosClient as jest.Mock).mockReturnValue({ get: mockGet } as any);
  
      render(
        <BrowserRouter>
          <SearchComponent />
        </BrowserRouter>
      );
  
      const queryInput = screen.getByPlaceholderText('search here');
      fireEvent.change(queryInput, { target: { value: 'error test' } });
  
      await waitFor(() => {
        
      });
    });
  

})
})