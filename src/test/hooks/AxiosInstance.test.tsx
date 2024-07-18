import { renderHook } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxiosClient from "../../hooks/AxiosInstance";
import { setAuthRole, setAuthToken, setIsLoggedIn } from "../../redux/authSlice";

jest.mock("axios");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockedUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe("useAxiosClient", () => {
  const authToken = "test-token";
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockedUseSelector.mockImplementation((selectorFn) =>
      selectorFn({ auth: { authToken } })
    );
    mockedDispatch.mockReturnValue(mockDispatch);
    mockedUseNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it("should set the Authorization header if authToken is present", async () => {
    const { result } = renderHook(() => useAxiosClient());

    const client = result.current;

    const requestInterceptor = client.interceptors.request.use as jest.Mock;
    const [requestInterceptorCallback] = requestInterceptor.mock.calls[0];

    const config = await requestInterceptorCallback({ headers: {} });

    expect(config.headers.Authorization).toBe(`Bearer ${authToken}`);
  });

  it("should call handleLogout on jwt expired error", async () => {
    const { result } = renderHook(() => useAxiosClient());

    const client = result.current;

    const responseInterceptor = client.interceptors.response.use as jest.Mock;
    const [, errorInterceptorCallback] = responseInterceptor.mock.calls[0];

    const error = {
      response: { data: { error: "jwt expired" } },
    };

    try {
      await errorInterceptorCallback(error);
    } catch (e) {
    }

    expect(mockDispatch).toHaveBeenCalledWith(setIsLoggedIn(false));
    expect(mockDispatch).toHaveBeenCalledWith(setAuthToken(null));
    expect(mockDispatch).toHaveBeenCalledWith(setAuthRole(null));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    
  });


});
