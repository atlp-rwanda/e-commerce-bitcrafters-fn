// PublicRoute.test.tsx
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import PublicRoute, { PrivateRoute } from "../../components/PublicRoute";
import { toast } from 'react-toastify';

// Mock the toast module
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Create mock store
const mockStore = configureStore([]);
const initialState = {
  auth: {
    isLoggedIn: false,
  },
};

describe("Route Components", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it("renders PublicRoute correctly when not logged in", () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <PublicRoute />
        </BrowserRouter>
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("redirects to home page when logged in on PublicRoute", () => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <PublicRoute />
        </BrowserRouter>
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders PrivateRoute correctly when logged in", () => {
    store = mockStore({
      auth: {
        isLoggedIn: true,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute />
        </BrowserRouter>
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("redirects to login page and shows toast when not logged in on PrivateRoute", () => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute />
        </BrowserRouter>
      </Provider>
    );

    expect(toast.error).toHaveBeenCalledWith("Please Login");
    expect(container).toMatchSnapshot();
  });
});
