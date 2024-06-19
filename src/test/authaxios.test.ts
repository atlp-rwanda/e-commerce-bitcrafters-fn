import {axiosInstance} from "../hooks/AxiosInstance";
import { signup } from "../api/auth";

jest.mock("../hooks/AxiosInstance", () => ({
  __esModule: true,
  axiosInstance: {
    post: jest.fn(),
  },
  
}));

describe("signup", () => {
  it("should return the response data on successful signup", async () => {
    const mockResponse = {
      data: {
        message: "Account created successfully!",
        user: { id: "1", username: "testuser", email: "test@example.com" },
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

    const username = "testuser";
    const email = "test@example.com";
    const password = "12345678";

    const result = await signup(username, email, password);

    expect(axiosInstance.post).toHaveBeenCalledWith("/users/signup", {
      username,
      email,
      password,
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error when the signup fails", async () => {
    const mockError = new Error("Signup failed");
    (axiosInstance.post as jest.Mock).mockRejectedValue(mockError);

    const username = "testuser";
    const email = "test@example.com";
    const password = "12345678";

    await expect(signup(username, email, password)).rejects.toThrow(
      "Signup failed",
    );

    expect(axiosInstance.post).toHaveBeenCalledWith("/users/signup", {
      username,
      email,
      password,
    });
  });
});
