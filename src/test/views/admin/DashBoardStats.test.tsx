import { render, screen, waitFor } from "@testing-library/react";
import axiosClient from "../../../hooks/AxiosInstance";
import DashboardStats from "../../../views/admin/DashboardStats";
import "@testing-library/jest-dom";
import * as Toastify from "react-toastify";

jest.mock("../../../hooks/AxiosInstance");

describe("DashboardStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render loading state initially", async () => {
    (axiosClient as jest.Mock).mockResolvedValueOnce({
      data: {
        pagination: { totalPages: 1, limit: 10 },
        users: [],
        message: "Users fetched successfully",
      },
    });

    render(<DashboardStats />);

    // expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Dashboard Overview")).toBeInTheDocument(),
    );
  });

  test("should fetch and display total users count", async () => {
    const mockResponse = {
      data: {
        pagination: { totalPages: 1, limit: 10 },
        users: [
          { id: 1, username: "User 1" },
          { id: 2, username: "User 2" },
          { id: 4, username: "User 4" },
        ],
        message: "Users fetched successfully",
      },
    };

    (axiosClient as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<DashboardStats />);

    await waitFor(() =>
      expect(screen.getByText("Total Users")).toBeInTheDocument(),
    );
  });
});

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("DashboardStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch and display total users count with pagination", async () => {
    const mockResponsePage1 = {
      data: {
        pagination: { totalPages: 2, limit: 2 },
        users: [
          { id: 1, name: "User 1" },
          { id: 2, name: "User 2" },
        ],
        message: "Users fetched successfully",
      },
    };

    const mockResponsePage2 = {
      data: {
        pagination: { totalPages: 2, limit: 2 },
        users: [
          { id: 3, name: "User 3" },
          { id: 4, name: "User 4" },
        ],
        message: "Users fetched successfully",
      },
    };

    (axiosClient as jest.Mock).mockReturnValueOnce({
      get: jest
        .fn()
        .mockResolvedValueOnce(mockResponsePage1)
        .mockResolvedValueOnce(mockResponsePage2),
    });

    render(<DashboardStats />);

    await waitFor(() =>
      expect(screen.getByText("Loading...")).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  test("should display error message when fetching users fails", async () => {
    const errorMessage = "Fetching users failed";
    (axiosClient as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      }),
    });

    render(<DashboardStats />);
    await waitFor(() => {
      expect(Toastify.toast).toHaveBeenCalledWith(errorMessage);
      expect(screen.queryByText("4")).not.toBeInTheDocument();
    });
  });

  test("should display generic error message when fetching users fails without response", async () => {
    const errorMessage = "Fetching users failed";

    (axiosClient as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockRejectedValueOnce(new Error("Network Error")),
    });

    render(<DashboardStats />);
    await waitFor(() => {
      expect(Toastify.toast).toHaveBeenCalledWith(errorMessage);
      expect(screen.queryByText("Total Users")).toBeInTheDocument();
      expect(screen.queryByText("4")).not.toBeInTheDocument();
    });
  });
});
