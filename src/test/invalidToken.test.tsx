import { render, screen } from "@testing-library/react";
import InvalidToken from "../views/invalidToken";
import "@testing-library/jest-dom";

describe("InvalidToken", () => {
  it("should display invalid token message and contact information", () => {
    render(<InvalidToken />);

    expect(screen.getByText("Invalid or Expired Token")).toBeInTheDocument();
    expect(screen.getByText("The token you used is either invalid or has expired. Please contact support for assistance.")).toBeInTheDocument();
    expect(screen.getByText("Email: support@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: (123) 456-7890")).toBeInTheDocument();
    expect(screen.getByText("Help Center")).toBeInTheDocument();
  });
});
