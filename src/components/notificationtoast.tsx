import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useAxiosClient from "../hooks/AxiosInstance";
import io from "socket.io-client";
import { PUBLIC_URL } from "../constants";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isLoggedIn, authToken } = useSelector((state: any) => state.auth);
  const axiosClient = useAxiosClient();

  const socket = io(`${PUBLIC_URL}`, {
    auth: { token: authToken },
  });

  socket.on("connect", () => {});

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      let allNotifications: Notification[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await axiosClient.get(`/notifications?page=${page}`);
        if (response.data && response.data.notifications) {
          allNotifications = [
            ...allNotifications,
            ...response.data.notifications,
          ];
          totalPages = response.data.pagination.totalPages;
        } else {
          console.warn("Unexpected response structure:", response.data);
          break;
        }

        page++;
      }

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [isLoggedIn, axiosClient]);

  useEffect(() => {
    if (isLoggedIn && authToken) {
      fetchNotifications();

      socket.on("notification", (newNotification: Notification) => {
        toast.info(newNotification.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isLoggedIn, authToken, fetchNotifications]);

  return { notifications, unreadCount };
}
