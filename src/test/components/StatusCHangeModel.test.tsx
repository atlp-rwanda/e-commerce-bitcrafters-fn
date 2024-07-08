import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusChangeModal from "../../components/StatusChangeModal";
import axiosClient from "../../hooks/AxiosInstance";
import { toast } from "react-toastify";

jest.mock("../../hooks/AxiosInstance", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    patch: jest.fn(),
  })),
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("StatusChangeModal", () => {
  const onCloseMock = jest.fn();
  const onStatusChangeMock = jest.fn();
  const user = { name: "John Doe", id: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders StatusChangeModal correctly", () => {
    render(
      <StatusChangeModal
        isOpen={true}
        onClose={onCloseMock}
        onStatusChange={onStatusChangeMock}
        currentStatus="active"
        user={user}
      />,
    );

    expect(screen.getByText(/Change Status of/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  test("can change status and save successfully", async () => {
    const mockPatch = jest.fn().mockResolvedValue({});
    (axiosClient as jest.Mock).mockReturnValue({
      patch: mockPatch,
    });

    render(
      <StatusChangeModal
        isOpen={true}
        onClose={onCloseMock}
        onStatusChange={onStatusChangeMock}
        currentStatus="active"
        user={user}
      />,
    );

    // Open status dropdown
    fireEvent.click(screen.getByText("Active"));

    // Select inactive status
    fireEvent.click(screen.getByText("Inactive"));

    // Enter description
    fireEvent.change(screen.getByPlaceholderText("Reason for deactivation"), {
      target: { value: "Reason for changing status" },
    });

    // Click save
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith("/users/1/status", {
        newStatus: "inactive",
        description: "Reason for changing status",
      });
      expect(toast).toHaveBeenCalledWith(
        "User status updated to inactive successfully and email sent",
      );
      expect(onStatusChangeMock).toHaveBeenCalledWith(1, "inactive");
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  test("handles error when saving status", async () => {
    const mockPatch = jest
      .fn()
      .mockRejectedValue({
        response: { data: { message: "Error updating status" } },
      });
    (axiosClient as jest.Mock).mockReturnValue({
      patch: mockPatch,
    });

    render(
      <StatusChangeModal
        isOpen={true}
        onClose={onCloseMock}
        onStatusChange={onStatusChangeMock}
        currentStatus="active"
        user={user}
      />,
    );

    // Open status dropdown and select inactive
    fireEvent.click(screen.getByText("Active"));
    fireEvent.click(screen.getByText("Inactive"));

    // Enter description
    fireEvent.change(screen.getByPlaceholderText("Reason for deactivation"), {
      target: { value: "Reason for changing status" },
    });

    // Click save
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith("Error updating status");
      expect(onStatusChangeMock).not.toHaveBeenCalled();
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  test("displays loading state while saving", async () => {
    const mockPatch = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    (axiosClient as jest.Mock).mockReturnValue({
      patch: mockPatch,
    });

    render(
      <StatusChangeModal
        isOpen={true}
        onClose={onCloseMock}
        onStatusChange={onStatusChangeMock}
        currentStatus="active"
        user={user}
      />,
    );

    // Open status dropdown and select inactive
    fireEvent.click(screen.getByText("Active"));
    fireEvent.click(screen.getByText("Inactive"));

    // Enter description
    fireEvent.change(screen.getByPlaceholderText("Reason for deactivation"), {
      target: { value: "Reason for changing status" },
    });

    // Click save
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  test("disables save button if description is empty for inactive status", () => {
    render(
      <StatusChangeModal
        isOpen={true}
        onClose={onCloseMock}
        onStatusChange={onStatusChangeMock}
        currentStatus="active"
        user={user}
      />,
    );

    // Open status dropdown
    fireEvent.click(screen.getByText("Active"));

    // Select inactive status
    fireEvent.click(screen.getByText("Inactive"));

    expect(screen.getByText("Save")).toBeDisabled();

    // Enter description
    fireEvent.change(screen.getByPlaceholderText("Reason for deactivation"), {
      target: { value: "Reason" },
    });

    expect(screen.getByText("Save")).not.toBeDisabled();
  });
});
