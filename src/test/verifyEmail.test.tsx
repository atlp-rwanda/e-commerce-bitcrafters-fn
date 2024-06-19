import { render, waitFor } from "@testing-library/react";
import { useParams, useNavigate } from "react-router-dom";
import {axiosInstance} from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
import VerifyEmail from "../views/verifyEmail";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/AxiosInstance", () => ({
  __esModule: true,
  axiosInstance: {
    get: jest.fn(),
  },
  
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe("VerifyEmail", () => {
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockUseParams = useParams as jest.Mock;

  beforeEach(() => {
    mockUseParams.mockReturnValue({ token: "test-token" });
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  it("should display success message and navigate to email-verified on successful verification", async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({});
    const navigate = mockUseNavigate();

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("users/verify/test-token");
      expect(toast.success).toHaveBeenCalledWith("Email verified successfully!");
      expect(navigate).toHaveBeenCalledWith("/email-verified");
    });
  });

  it("should display error message and navigate to invalid-token on failed verification", async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error("Verification failed"));
    const navigate = mockUseNavigate();

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith("users/verify/test-token");
      expect(toast.error).toHaveBeenCalledWith("Verification failed. Please try again.");
      expect(navigate).toHaveBeenCalledWith("/invalid-token");
    });
  });
});
