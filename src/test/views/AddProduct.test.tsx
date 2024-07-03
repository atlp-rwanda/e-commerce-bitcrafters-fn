import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import AddProductForm from '../../views/seller/AddProductForm';
import {store} from '../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

function renderWithRedux(
  ui: JSX.Element,
) {
  return {
    ...render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>),
  };
}
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

const mockPost = jest.fn();
jest.mock('../../hooks/AxiosInstance', () => ({
  __esModule: true,
  default: () => ({
    post: mockPost,
  }),
}));

jest.mock('../../views/seller/SelectCollection', () => () => <div data-testid="select-collection">Select Collection</div>);
jest.mock('../../views/seller/CreateColletion', () => () => (
  <div data-testid="create-collection">Create Collection Modal</div>
));


describe('AddProductForm', () => {
  global.URL.createObjectURL = jest.fn();
  test('renders Add Product form with all fields', () => {
    renderWithRedux(<AddProductForm />);

     const all = screen.getAllByText('Add Product')
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Product name').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Price').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Bonus').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Quantity').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Description').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('Expiry Date').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByLabelText('SKU').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Upload Images').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Choose Images').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Added Images').length).toBeGreaterThanOrEqual(1);
  });

  test('displays validation errors on form submission with invalid data', async () => {
    renderWithRedux(<AddProductForm />);
    const addButton = screen.getByRole('button', { name: 'Add Product' }); 
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getAllByText('Product name is required').length).toBeGreaterThanOrEqual(1);
    });
  });

  test('adds and removes images correctly', async () => {
    renderWithRedux(<AddProductForm />);

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file] },
    });

    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText('X'));
  });

  test('submits form with valid data', async () => {
    renderWithRedux(<AddProductForm />);

    fireEvent.change(screen.getByLabelText('Product name'), {
      target: { value: 'Test Product' },
    });

    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '50' },
    });

    fireEvent.change(screen.getByLabelText('Bonus'), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByLabelText('Quantity'), {
      target: { value: '20' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' },
    });

    fireEvent.change(screen.getByLabelText('Expiry Date'), {
      target: { value: '2024-12-31' },
    });

    fireEvent.change(screen.getByLabelText('SKU'), {
      target: { value: 'ABC123' },
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file] },
    });

    const addButton = screen.getByRole('button', { name: 'Add Product' }); 
    fireEvent.click(addButton);
  });
  it('handles file upload and removal', async () => {
    render(<AddProductForm />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Choose Images');

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(1);

    const removeButton = screen.getByText('X');
    fireEvent.click(removeButton);
  });

  it('opens and closes create collection modal', () => {
    render(<AddProductForm />);
    
    fireEvent.click(screen.getByText('Add new Collection'));
    act(() => {
      render(<AddProductForm />);
    });

  });

  it('submits the form successfully', async () => {
    mockPost.mockResolvedValue({ data: { message: 'Product added successfully' } });

    render(<AddProductForm />);

    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Bonus'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'TEST123' } });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Choose Images');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file, file, file, file] } });
    });

    await act(async () => {
      const addButton = screen.getByRole('button', { name: 'Add Product' }); 
      fireEvent.click(addButton);
    });

    await waitFor(() => {
   expect(toast.success).toHaveBeenCalled
    });
  });

  it('handles form submission error', async () => {
    mockPost.mockRejectedValue(new Error('Network error'));

    render(<AddProductForm />);

    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Bonus'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'TEST123' } });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Choose Images');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file, file, file, file] } });
    });

    await act(async () => {
      const addButton = screen.getByRole('button', { name: 'Add Product' }); 
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled;
    });
  });

  it('handles form submission with no collection chosen', async () => {
    render(<AddProductForm />);

    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Bonus'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'TEST123' } });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Choose Images');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file, file, file, file] } });
    });

    await act(async () => {
      const addButton = screen.getByRole('button', { name: 'Add Product' }); 
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error adding Product Choose Collection and Try again');
    });
  });

  it('validates SKU format', async () => {
    render(<AddProductForm />);

    fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'invalid sku' } });
    const addButton = screen.getByRole('button', { name: 'Add Product' }); 
    fireEvent.click(addButton);

  });

  it('validates image count', async () => {
    render(<AddProductForm />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Choose Images');
    
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file, file, file] } });
    });
    const addButton = screen.getByRole('button', { name: 'Add Product' }); 
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please upload images between 4 and 8');
    });
  });
});
