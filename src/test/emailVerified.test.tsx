import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import EmailVerified from "../views/emailVerified";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("EmailVerified", () => {
  const mockUseNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  it("should display success message and log in button", () => {
    render(<EmailVerified />);

    // Adjust the text to match the actual content
    expect(screen.getByText("Account Verified Successfully!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("should navigate to login page on button click", () => {
    const navigate = mockUseNavigate();
    render(<EmailVerified />);

    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
