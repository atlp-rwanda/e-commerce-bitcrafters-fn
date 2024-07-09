import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { createStore } from "redux";
import { ToastContainer } from "react-toastify";
import { RootState } from "../../../redux/store";
import Chat from "../../../views/chat/Chat";
import { Socket } from "socket.io-client";
import socketIoClient from "socket.io-client";
import "@testing-library/jest-dom";
import { combineReducers } from "@reduxjs/toolkit";

jest.mock("socket.io-client");

const mockStore = (initialState: Partial<RootState>) => {
  return createStore((state = initialState) => state);
};

const initialState: Partial<RootState> = {
  auth: {
    authToken: "testToken",
    authUserId: "1",
    isLoggedIn: true,
    username: "TestUser",
    authRole: "user",
    _persist: {
      version: -1,
      rehydrated: true,
    },
  },
  chat: {
    unreadMessagesCount: 0,
  },
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Chat Component", () => {
  let mockSocket: Socket;
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });
  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    (socketIoClient as unknown as jest.Mock).mockReturnValue(mockSocket);
  });

  it("renders chat component without crashing", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Type your message here.../i),
      ).toBeInTheDocument();
    });
  });
  it("resets unread messages count when window gains focus", async () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <Router>
          <Chat />
        </Router>
      </Provider>,
    );

    window.dispatchEvent(new Event("focus"));

    await waitFor(() => {
      expect(initialState.chat?.unreadMessagesCount).toBe(0);
    });
  });
  it("emits 'requestPastMessages' when socket connects", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
        </Router>
      </Provider>,
    );
    (mockSocket.on as jest.Mock).mock.calls[0][1]();
    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith("requestPastMessages");
    });
  });

  it("displays past messages when received", async () => {
    const pastMessages = [
      {
        id: "1",
        userId: 1,
        username: "TestUser",
        message: "Hello",
        createdAt: new Date().toISOString(),
        online: true,
      },
    ];

    (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === "pastMessages") {
        callback(pastMessages);
      }
    });

    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });
  });

  it("sends a message when the form is submitted", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );

    const input = screen.getByPlaceholderText(/Type your message here.../i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSocket.emit).toHaveBeenCalledWith(
        "chatMessage",
        "Test message",
      );
    });
  });
});

describe("Chat Messages ,Past messages user join and User Left", () => {
  let mockSocket: Socket;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;

    (socketIoClient as unknown as jest.Mock).mockReturnValue(mockSocket);
  });
  it("updates messages when receiving a valid chat message with matching user id", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );

    const chatMessages = [
      {
        user: { id: 1, username: "TestUser" },
        message: "Test message 1 from TestUser",
      },
      {
        user: { id: 1, username: "TestUser" },
        message: "Test message 3 from TestUser",
      },
    ];

    const callback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call) => call[0] === "chatMessage",
    )[1];
    await act(async () => {
      for (const chatMessage of chatMessages) {
        callback(chatMessage);
      }
    });
    await screen.findByText(/Test message 1 from TestUser/i);
    await screen.findByText(/Test message 3 from TestUser/i);
    await waitFor(() => {
      expect(
        screen.getByText(/Test message 1 from TestUser/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Test message 3 from TestUser/i),
      ).toBeInTheDocument();
    });
  });
  it("notifies user when message is not sent", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    const invalidChatMessage = {
      message: "Invalid message format",
    };
    const callback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call) => call[0] === "chatMessage",
    )[1];
    await act(async () => {
      callback(invalidChatMessage);
    });

    await screen.findByText("Your message was not sent");
    await waitFor(() => {
      expect(screen.getByText("Your message was not sent")).toBeInTheDocument();
    });
  });
});

