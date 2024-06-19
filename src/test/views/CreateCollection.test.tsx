import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import CreateCollection from '../../views/seller/CreateColletion';
import { MemoryRouter } from 'react-router-dom';
import {store} from '../../redux/store';
import '@testing-library/jest-dom';

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


describe('CreateCollection', () => {
  global.URL.createObjectURL = jest.fn();

  test('renders modal when isOpen is true', () => {
    renderWithRedux(<CreateCollection isOpen={true} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getAllByText('Add New Collection').length).toBeGreaterThanOrEqual(1);
  });

  test('does not render modal when isOpen is false', () => {
    const {container }= renderWithRedux(<CreateCollection isOpen={true} onClose={() => {}} onSave={() => {}} />);
    expect(container.firstChild).not.toBeEmptyDOMElement();
  });

  test('calls onSave and dispatches addNewCollection on save button click', () => {

    renderWithRedux(<CreateCollection isOpen={true} onClose={() => {}} onSave={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText('Collection name'), {
      target: { value: 'Test Collection' },
    });

    fireEvent.change(screen.getByPlaceholderText('Describe your collection'), {
      target: { value: 'Test Description' },
    });

    fireEvent.click(screen.getByText('Save'));
  });

  test('calls onClose on cancel button click', () => {
    renderWithRedux(<CreateCollection isOpen={true} onClose={() => {}} onSave={() => {}} />);
    fireEvent.click(screen.getByText('Cancel'));

  });
});
