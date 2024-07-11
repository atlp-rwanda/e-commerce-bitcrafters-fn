import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateCart from "../../components/UpdateCartModal";

describe("UpdateCart", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const initialQuantity = 2;

  const renderComponent = (isOpen = true) => {
    render(
      <UpdateCart
        isOpen={isOpen}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialQuantity={initialQuantity}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the modal when isOpen is true", () => {
    renderComponent();
    expect(screen.getByText("Update Quantity")).toBeInTheDocument();
  });

  test("does not render the modal when isOpen is false", () => {
    renderComponent(false);
    expect(screen.queryByText("Update Quantity")).not.toBeInTheDocument();
  });

  test("displays the initial quantity", () => {
    renderComponent();
    expect(screen.getByLabelText("Quantity:")).toHaveValue(initialQuantity);
  });

  test("updates quantity when input changes", () => {
    renderComponent();
    const input = screen.getByLabelText("Quantity:");
    fireEvent.change(input, { target: { value: "5" } });
    expect(input).toHaveValue(5);
  });

  test("calls onSubmit with new quantity when Update button is clicked", () => {
    renderComponent();
    const input = screen.getByLabelText("Quantity:");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(screen.getByText("Update"));
    expect(mockOnSubmit).toHaveBeenCalledWith(5);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onClose when Cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("disables Update button when quantity is 0 or less", () => {
    renderComponent();
    const input = screen.getByLabelText("Quantity:");
    const updateButton = screen.getByText("Update");

    fireEvent.change(input, { target: { value: "0" } });
    expect(updateButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "-1" } });
    expect(updateButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "1" } });
    expect(updateButton).not.toBeDisabled();
  });
});