describe("Chat Component", () => {
  let mockSocket: jest.Mocked<ReturnType<typeof socketIoClient>>;
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as jest.Mocked<ReturnType<typeof socketIoClient>>;

    (socketIoClient as unknown as jest.Mock).mockReturnValue(mockSocket);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("handles emoji click and updates the message input", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    const emojiPickerButton = screen.getByRole("button", { name: /emoji/i });
    fireEvent.click(emojiPickerButton);
    const emoji = "😊";
    const emojiButton = screen.getByRole("button", { name: emoji });
    fireEvent.click(emojiButton);
    const messageInput = screen.getByPlaceholderText(
      /Type your message here.../i,
    );
    expect(messageInput).toHaveValue(emoji);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: emoji }),
      ).not.toBeInTheDocument();
    });
  });
  it("shows notification when message is not sent", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    mockSocket.emit.mockImplementation(() => {
      throw new Error("Failed to send message");
    });
    const messageInput = screen.getByPlaceholderText(
      /Type your message here.../i,
    );
    fireEvent.change(messageInput, { target: { value: "Hello, world!" } });
    const form = screen.getByTestId("chat-form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText(/Your message was not sent/i),
      ).toBeInTheDocument();
    });
  });
});

// =========when users left or joined the chat=========================
const mockStoreLJ = (initialState: any) => {
  const rootReducer = combineReducers({
    auth: (state = initialState.auth) => state,
  });
  return createStore(rootReducer, initialState);
};

const initialStateLJ = {
  auth: {
    authToken: "testToken",
    authUserId: "1",
    isLoggedIn: true,
    username: "TestUser",
    authRole: "user",
    _persist: {
      version: -1,
      rehydrated: true,
    },
  },
};

describe("Chat Component", () => {
  let mockSocket: Socket;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;
    (socketIoClient as jest.Mock).mockReturnValue(mockSocket);
  });

  it("updates active users and messages when receiving userJoined event", async () => {
    render(
      <Provider store={mockStoreLJ(initialStateLJ)}>
        <Router>
          <Chat />
        </Router>
      </Provider>,
    );

    const initialMessages = [
      {
        id: 1,
        userId: 2,
        user: { id: 2, username: "AnotherUser" },
        message: "Hello",
        timestamp: new Date().toISOString(),
        online: false,
      },
    ];

    act(() => {
      (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === "connect",
      )[1]();
      (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === "pastMessages",
      )[1](initialMessages);
    });

    const userJoinedEvent = {
      user: { id: 2, username: "AnotherUser" },
    };
    const userJoinedCallback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call) => call[0] === "userJoined",
    )[1];
    act(() => {
      userJoinedCallback(userJoinedEvent);
    });
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("updates active users and messages when receiving userLeft event", async () => {
    render(
      <Provider store={mockStore(initialState)}>
        <Router>
          <Chat />
        </Router>
      </Provider>,
    );

    const initialMessages = [
      {
        id: 1,
        userId: 2,
        user: { id: 2, username: "AnotherUser" },
        message: "Hello",
        timestamp: new Date().toISOString(),
        online: true,
      },
    ];
    act(() => {
      (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === "connect",
      )[1]();
      (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === "pastMessages",
      )[1](initialMessages);
    });

    const userLeftEvent = {
      user: { id: 2, username: "AnotherUser" },
    };
    const userLeftCallback = (mockSocket.on as jest.Mock).mock.calls.find(
      (call) => call[0] === "userLeft",
    )[1];

    act(() => {
      userLeftCallback(userLeftEvent);
    });
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

// =======================authentication for joing the chat=============

const mockStoreAuth = (initialState: any) => {
  const rootReducer = combineReducers({
    auth: (state = {}) => state,
  });
  return createStore(rootReducer, initialState);
};

const initialStateAuth = {
  auth: {
    authToken: null,
    authUserId: "2",
    isLoggedIn: false,
    username: "TestUser",
    authRole: "user",
    _persist: {
      version: -1,
      rehydrated: true,
    },
  },
};

describe("Chat Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (socketIoClient as jest.Mock).mockReturnValue({
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("shows notification and redirects to login when authToken is not provided", async () => {
    render(
      <Provider store={mockStoreAuth(initialStateAuth)}>
        <Router>
          <Chat />
          <ToastContainer />
        </Router>
      </Provider>,
    );
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
