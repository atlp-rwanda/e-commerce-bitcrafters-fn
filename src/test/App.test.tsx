import { render, screen } from "@testing-library/react";
import App from "../App";
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { increment, decrement, incrementByAmount } from '../redux/counter';
import Hello from "../components/Hello"

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

test("Renders the main App component", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Ensure the Counter component is rendering correctly
  expect(screen.getByText("Shop Now")).toBeInTheDocument();
});


describe('counter reducer', () => {
  const initialState = { count: 0 };

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle increment', () => {
    const result = counterReducer(initialState, increment());
    expect(result.count).toEqual(1);
  });

  it('should handle decrement', () => {
    const result = counterReducer(initialState, decrement());
    expect(result.count).toEqual(-1);
  });

  it('should handle incrementByAmount', () => {
    const result = counterReducer(initialState, incrementByAmount(10));
    expect(result.count).toEqual(10);
  });
});


describe("Hello Testing",()=>{

    it("should render Hello ",()=>{
        render(<Hello/>)
        const myElement = screen.getByTestId('test-id');
        expect(myElement).toBeInTheDocument()
      
      })
})

