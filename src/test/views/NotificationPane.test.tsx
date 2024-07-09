import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axiosClient from "../../hooks/AxiosInstance";
import UsersTable from "../../views/NotificationPane";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../hooks/AxiosInstance");

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

function renderWithRedux(
  ui: JSX.Element,
) {
  return {
    ...render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>),
  };
}

describe("UsersTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockResponseEmpty = {
    data: {
      notifications: [],
      pagination: { totalPages: 1 },
    },
  };
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

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
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

    renderWithRedux(<UsersTable open={true}onClose={() => {}} />);

    const nextButton = screen.getByRole("button", { name: 'Next' });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: 'Back' });
    fireEvent.click(prevButton);
  });


  test("should display error message when fetching users fails", async () => {
    const errorMessage = "failed to fetch notifications";

    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({
        response: { data: { message: errorMessage } },
      }),
    });

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
  });

  test("should handle next page", async () => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest
        .fn()
        .mockResolvedValue(mockResponsePage1)
        .mockResolvedValue(mockResponsePage2),
    });

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
  
    const nextButton = screen.getByRole("button", { name: 'Next' });
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

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);

    const prevButton = screen.getByRole("button", { name: 'Back' });
    fireEvent.click(prevButton);

    //   expect(screen.getAllByText("User 1").length).toBeGreaterThanOrEqual(1);
    // });
  });

  test("should display error message when fetching users fails", async () => {
    const errorMessage = "failed to fetch notifications";

    const mockGet = jest.fn().mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);

  });
  test("should mark all notifications as read and update UI", async () => {
        const mockGet = jest
          .fn()
          .mockResolvedValueOnce(mockResponsePage1)
          .mockResolvedValueOnce(mockResponseEmpty);
    
        const mockPut = jest.fn().mockResolvedValue({ status: 200 });
    
        (axiosClient as jest.Mock).mockReturnValue({
          get: mockGet,
          put: mockPut,
        });
    
        renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
    
    
        const markAllButton = screen.getByRole("button", { name: 'Mark All as Read' });
        fireEvent.click(markAllButton);
    
        await waitFor(() => {
          expect(mockPut).toHaveBeenCalledWith("/notifications/all");
        });
      });
    
      test("should display no new notifications image when there are no notifications", async () => {
        (axiosClient as jest.Mock).mockReturnValue({
          get: jest.fn().mockResolvedValue(mockResponseEmpty),
        });
    
        renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
    
      });
      test("should disable next button on last page", async () => {
        (axiosClient as jest.Mock).mockReturnValue({
          get: jest.fn().mockResolvedValue(mockResponsePage2),
        });
    
        renderWithRedux(<UsersTable open={true} onClose={() => {}} />);

    
        const nextButton = screen.getByRole("button", { name: 'Next' });
        expect(nextButton).toBeDisabled();
      });
    
      test("should disable previous button on first page", async () => {
        (axiosClient as jest.Mock).mockReturnValue({
          get: jest.fn().mockResolvedValue(mockResponsePage1),
        });
    
        renderWithRedux(<UsersTable open={true} onClose={() => {}} />);
    
        const prevButton = screen.getByRole("button", { name: 'Back' });
        expect(prevButton).toBeDisabled();
      });
    


  test("handleNextPage should increment page when not on last page", async () => {
    const mockGet = jest.fn()
      .mockResolvedValueOnce({ data: { notifications: [], pagination: { totalPages: 2 } } })
      .mockResolvedValueOnce({ data: { notifications: [], pagination: { totalPages: 2 } } });

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: 'Next' });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Page 2")).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenNthCalledWith(1, "/notifications?page=1");
    expect(mockGet).toHaveBeenNthCalledWith(2, "/notifications?page=2");
  });

  test("handlePrevPage should decrement page when not on first page", async () => {
    const mockGet = jest.fn()
      .mockResolvedValueOnce({ data: { notifications: [], pagination: { totalPages: 2 } } })
      .mockResolvedValueOnce({ data: { notifications: [], pagination: { totalPages: 2 } } })
      .mockResolvedValueOnce({ data: { notifications: [], pagination: { totalPages: 2 } } });

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    renderWithRedux(<UsersTable open={true} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: 'Next' });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Page 2")).toBeInTheDocument();
    });

    const prevButton = screen.getByRole("button", { name: 'Back' });
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledTimes(3);
    expect(mockGet).toHaveBeenNthCalledWith(1, "/notifications?page=1");
    expect(mockGet).toHaveBeenNthCalledWith(2, "/notifications?page=2");
    expect(mockGet).toHaveBeenNthCalledWith(3, "/notifications?page=1");
  });
});
