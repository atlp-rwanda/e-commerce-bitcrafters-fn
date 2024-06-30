import { render, fireEvent, screen } from "@testing-library/react";
import DashboardButton from "../../components/DashBoardButton";
import "@testing-library/jest-dom";

describe("DashboardButton", () => {
  it("renders with default props", () => {
    render(
      <DashboardButton
        dataTestId="dashboard-button-test-id"
        value="Click me"
      />,
    );
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <DashboardButton
        dataTestId="dashboard-button-test-id"
        value="Submit"
        color="blue"
        textColor="yellow"
        borderColor="red"
        type="submit"
      />,
    );
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("background-color: blue");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <DashboardButton
        dataTestId="dashboard-button-test-id"
        value="Click me"
        onClick={handleClick}
      />,
    );
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with icon", () => {
    render(
      <DashboardButton
        dataTestId="dashboard-button-test-id"
        value="Click me"
        icon={<span data-testid="icon" />}
      />,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders with 'data-testid'", () => {
    render(
      <DashboardButton
        value="Click me"
        dataTestId="dashboard-button-test-id"
      />,
    );
    const button = screen.getByTestId("dashboard-button-test-id");
    expect(button).toBeInTheDocument();
  });
});
