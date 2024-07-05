import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axiosClient from "../../hooks/AxiosInstance";
import UsersTable from "../../views/NotificationPane";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";

jest.mock("../../hooks/AxiosInstance");

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("UsersTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUsersPage1 = [
    {
      userId: 1,
      message: "User 1",
      productId: "user1@example.com",
      isRead: false,
    },
  ];

  const mockUsersPage2 = [
    {
        userId: 5,
        message: "Users 1",
        productId: "user1@example.com",
        isRead: false,
    },
  ];

  const mockResponsePage1 = {
    data: {
      notifications: mockUsersPage1,
      pagination: { totalPages: 2 },
    },
  };

  const mockResponsePage2 = {
    data: {
      notifications: mockUsersPage2,
      pagination: { totalPages: 2 },
    },
  };

  test("should fetch and display users", async () => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponsePage1),
    });

    render(<UsersTable open={true} onClose={() => {}} />);
  });

  test("should handle pagination", async () => {
    const mockGet = jest
      .fn()
      .mockResolvedValueOnce(mockResponsePage1)
      .mockResolvedValueOnce(mockResponsePage2)
      .mockResolvedValueOnce(mockResponsePage1);

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    render(<UsersTable open={true}onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(prevButton);
  });


  test("should display error message when fetching users fails", async () => {
    const errorMessage = "failed to fetch notifications";

    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({
        response: { data: { message: errorMessage } },
      }),
    });

    render(<UsersTable open={true} onClose={() => {}} />);
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });

  test("should handle next page", async () => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest
        .fn()
        .mockResolvedValue(mockResponsePage1)
        .mockResolvedValue(mockResponsePage2),
    });

    render(<UsersTable open={true} onClose={() => {}} />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
  });

  test("should handle previous page", async () => {
    const mockGet = jest
      .fn()
      .mockResolvedValue(mockResponsePage2)
      .mockResolvedValue(mockResponsePage1);

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    render(<UsersTable open={true} onClose={() => {}} />);

    const prevButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(prevButton);

  });

  test("should display error message when fetching users fails", async () => {
    const errorMessage = "failed to fetch notifications";

    const mockGet = jest.fn().mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    render(<UsersTable open={true} onClose={() => {}} />);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });
});
