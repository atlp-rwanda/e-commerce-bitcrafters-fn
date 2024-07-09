import { useEffect, useState } from "react";
import axiosClient from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { AppDispatch } from "../redux/store";
import {useDispatch, useSelector } from "react-redux";
import { AllReads, setAllRead } from "../redux/notificationSlice";


//Modal.setAppElement('#root');
interface Notification {
  id: number;
  productId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string
}

interface ModalProps {
  open: boolean
  onClose: () => void;
}

const NotificationPane: React.FC<ModalProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allRead = useSelector(AllReads);
  const client = axiosClient();
  const dispatch = useDispatch<AppDispatch>();
  const notify = (message: string) => toast(message);
 

  const fetchNotifications = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await client.get(`/notifications?page=${pageNumber}`);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.pagination.totalPages);
      dispatch(setAllRead(response.data.notifications.every((n: Notification) => n.isRead)));
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };
  const markAllAsRead = async () => {
    try {
      const response = await client.put("/notifications/all");
      if(response.status === 200){
        notify("All notifications marked as read");
        fetchNotifications(page)
      }
    } catch (err: any) {
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);
  useEffect(() => {
    if (open) {
      setIsModalOpen(true);
    }
  }, [open, page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onClose()
  };
  return (
    <div className="relative p-4">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Notifications"
        className="absolute top-0 left-0 right-0 bottom-0 m-auto bg-white p-8 rounded shadow-lg w-3/4 h-3/4 max-h-full overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex flex-col h-full p-4 bg-chat_back">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="flex-1 overflow-y-auto rounded p-4">
            <ul className="space-y-4">
              {isLoading ? (
                <li className="text-center py-4">Loading...</li>
              )
              : (
                Array.isArray(notifications) && notifications.map((notification, index) => (
                  <li
                    key={notification.id}
                    className={`p-3 rounded-lg flex items-start space-x-2 ${notification.isRead ? (index % 2 === 0 ? 'bg-grayboro' : 'bg-gray-500') : 'bg-blue-100'}`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-custom-size text-gray-500 self-end">
                          {new Date(notification.createdAt).toLocaleDateString()}{" "}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.isRead ? 'font-normal' : 'font-bold flex items-center'}`}>
                            {!notification.isRead && <span className="mr-2 text-black" style={{ fontSize: '1.5rem', lineHeight: '1rem' }}>•</span>}
                           {notification.message}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevPage}
              className={`bg-back_next text-white px-4 py-2 rounded ${page === 1 && "opacity-50 cursor-not-allowed"}`}
              disabled={page === 1}
              name='Back'
            >
              Back
            </button>
            <h4>Page {page}</h4>
            <button
              onClick={handleNextPage}
              className={`bg-back_next text-white px-4 py-2 rounded ${page === totalPages && "opacity-50 cursor-not-allowed"}`}
              disabled={page === totalPages}
               name='Next'
            >
              Next
            </button>
          </div>

          {!allRead && (
            <div className="flex justify-end mt-4">
              <button
                onClick={markAllAsRead}
                className="bg-green-800 text-white px-4 py-2 rounded"
                 name='Mark All as Read'
              >
                Mark All as Read
              </button>
            </div>
          )}
          <div className="absolute top-2 right-2 px-4 py-2 rounded">
            <FaTimes size={22} onClick={closeModal}  name='Close' data-testid="close-icon" /> 
          </div >
        </div>
      </Modal>
    </div>
  );
};

export default NotificationPane;
