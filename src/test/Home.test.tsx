import { render, fireEvent, waitFor } from "@testing-library/react";
import Home from "../views/Home";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

const mockStore = configureStore([]);

describe("Home Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        authToken: null,
        isLoggedIn: false,
      },
    });
  });

  it("toggles chat when chat button is clicked", async () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByTestId("chat-button")).toBeInTheDocument();
    });
    expect(queryByTestId("chat-container")).toBeNull();
    const chatButton = getByTestId("chat-button");
    fireEvent.click(chatButton);
    await waitFor(() => {
      expect(queryByTestId("chat-container")).toBeInTheDocument();
    });

    fireEvent.click(chatButton);
    await waitFor(() => {
      expect(queryByTestId("chat-container")).toBeNull();
    });
  });
});
