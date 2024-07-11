import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckoutPage from '../../views/CheckoutPage';

describe('CheckoutPage Component', () => {
  it('renders without crashing', () => {
    render(<CheckoutPage />);
  });

  it('displays the "Checkout Page" text', () => {
    render(<CheckoutPage />);
    expect(screen.getByText('Checkout Page')).toBeInTheDocument();
  });

  it('has the correct container class', () => {
    render(<CheckoutPage />);
    const container = screen.getByText('Checkout Page').parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('m-3');
    expect(container).toHaveClass('tablet:m-5');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('space-x-2');
    expect(container).toHaveClass('items-start');
    expect(container).toHaveClass('justify-start');
    expect(container).toHaveClass('tablet:min-h-[100vh]');
    expect(container).toHaveClass('tablet:px-10');
    expect(container).toHaveClass('w-full');
  });
});