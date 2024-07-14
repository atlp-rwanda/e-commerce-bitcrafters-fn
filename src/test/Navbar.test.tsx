// Navbar.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Navbar from "../components/Navbar";
import "@testing-library/jest-dom";

const mockStore = configureStore([]);

jest.mock("../assets/images/Bit.Shop.svg", () => "mocked-logo.svg");

describe("Navbar Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: false },
      chat: { unreadMessagesCount: 0 },
      cart: { count: 0 },
      wishList: { count: 0 },
    });
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  test("renders logo", () => {
    renderWithRouter(<Navbar />);
    const logoElement = screen.getByAltText("Logo");
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute("src", "mocked-logo.svg");
  });

  test("renders navigation links on desktop", () => {
    renderWithRouter(<Navbar />);
    const homeLink = screen.getByText("Home");
    const aboutLink = screen.getByText("About");
    const shopLink = screen.getByText("Shop");
    const contactLink = screen.getByText("Contact");

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(shopLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  test("renders login button when not logged in", () => {
    renderWithRouter(<Navbar />);
    const loginButtons = screen.getAllByText("Log in");
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  test("renders search container", () => {
    renderWithRouter(<Navbar />);
    const searchContainer = screen.getByText("search here");
    expect(searchContainer).toBeInTheDocument();
  });

  test("toggles search component when search icon is clicked", () => {
    renderWithRouter(<Navbar />);
    const searchIcon = screen.getAllByRole('img', { hidden: true })[0];
    fireEvent.click(searchIcon);
    const searchContainer = screen.getByText("search here");
    expect(searchContainer).toBeInTheDocument();
  });

test("renders user icons when logged in", () => {
  store = mockStore({
    auth: { isLoggedIn: true },
    chat: { unreadMessagesCount: 0 },
    cart: { count: 2 },
    wishList: { count: 1 },
  });

  renderWithRouter(<Navbar />);

  const heartIcon = screen.getByLabelText('Heart');
  expect(heartIcon).toBeInTheDocument();
  const  cartIcon = screen.getByLabelText('Cart');
  expect(cartIcon).toBeInTheDocument();
});

test("opens chat when chat button is clicked", () => {
  store = mockStore({
    auth: { isLoggedIn: true },
    chat: { unreadMessagesCount: 0 },
    cart: { count: 0 },
    wishList: { count: 0 },
  });

  renderWithRouter(<Navbar />);

  const chatButton = screen.getByTestId("chat-button");
  fireEvent.click(chatButton);

  const chatContainer = screen.getByTestId("chat-container");
  expect(chatContainer).toBeInTheDocument();
});
});