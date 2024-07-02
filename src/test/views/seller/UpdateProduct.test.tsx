import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import UpdateProductForm from '../../../views/seller/UpdateProductForm';
import { store } from '../../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import "@testing-library/jest-dom";

var mockGet = jest.fn();
var mockPut = jest.fn();
var mockPost = jest.fn();
var mockDelete = jest.fn();

jest.mock('../../../hooks/AxiosInstance', () => ({
  __esModule: true,
  default: () => ({
    get: mockGet,
    put: mockPut,
    post: mockPost,
    delete: mockDelete,
  }),
}));
jest.mock('axios');
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



jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '1' }),
}));

describe('UpdateProductForm', () => {
  global.URL.createObjectURL = jest.fn();
  beforeEach(() => {
    mockGet.mockResolvedValue({
      data: {
        item: {
          id: '1',
          name: 'Test Product',
          price: 50,
          category: 'Food',
          bonus: 10,
          sku: 'ABC123',
          quantity: 20,
          expiryDate: '2024-12-31T00:00:00.000Z',
          images: ['image1.jpg', 'image2.jpg'],
        },
      },
    });
  });


  
test('displays validation errors on form submission with invalid data', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm/>);
    });

    const updateButton = screen.getByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);
  });

  test('adds and removes images correctly', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm/>);
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file] },
    });

    expect((await screen.findAllByRole('img')).length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getAllByText('X')[0]);
  });



  test('handles form submission error', async () => {
    mockPut.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    fireEvent.change(screen.getByLabelText('Product name'), {
      target: { value: 'Updated Product' },
    });

    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '60' },
    });

    fireEvent.change(screen.getByLabelText('Bonus'), {
      target: { value: '15' },
    });

    fireEvent.change(screen.getByLabelText('Quantity'), {
      target: { value: '25' },
    });

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Description' },
    });

    fireEvent.change(screen.getByLabelText('Expiry Date'), {
      target: { value: '2024-12-31' },
    });

    fireEvent.change(screen.getByLabelText('SKU'), {
      target: { value: 'UPDATED123' },
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled;
    });
  });

  

  test('validates image count', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please upload images between 4 and 8');
    });
  });

  test('validates SKU format', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm/>);
    });

    fireEvent.change(screen.getByLabelText('SKU'), {
      target: { value: 'invalid sku' },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getAllByText('SKU must be alphanumeric').length).toBeGreaterThanOrEqual(1);
    });
  });
  test('updateImages function handles successful image update', async () => {
    mockPost.mockResolvedValue({ status: 200 });
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file, file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);
  });

  test('updateImages function handles image update error', async () => {
    mockPost.mockRejectedValue(new Error('Image update failed'));

    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file, file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled;
    });
  });

  test('handleSubmit function processes form submission correctly', async () => {
    mockPut.mockResolvedValue({ status: 200 });
    mockPost.mockResolvedValue({ status: 200 });

    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'New Product' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '100' } });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file, file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Product updated successfully");
      expect(mockPut).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalled();
    });
  });

  test('onFileChange function adds new files correctly', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file1 = new File(['image1.jpg'], 'image1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['image2.jpg'], 'image2.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file1] },
    });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file2] },
    });

    const thumbnails = await screen.findAllByAltText(/Thumbnail/);
    expect(thumbnails.length).toBe(4);
  });

  test('onRemoveImage function removes selected image', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file1 = new File(['image1.jpg'], 'image1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['image2.jpg'], 'image2.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file1, file2] },
    });

    let thumbnails = await screen.findAllByAltText(/Thumbnail/);
    expect(thumbnails.length).toBe(4);

    const removeButtons = screen.getAllByText('X');
    fireEvent.click(removeButtons[0]);

    thumbnails = await screen.findAllByAltText(/Thumbnail/);
    expect(thumbnails.length).toBe(3);
  });

  test('validateImages function returns correct validation result', async () => {
    await act(async () => {
      renderWithRedux(<UpdateProductForm />);
    });

    const file = new File(['image.jpg'], 'image.jpg', { type: 'image/jpeg' });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file] },
    });

    const updateButton = await screen.findByRole('button', { name: 'Update Product' });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please upload images between 4 and 8');
    });

    fireEvent.change(screen.getByLabelText('Choose Images'), {
      target: { files: [file, file, file, file] },
    });

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled;
    });
  });
  test('onDeleteImage function deletes image correctly', async () => {
    mockDelete.mockResolvedValueOnce({ status: 200 });
    mockGet.mockResolvedValueOnce({ 
      data: { 
        item: {
          images: ['image1.jpg', 'image2.jpg']
        } 
      } 
    });

    render(<UpdateProductForm />);

    await screen.findByText('Current Images');

    const deleteButtons = screen.getAllByRole('button', { name: "" });
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    expect(mockDelete).toHaveBeenCalledWith('/collections/product/1/images', {
      data: { images: [] }
    });

    expect(toast.success).toHaveBeenCalledWith("image deleted");
    expect(mockGet).toHaveBeenCalledWith('/collections/product/1');

    mockDelete.mockRejectedValueOnce(new Error('Delete failed'));

    await act(async () => {
      fireEvent.click(deleteButtons[1]);
    });

    expect(toast.error).toHaveBeenCalledWith("failed to delete image");
  });
});
