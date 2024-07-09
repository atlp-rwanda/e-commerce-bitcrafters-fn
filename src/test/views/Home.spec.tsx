import { render, screen} from '@testing-library/react';
import Home from '../../views/Home';
import { BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';



const mockStore = configureStore([]);

describe('Home Page', () => {
    let store: any;
  
    beforeEach(() => {
      store = mockStore({
        auth: { isLoggedIn: false }
      });
    });
  
const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders logo', () => {
    renderWithRouter(<Home />);
    const logoElement = screen.getByAltText('Hero');
    expect(logoElement).toBeInTheDocument();
  });


})