import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axiosClient from "../../../hooks/AxiosInstance";
import DashBoardSideBar from "../../../components/SideNav";
import "@testing-library/jest-dom";
import { toast } from "react-toastify";
import { useNotifications } from "../../../components/notificationtoast";

jest.mock("../../../hooks/AxiosInstance");
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));
jest.mock("../../../components/notificationtoast", () => ({
  useNotifications: jest.fn(),
}));

const mockStore = configureStore([]);

interface AllTheProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  initialEntries = ["/"],
}) => {
  const store = mockStore({
    auth: { isLoggedIn: true, authToken: "mock-token" },
    chat: { unreadMessagesCount: 0 },
  });

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );
};

describe("DashBoardSideBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 0 });
  });

  test("renders without crashing", () => {
    render(<DashBoardSideBar />, { wrapper: AllTheProviders });
    expect(screen.getByTestId("menu-toggle-button2")).toBeInTheDocument();
  });

  test("toggles menu visibility", async () => {
    render(<DashBoardSideBar />, { wrapper: AllTheProviders });
    expect(screen.getByTestId("menu-toggle-button2")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId("menu-toggle-button2"));
    });
    expect(screen.getByTestId("menu-toggle-button")).toBeInTheDocument();
  });

  test("toggles menu visibility when toggle button is clicked", async () => {
    render(<DashBoardSideBar />, { wrapper: AllTheProviders });
    const forwardArrow = screen.getByTestId("menu-toggle-button2");
    expect(forwardArrow).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(forwardArrow);
    });

    const backwardArrow = screen.getByTestId("menu-toggle-button");
    expect(backwardArrow).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(backwardArrow);
    });

    expect(screen.getByTestId("menu-toggle-button2")).toBeInTheDocument();
  });

  it("should display error message when fetching user profile fails", async () => {
    const errorMessage = "Fetching users failed";

    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({
        errorMessage,
      }),
    });
    await act(async () => {
      render(<DashBoardSideBar />, { wrapper: AllTheProviders });
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  test("navigates to dashboard when DashboardButton is clicked", async () => {
    render(
      <AllTheProviders initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </AllTheProviders>,
    );
    const dashboardButton = screen.getByTestId("dashboard-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
  });

  test("navigates to users page when UserButton is clicked", async () => {
    render(
      <AllTheProviders initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/users" element={<div>User Page</div>} />
        </Routes>
      </AllTheProviders>,
    );
    const userButton = screen.getByTestId("user-button");
    expect(userButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(userButton);
    });
    expect(screen.getByText(/User Page/i)).toBeInTheDocument();
  });

  test("navigates to notifications when NotificationButton is clicked", async () => {
    render(
      <AllTheProviders initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route
            path="/admin/notifications"
            element={<div>Notifications Page</div>}
          />
        </Routes>
      </AllTheProviders>,
    );
    const notificationButton = screen.getByTestId("notification-button");
    expect(notificationButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(notificationButton);
    });
   // expect(screen.getByText(/Notifications Page/i)).toBeInTheDocument();
  });

  test("navigates to settings when setting button is clicked", async () => {
    render(
      <AllTheProviders initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/settings" element={<div>Setting Page</div>} />
        </Routes>
      </AllTheProviders>,
    );
    const settingButton = screen.getByTestId("setting-button");
    expect(settingButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(settingButton);
    });
  });

  test("displays correct unread count on notification badge", async () => {
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 5 });

    render(<DashBoardSideBar />, { wrapper: AllTheProviders });

    const badge = screen.getByText("5");
    expect(badge).toBeInTheDocument();
  });

  test("toggles notification icon when selected", async () => {
    render(<DashBoardSideBar />, { wrapper: AllTheProviders });

    const notificationButton = screen.getByTestId("notification-button");
    expect(notificationButton).toBeInTheDocument();

    const initialIcon = notificationButton.querySelector("svg");
    expect(initialIcon).toBeInTheDocument();
    expect(initialIcon?.classList.toString()).toContain(
      "text-black text-lg tablet:text-2xl",
    );

    await act(async () => {
      fireEvent.click(notificationButton);
    });

    const updatedIcon = notificationButton.querySelector("svg");
    expect(updatedIcon).toBeInTheDocument();
    expect(updatedIcon?.classList.toString()).toContain(
      "text-white text-lg tablet:text-2xl",
    );
  });
  test("displays correct unread count on notification badge", async () => {
    const unreadCount = 5;
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount });

    render(<DashBoardSideBar />, { wrapper: AllTheProviders });

    const notificationButton = screen.getByTestId("notification-button");
    const badge = notificationButton.querySelector(".MuiBadge-badge");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(unreadCount.toString());
  });
});
