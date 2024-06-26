import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViewProducts from '../../../views/seller/viewProduct';
import axiosClient from '../../../hooks/AxiosInstance';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/AxiosInstance');
jest.mock('react-toastify');

const mockedAxiosClient = axiosClient as jest.MockedFunction<typeof axiosClient>;
const mockedToast = toast as jest.MockedFunction<typeof toast>;

const mockClient = {
  get: jest.fn(),
  delete: jest.fn(),
};

describe('ViewProducts', () => {
  beforeEach(() => {
    mockedAxiosClient.mockReturnValue(mockClient as any);
    mockClient.get.mockClear();
    mockedToast.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ViewProducts />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Select Collection:')).toBeInTheDocument();
  });

  it('fetches and displays products when a collection is selected', async () => {
  mockClient.get.mockImplementation((url: string) => {
    if (url === '/collections') {
      return Promise.resolve({
        data: {
          collections: [
            { id: '1', name: 'Collection 1' },
          ],
        },
      });
    }
    if (url === '/collections/1/products?page=1') {
      return Promise.resolve({
        data: {
          products: [
            {
              id: '1',
              name: 'Product 1',
              category: 'Category 1',
              price: 100,
              images: [],
              quantity: 10,
              status: 'available',
              expiryDate: '2024-12-31T00:00:00.000Z',
            },
          ],
          pagination: { totalPages: 1 },
        },
      });
    }
    return Promise.reject(new Error('not found'));
  });

  render(
    <MemoryRouter>
      <ViewProducts />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByLabelText('Select Collection:')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });

  await waitFor(() => {
    const priceElements = screen.queryAllByText('100 Rwf');
    expect(priceElements.length).toBeGreaterThan(0);
    expect(priceElements[0]).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  }, { timeout: 5000 });
});

  it('displays loading state while fetching products', async () => {
    mockClient.get.mockImplementation((url) => {
      if (url === '/collections') {
        return Promise.resolve({
          data: {
            collections: [{ id: '1', name: 'Collection 1' }],
          },
        });
      }
      if (url === '/collections/1/products?page=1') {
        return new Promise(resolve => setTimeout(() => resolve({
          data: {
            products: [
              {
                id: '1',
                name: 'Product 1',
                category: 'Category 1',
                price: 100,
                images: [],
                quantity: 10,
                status: 'available',
                expiryDate: '2024-12-31T00:00:00.000Z',
              },
            ],
            pagination: { totalPages: 1 },
          },
        }), 100));
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter>
        <ViewProducts />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Collection 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  });

  it('enables and handles next button when not on last page', async () => {
  mockClient.get.mockImplementation((url) => {
    if (url === '/collections') {
      return Promise.resolve({
        data: {
          collections: [{ id: '1', name: 'Collection 1' }],
        },
      });
    }
    if (url === '/collections/1/products?page=1') {
      return Promise.resolve({
        data: {
          products: [{
            id: '1',
            name: 'Product 1',
            category: 'Category 1',
            price: 100,
            images: [],
            quantity: 10,
            status: 'available',
            expiryDate: '2024-12-31T00:00:00.000Z',
          }],
          pagination: { totalPages: 2 },
        },
      });
    }
    if (url === '/collections/1/products?page=2') {
      return Promise.resolve({
        data: {
          products: [{
            id: '2',
            name: 'Product 2',
            category: 'Category 2',
            price: 200,
            images: [],
            quantity: 20,
            status: 'available',
            expiryDate: '2025-12-31T00:00:00.000Z',
          }],
          pagination: { totalPages: 2 },
        },
      });
    }
    return Promise.reject(new Error('not found'));
  });

  render(
    <MemoryRouter>
      <ViewProducts />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Collection 1')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  const nextButton = screen.getByRole('button', { name: 'Next' });
  expect(nextButton).not.toBeDisabled();

  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});

it('enables and handles previous button when not on first page', async () => {
  mockClient.get.mockImplementation((url) => {
    if (url === '/collections') {
      return Promise.resolve({
        data: {
          collections: [{ id: '1', name: 'Collection 1' }],
        },
      });
    }
    if (url === '/collections/1/products?page=1') {
      return Promise.resolve({
        data: {
          products: [{
            id: '1',
            name: 'Product 1',
            category: 'Category 1',
            price: 100,
            images: [],
            quantity: 10,
            status: 'available',
            expiryDate: '2024-12-31T00:00:00.000Z',
          }],
          pagination: { totalPages: 2 },
        },
      });
    }
    if (url === '/collections/1/products?page=2') {
      return Promise.resolve({
        data: {
          products: [{
            id: '2',
            name: 'Product 2',
            category: 'Category 2',
            price: 200,
            images: [],
            quantity: 20,
            status: 'available',
            expiryDate: '2025-12-31T00:00:00.000Z',
          }],
          pagination: { totalPages: 2 },
        },
      });
    }
    return Promise.reject(new Error('not found'));
  });

  render(
    <MemoryRouter>
      <ViewProducts />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Collection 1')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  const nextButton = screen.getByRole('button', { name: 'Next' });
  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  const prevButton = screen.getByRole('button', { name: 'Previous' });
  expect(prevButton).not.toBeDisabled();

  fireEvent.click(prevButton);

  await waitFor(() => {
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});

  it('displays product images', async () => {
    mockClient.get.mockImplementation((url) => {
      if (url === '/collections') {
        return Promise.resolve({
          data: {
            collections: [{ id: '1', name: 'Collection 1' }],
          },
        });
      }
      if (url === '/collections/1/products?page=1') {
        return Promise.resolve({
          data: {
            products: [
              {
                id: '1',
                name: 'Product 1',
                category: 'Category 1',
                price: 100,
                images: ['image1.jpg', 'image2.jpg'],
                quantity: 10,
                status: 'available',
                expiryDate: '2024-12-31T00:00:00.000Z',
              },
            ],
            pagination: { totalPages: 1 },
          },
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(
      <MemoryRouter>
        <ViewProducts />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Collection 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'image1.jpg');
      expect(images[1]).toHaveAttribute('src', 'image2.jpg');
    });
  });
  it('handles product deletion correctly', async () => {
    const mockCollections = [{ id: '1', name: 'Collection 1' }];
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100, quantity: 10, expiryDate: '2023-12-31', images: ['image1.jpg'] },
      { id: '2', name: 'Product 2', price: 200, quantity: 20, expiryDate: '2023-12-31', images: ['image2.jpg'] },
    ];
  
    mockClient.get.mockImplementation((url) => {
      if (url === '/collections') {
        return Promise.resolve({ data: { collections: mockCollections } });
      } else if (url.includes('/collections/1/products')) {
        return Promise.resolve({
          data: {
            products: mockProducts,
            pagination: { totalPages: 1 }
          }
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  
    mockClient.delete.mockResolvedValueOnce({});
  
    const { container } = render(
      <MemoryRouter>
        <ViewProducts />
      </MemoryRouter>
    );
  
    
    await waitFor(() => {
      expect(screen.getByText('Collection 1')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });
  
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  

    console.log(container.innerHTML);
  
    const deleteButtons = screen.getAllByLabelText('delete');
    expect(deleteButtons).toHaveLength(2); 
    fireEvent.click(deleteButtons[0]);
  
    await waitFor(() => {
      expect(mockClient.delete).toHaveBeenCalledWith('/collections/products/1');
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(mockedToast).toHaveBeenCalledWith('Product deleted successfully');
    });
  });
  it('handles product deletion error', async () => {
    const mockCollections = [{ id: '1', name: 'Collection 1' }];
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100, quantity: 10, expiryDate: '2023-12-31', images: ['image1.jpg'] },
    ];
  
    
    mockClient.get.mockImplementation((url) => {
      if (url === '/collections') {
        return Promise.resolve({ data: { collections: mockCollections } });
      } else if (url.includes('/collections/1/products')) {
        return Promise.resolve({ 
          data: { 
            products: mockProducts, 
            pagination: { totalPages: 1 } 
          } 
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  
    mockClient.delete.mockRejectedValueOnce({ response: { data: { message: 'Error deleting product' } } });
  
    render(
      <MemoryRouter>
        <ViewProducts />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Collection 1')).toBeInTheDocument();
    });
  
    
    fireEvent.change(screen.getByLabelText('Select Collection:'), { target: { value: '1' } });
  
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  
    const deleteButton = screen.getByLabelText('delete');
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(mockClient.delete).toHaveBeenCalledWith('/collections/products/1');
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(mockedToast).toHaveBeenCalledWith('Error deleting product');
    });
  });
});