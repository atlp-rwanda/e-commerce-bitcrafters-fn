import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import axiosClient from "../../../hooks/AxiosInstance";
import UsersTable from "../../../views/admin/UsersTable";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";
import RoleChangeModal from "../../../components/RoleChange";

jest.mock("../../../hooks/AxiosInstance");

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
  ToastContainer: jest.fn().mockImplementation(() => null),
}));
jest.mock("react-icons/ci", () => ({
  CiEdit: () => <span>Edit</span>,
}));

describe("UsersTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
    });
  });

  const mockUsersPage1 = [
    {
      id: 1,
      username: "User 1",
      email: "user1@example.com",
      userRole: "user",
      status: "active",
    },
    {
      id: 2,
      username: "User 2",
      email: "user2@example.com",
      userRole: "admin",
      status: "inactive",
    },
  ];

  const mockUsersPage2 = [
    {
      id: 3,
      username: "User 3",
      email: "user3@example.com",
      userRole: "user",
      status: "active",
    },
  ];

  const mockResponsePage1 = {
    data: {
      users: mockUsersPage1,
      pagination: { totalPages: 2 },
    },
  };

  const mockResponsePage2 = {
    data: {
      users: mockUsersPage2,
      pagination: { totalPages: 2 },
    },
  };

  // uncovered lines
  //end

  test("should fetch and display users", async () => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponsePage1),
    });

    render(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("user")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
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

    render(<UsersTable />);
    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 2")).toBeInTheDocument();
    });
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });
    await waitFor(() => {
      expect(screen.getByText("User 3")).toBeInTheDocument();
    });
    await act(async () => {
      const prevButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(prevButton);
    });

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 2")).toBeInTheDocument();
    });
  });

  test("should open and close role change modal", async () => {
    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponsePage1),
    });

    render(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });
    await act(async () => {
      const editButton = screen.getAllByRole("button", { name: /edit/i })[0];
      fireEvent.click(editButton);
    });
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/Change Role/i)).toBeInTheDocument();
    });
    await act(async () => {
      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  test("should successfully change user role", async () => {
    const mockPost = jest.fn().mockResolvedValue({
      data: { message: "Role updated successfully" },
    });

    (axiosClient as jest.Mock)
      .mockReturnValueOnce({
        get: jest.fn().mockResolvedValue(mockResponsePage1),
      })
      .mockReturnValue({
        post: mockPost,
      });

    render(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });
    await act(async () => {
      const editButton = screen.getAllByRole("button", { name: /edit/i })[0];
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/Change Role/i)).toBeInTheDocument();
    });
    await act(async () => {
      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Role updated successfully");
    });
  });

  test("should display error message when fetching users fails", async () => {
    const errorMessage = "Fetching users failed";

    (axiosClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockRejectedValue({
        response: { data: { message: errorMessage } },
      }),
    });

    render(<UsersTable />);

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

    render(<UsersTable />);
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText("User 3")).toBeInTheDocument();
    });
  });

  test("should handle previous page", async () => {
    const mockGet = jest
      .fn()
      .mockResolvedValue(mockResponsePage2)
      .mockResolvedValue(mockResponsePage1);

    (axiosClient as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    render(<UsersTable />);
    await act(async () => {
      const prevButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(prevButton);
    });

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 2")).toBeInTheDocument();
    });
  });

  test("should display error message when role update fails", async () => {
    const errorMessage = "Failed to update role";

    const mockPost = jest.fn().mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    (axiosClient as jest.Mock)
      .mockReturnValueOnce({
        get: jest.fn().mockResolvedValue(mockResponsePage1),
      })
      .mockReturnValue({
        post: mockPost,
      });

    render(<UsersTable />);

    await waitFor(() => {
      expect(screen.getByText("User 1")).toBeInTheDocument();
    });
    await act(async () => {
      const editButton = screen.getAllByRole("button", { name: /edit/i })[0];
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/Change Role/i)).toBeInTheDocument();
    });
    await act(async () => {
      const saveButton = screen.getByRole("button", { name: /save/i });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(errorMessage);
    });
  });
  // new tests
    test("should open and close status change modal", async () => {
      (axiosClient as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponsePage1),
      });

      render(<UsersTable />);

      await waitFor(() => {
        expect(screen.getByText("User 1")).toBeInTheDocument();
      });

      // Find all buttons with text "Edit"
      const editButtons = screen.getAllByText("Edit");
      // Click the second "Edit" button (index 1), which should be for status
      fireEvent.click(editButtons[1]);

      await waitFor(() => {
        // Check for the title of the StatusChangeModal
        expect(screen.getByText(/Change Status of/)).toBeInTheDocument();
      });

      // Find and click the close button
      const closeButton = screen.getByLabelText("Close");
      fireEvent.click(closeButton);

      await waitFor(() => {
        // Check that the modal is no longer in the document
        expect(screen.queryByText(/Change Status of/)).not.toBeInTheDocument();
      });
    });
});

describe("RoleChangeModal", () => {
  it("updates role state on change", async () => {
    const { getByRole } = render(
      <RoleChangeModal
        isOpen={true}
        currentRole="buyer"
        onClose={() => {}}
        onSave={() => {}}
        setNewRole={() => {}}
      />,
    );
    const roleSelect = getByRole("combobox") as HTMLSelectElement;
    await act(async () => {
      fireEvent.change(roleSelect, { target: { value: "seller" } });
    });

    expect(roleSelect.value).toBe("seller");
  });
});


