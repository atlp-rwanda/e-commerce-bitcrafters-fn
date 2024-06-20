// Navbar.test.tsx

import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BrowserRouter} from "react-router-dom";
import '@testing-library/jest-dom';

describe('Navbar component', () => {
it('renders Navbar correctly', () => {
  const NavBarTree = renderer
    .create(
          <BrowserRouter>
        <Navbar />
      </BrowserRouter>
  )
    .toJSON();
  expect(NavBarTree).toMatchSnapshot();
});

it('renders Footer correctly', () => {
  const footerTree = renderer
    .create(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
  )
    .toJSON();
  expect(footerTree).toMatchSnapshot();
});



  test('toggles burger menu on button click', () => {
    render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
    );

    const burgerButton = screen.getByRole('button');
    expect(burgerButton).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument(); 

    fireEvent.click(burgerButton);

    expect(screen.getByText('Logout')).toBeInTheDocument(); 
  });

  test('renders mobile menu conditionally', () => {
    render(
      <BrowserRouter>
     <Navbar burgerShown={true} />
    </BrowserRouter>
    ); 
  
    expect(screen.getByText('Logout')).toBeInTheDocument(); 
  
    render(
      <BrowserRouter>
      <Navbar burgerShown={false} />
     </BrowserRouter>
    ); 
  
    expect(screen.queryByText('Logout')).toBeInTheDocument(); 
  });
});