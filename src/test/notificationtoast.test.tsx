import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "../components/notificationtoast";
import * as reactRedux from "react-redux";
import useAxiosClient from "../hooks/AxiosInstance";
import io from "socket.io-client";
import { toast } from "react-toastify";

jest.mock("react-redux");
jest.mock("../hooks/AxiosInstance");
jest.mock("socket.io-client");
jest.mock("react-toastify");

interface RootState {
  auth: {
    isLoggedIn: boolean;
    authToken: string | null;
  };
}

describe("useNotifications", () => {
  const mockAxiosGet = jest.fn();
  const mockSocket = {
    on: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reactRedux, "useSelector").mockImplementation((selector) =>
      selector({
        auth: { isLoggedIn: true, authToken: "mockToken" },
      } as RootState),
    );
    (useAxiosClient as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  it("should fetch notifications when logged in", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        notifications: [
          { id: "1", message: "Test notification", isRead: false },
        ],
        pagination: { totalPages: 1 },
      },
    });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
  });

  it("should handle multiple pages of notifications", async () => {
    mockAxiosGet
      .mockResolvedValueOnce({
        data: {
          notifications: [
            { id: "1", message: "Notification 1", isRead: false },
          ],
          pagination: { totalPages: 2 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          notifications: [{ id: "2", message: "Notification 2", isRead: true }],
          pagination: { totalPages: 2 },
        },
      });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.unreadCount).toBe(1);
  });

  it("should not fetch notifications when not logged in", () => {
    jest.spyOn(reactRedux, "useSelector").mockImplementation((selector) =>
      selector({
        auth: { isLoggedIn: false, authToken: null },
      } as RootState),
    );

    renderHook(() => useNotifications());

    expect(mockAxiosGet).not.toHaveBeenCalled();
  });

  it("should handle new notifications from socket", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        notifications: [],
        pagination: { totalPages: 1 },
      },
    });

    renderHook(() => useNotifications());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const socketCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === "notification",
    )[1];
    act(() => {
      socketCallback({ id: "1", message: "New notification", isRead: false });
    });

    expect(toast.info).toHaveBeenCalledWith(
      "New notification",
      expect.any(Object),
    );
  });

  it("should disconnect socket on unmount", () => {
    const { unmount } = renderHook(() => useNotifications());

    unmount();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
