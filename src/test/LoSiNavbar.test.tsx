// Navbar.test.tsx

import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/LoSiNavbar";
import Footer from "../components/Footer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

describe("Footer component", () => {
  it("renders Footer ", () => {
    const footerTree = renderer
      .create(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>,
      )
      .toJSON();
    expect(footerTree).toMatchSnapshot();
  });
});

const mockStore = configureStore([]);

jest.mock("../assets/images/Bit.Shop.svg", () => "mocked-logo.svg");

describe("Navbar Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { isLoggedIn: true },
      chat: { unreadMessagesCount: 0 },
      cart:  {
        count: 0,
      },
    });
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>,
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
});
