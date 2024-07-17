// Navbar.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Navbar from "../components/Navbar";
import "@testing-library/jest-dom";
import { getDashboardLink } from "../components/Navbar";

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
      notifications: {
    unreadCount: 5,
    isOpen: false,
    notifications: [
      {
        id: 1,
        message: "New product available",
        timestamp: "2024-07-18T10:00:00Z",
        isRead: false
      },
      {
        id: 2,
        message: "Your order has been shipped",
        timestamp: "2024-07-17T15:30:00Z",
        isRead: true
      },
    ]
  }
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
describe("Navbar Component Additional Tests", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: true, authRole: "user" },
      chat: { unreadMessagesCount: 2 },
      cart: { count: 3 },
      wishList: { count: 1 },
    });
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  test("renders wishlist link when logged in", () => {
    renderWithRouter(<Navbar />);
    const wishlistLink = screen.getByLabelText("Heart");
    expect(wishlistLink).toBeInTheDocument();
    expect(wishlistLink.closest('a')).toHaveAttribute("href", "/wishList");
  });

  test("renders cart link with correct count when logged in", () => {
    renderWithRouter(<Navbar />);
    const cartLink = screen.getByLabelText("Cart");
    expect(cartLink).toBeInTheDocument();
    expect(cartLink.closest('a')).toHaveAttribute("href", "/cart");
    const cartCount = screen.getByText("3");
    expect(cartCount).toBeInTheDocument();
  });

  test("renders orders link when logged in", () => {
    renderWithRouter(<Navbar />);
    const ordersLink = screen.getByTestId("orders-link");
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute("href", "/orders");
  });

  test("renders burger menu on mobile when logged in", () => {
    renderWithRouter(<Navbar />);
    const burgerButton = screen.getByTestId("burger-button");
    expect(burgerButton).toBeInTheDocument();
    fireEvent.click(burgerButton);
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
  });

  test("renders dashboard link in mobile menu for seller", () => {
    store = mockStore({
      auth: { isLoggedIn: true, authRole: "seller" },
      chat: { unreadMessagesCount: 0 },
      cart: { count: 0 },
      wishList: { count: 0 },
    });
    renderWithRouter(<Navbar />);
    const burgerButton = screen.getByTestId("burger-button");
    fireEvent.click(burgerButton);
    
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest('a')).toHaveAttribute("href", "/seller");
  });

  test("renders dashboard link in mobile menu for admin", () => {
    store = mockStore({
      auth: { isLoggedIn: true, authRole: "admin" },
      chat: { unreadMessagesCount: 0 },
      cart: { count: 0 },
      wishList: { count: 0 },
    });
    renderWithRouter(<Navbar />);
    const burgerButton = screen.getByTestId("burger-button");
    fireEvent.click(burgerButton);
    
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest('a')).toHaveAttribute("href", "/admin");
  });

  test("renders logout link in mobile menu", () => {
    renderWithRouter(<Navbar />);
    const burgerButton = screen.getByTestId("burger-button");
    fireEvent.click(burgerButton);
    
    const logoutLink = screen.getByText("Logout");
    expect(logoutLink).toBeInTheDocument();
  });

  test("closes mobile menu when a link is clicked", () => {
    renderWithRouter(<Navbar />);
    const burgerButton = screen.getByTestId("burger-button");
    fireEvent.click(burgerButton);
    
    const profileLink = screen.getByText("Profile");
    fireEvent.click(profileLink);
    
    const mobileMenu = screen.queryByTestId("mobile-menu");
    expect(mobileMenu).not.toBeInTheDocument();
  });

test("closes profile modal when close button is clicked", () => {
    renderWithRouter(<Navbar />);
    const profileButton = screen.getByTestId("profile-button");
    fireEvent.click(profileButton);
    const profileModal = screen.getByText("User settings");
    expect(profileModal).toBeInTheDocument();
 const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);
    expect(profileModal).not.toBeInTheDocument();
  });
});
describe("getDashboardLink function", () => {
  test("returns '/seller' for seller role", () => {
    expect(getDashboardLink("seller")).toBe("/seller");
  });

  test("returns '/admin' for admin role", () => {
    expect(getDashboardLink("admin")).toBe("/admin");
  });

  test("returns '/profile' for user role", () => {
    expect(getDashboardLink("user")).toBe("/profile");
  });

  test("returns '/profile' for any other role", () => {
    expect(getDashboardLink("unknown")).toBe("/profile");
  });
});