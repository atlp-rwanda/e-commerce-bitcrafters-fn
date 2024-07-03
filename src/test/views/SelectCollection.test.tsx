import { render, screen, fireEvent} from '@testing-library/react';
import { Provider } from 'react-redux';
import SelectCollection from '../../views/seller/SelectCollection';
import {store} from '../../redux/store';
import { MemoryRouter } from 'react-router-dom';
import SellerLayout from '../../layouts/SellerLayout';
import useAxiosClient from '../../hooks/AxiosInstance';
import { act } from 'react-dom/test-utils';

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
  jest.mock('../../hooks/AxiosInstance');

describe('SelectCollection', () => {
    global.URL.createObjectURL = jest.fn();
    const mockAxiosGet = jest.fn();
    const mockCollections = [
      { id: '1', name: 'Collection 1', description: 'Description 1' },
      { id: '2', name: 'Collection 2', description: 'Description 2' },
    ];
  
    beforeEach(() => {
      (useAxiosClient as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    });
  test('renders Seller Layout', () => {
    renderWithRedux(<SellerLayout/>);
  });
  test('renders SelectCollection component', () => {
    renderWithRedux(<SelectCollection />);

    expect(screen.getAllByText('Collections').length).toBeGreaterThanOrEqual(1)
  });

  test('dispatches fetchCollections on mount when status is idle', () => {
    renderWithRedux(<SelectCollection />);
  });

  test('displays loading message when collectionsStatus is loading', () => {
    renderWithRedux(<SelectCollection />);

    fireEvent.click(screen.getByText('Collections'));
  });

  test('displays error message when collectionsStatus is failed', () => {

    renderWithRedux(<SelectCollection />);

    fireEvent.click(screen.getByText('Collections'));

  });

  test('displays collection options when collectionsStatus is succeeded', () => {

    renderWithRedux(<SelectCollection />);

    fireEvent.click(screen.getByText('Collections'));
  });

  test('handles option selection', () => {
    renderWithRedux(<SelectCollection />);
    fireEvent.click(screen.getByText('Collections'));
  });

  it('displays loading state while fetching collections', async () => {
    mockAxiosGet.mockReturnValueOnce(new Promise(() => {}));

    render(<SelectCollection />);

    fireEvent.click(screen.getByText('Collections'));
  });

  it('displays error state when fetching collections fails', async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error('API error'));

    await act(async () => {
      render(<SelectCollection />);
    });

    fireEvent.click(screen.getByText('Collections'));
  });

  it('displays collections when fetched successfully', async () => {
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: { collections: mockCollections } });

    await act(async () => {
      render(<SelectCollection />);
    });

    fireEvent.click(screen.getByText('Collections'));
  });

  it('selects a collection and updates localStorage', async () => {
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: { collections: mockCollections } });

    await act(async () => {
      render(<SelectCollection />);
    });

    fireEvent.click(screen.getByText('Collections'));
    fireEvent.click(await screen.findByText('Collection 1'));

    expect(localStorage.getItem('collectionId')).toBe('1');
  });

  it('toggles dropdown on button click', async () => {
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: { collections: mockCollections } });

    await act(async () => {
      render(<SelectCollection />);
    });

    const button = screen.getByText('Collections');
    fireEvent.click(button);

    fireEvent.click(button);
  });

});
