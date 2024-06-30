import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axiosClient from "../../../hooks/AxiosInstance";
import DashBoardSideBar from "../../../components/SideNav";
import "@testing-library/jest-dom";
import { toast } from "react-toastify";

jest.mock("../../../hooks/AxiosInstance");
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));
describe("DashBoardSideBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<DashBoardSideBar />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("menu-toggle-button2")).toBeInTheDocument();
  });

  test("toggles menu visibility", async () => {
    render(<DashBoardSideBar />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("menu-toggle-button2")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByTestId("menu-toggle-button2"));
    });
    expect(screen.getByTestId("menu-toggle-button")).toBeInTheDocument();
  });

  test("toggles menu visibility when toggle button is clicked", async () => {
    render(<DashBoardSideBar />, { wrapper: MemoryRouter });
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
      render(<DashBoardSideBar />, { wrapper: MemoryRouter });
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });
});

describe("DashBoardSideBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("navigates to dashboard when DashboardButton is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("dashboard-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
  });
  test("navigates to users page when UserButton is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/users" element={<div>User Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("user-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/User Page/i)).toBeInTheDocument();
  });
  test("navigates to products when product button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/products" element={<div>Products Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("product-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Products Page/i)).toBeInTheDocument();
  });

  test("navigates to notifications when  NotificationButton is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route
            path="/admin/notifications"
            element={<div>Notifications Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("notification-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Notifications Page/i)).toBeInTheDocument();
  });

  test("navigates to orders when  ordersButton is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/orders" element={<div>Orders Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("orders-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Orders Page/i)).toBeInTheDocument();
  });
  test("navigates to reviews when  reviewButton is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/reviews" element={<div>Reviews Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("review-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Reviews Page/i)).toBeInTheDocument();
  });
  test("navigates to settings when  setting button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashBoardSideBar />} />
          <Route path="/admin/settings" element={<div>Setting Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const dashboardButton = screen.getByTestId("setting-button");
    expect(dashboardButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(dashboardButton);
    });
    expect(screen.getByText(/Setting Page/i)).toBeInTheDocument();
  });
  it("sets logout as selected when Logout button is clicked", async () => {
    render(
      <MemoryRouter>
        <DashBoardSideBar />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByTestId("logout-button");
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    expect(logoutButton).toBeInTheDocument();
  });
});
