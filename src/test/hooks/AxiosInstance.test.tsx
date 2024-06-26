import axios from "axios";
import axiosClient from "../../hooks/AxiosInstance";
import { useSelector } from "react-redux";
import "@testing-library/jest-dom";

jest.mock("axios");

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("AxiosInstance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds authorization header in request interceptor when authToken is available", () => {
    const mockUse = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: { use: mockUse },
        response: { use: jest.fn() },
      },
    });
    (useSelector as unknown as jest.Mock).mockReturnValue({
      authToken: "auth-token",
    });

    axiosClient();

    const interceptor = mockUse.mock.calls[0][0];
    const config = { headers: {} };
    const result = interceptor(config);

    expect(result.headers.Authorization).toBe("Bearer auth-token");
  });

  it("removes AUTH_TOKEN from localStorage on 401 response", () => {
    const mockUse = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: mockUse },
      },
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
    axiosClient();

    const errorInterceptor = mockUse.mock.calls[0][1];
    const error = { response: { status: 401 } };

    expect(() => errorInterceptor(error)).toThrow();
    expect(removeItemSpy).toHaveBeenCalledWith("AUTH_TOKEN");
  });

  it("throws error in response interceptor", () => {
    const mockUse = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: mockUse },
      },
    });

    axiosClient();

    const errorInterceptor = mockUse.mock.calls[0][1];
    const error = new Error("Test error");

    expect(() => errorInterceptor(error)).toThrow("Test error");
  });
});

jest.mock("axios");
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("AxiosInstance", () => {
  let mockAxiosCreate;
  let mockInterceptors: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInterceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    };
    mockAxiosCreate = jest.fn().mockReturnValue({
      interceptors: mockInterceptors,
    });
    (axios.create as jest.Mock).mockImplementation(mockAxiosCreate);
  });

  describe("useSelector for authToken", () => {
    it("uses authToken from Redux state when available", () => {
      const mockAuthToken = "mock-auth-token";
      (useSelector as unknown as jest.Mock).mockReturnValue({
        authToken: mockAuthToken,
      });

      axiosClient();

      const requestInterceptor = mockInterceptors.request.use.mock.calls[0][0];
      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBe(`Bearer ${mockAuthToken}`);
    });

    it("does not add Authorization header when authToken is null", () => {
      (useSelector as unknown as jest.Mock).mockReturnValue({
        authToken: null,
      });

      axiosClient();

      const requestInterceptor = mockInterceptors.request.use.mock.calls[0][0];
      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response interceptor", () => {
    it("returns response unchanged for successful requests", () => {
      const mockResponse = { data: "test data", status: 200 };

      axiosClient();

      const successInterceptor = mockInterceptors.response.use.mock.calls[0][0];
      const result = successInterceptor(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it("handles errors in catch block and re-throws", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      axiosClient();

      const errorInterceptor = mockInterceptors.response.use.mock.calls[0][1];
      const error = new Error("Test error");

      expect(() => errorInterceptor(error)).toThrow("Test error");
      expect(consoleSpy).toHaveBeenCalled;

      consoleSpy.mockRestore();
    });

    it("removes AUTH_TOKEN from localStorage on 401 response", () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

      axiosClient();

      const errorInterceptor = mockInterceptors.response.use.mock.calls[0][1];
      const error = { response: { status: 401 } };

      expect(() => errorInterceptor(error)).toThrow();
      expect(removeItemSpy).toHaveBeenCalledWith("AUTH_TOKEN");

      removeItemSpy.mockRestore();
    });
  });

  
});


jest.mock("axios");
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("AxiosInstance - uncoverd lines", () => {
  let mockAxiosCreate;
  let mockInterceptors: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInterceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    };
    mockAxiosCreate = jest.fn().mockReturnValue({
      interceptors: mockInterceptors,
    });
    (axios.create as jest.Mock).mockImplementation(mockAxiosCreate);
  });

  it("correctly extracts authToken from Redux state", () => {
    const mockAuthToken = "test-auth-token";
    (useSelector as any as jest.Mock).mockReturnValue({ authToken: mockAuthToken });

    axiosClient();

    expect(useSelector).toHaveBeenCalled();
    const selectorFn = (useSelector as any as jest.Mock).mock.calls[0][0];
    const result = selectorFn({ auth: { authToken: mockAuthToken } });
    expect(result).toEqual({ authToken: mockAuthToken });
  });


});