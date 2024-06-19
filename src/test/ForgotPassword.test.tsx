import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../views/ForgotPassword";
import { toast } from "react-toastify";
import axiosClient from "../hooks/AxiosInstance";

jest.mock("../hooks/AxiosInstance");
jest.mock("react-toastify");

const mockedAxiosClient = axiosClient as jest.MockedFunction<
  typeof axiosClient
>;

describe("ForgotPassword Component", () => {
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockedAxiosClient.mockReturnValue({ post: mockPost } as any);

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>,
    );
  });

  it("renders the ForgotPassword component", () => {
    expect(screen.getByText("FORGOT PASSWORD")).toBeInTheDocument();
  });

  it("displays an error message for invalid email format", async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
        target: { value: "invalid-email" },
      });
      fireEvent.blur(screen.getByPlaceholderText(/Enter email/i));
    });

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("displays a success message when email is valid and request succeeds", async () => {
    mockPost.mockResolvedValueOnce({ status: 200 });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
        target: { value: "validemail@example.com" },
      });
      fireEvent.click(screen.getByText(/Send Code/i));
    });

    expect(toast.success).toHaveBeenCalledWith("Password reset email sent");
  });

  it("displays an error message when request fails", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
        target: { value: "validemail@example.com" },
      });
      fireEvent.click(screen.getByText(/Send Code/i));
    });

    expect(toast.error).toHaveBeenCalledWith("Something went wrong!");
  });

  it("displays an error message from the API response", async () => {
    mockPost.mockResolvedValueOnce({ status: 400 });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
        target: { value: "validemail@example.com" },
      });
      fireEvent.click(screen.getByText(/Send Code/i));
    });

    expect(toast.error).toHaveBeenCalledWith("Error sending reset email");
  });
});
