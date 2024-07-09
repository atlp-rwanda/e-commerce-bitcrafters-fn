import { useEffect, useState } from "react";
import axiosClient from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
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
  const client = axiosClient();
  const notify = (message: string) => toast(message);

  const fetchNotifications = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await client.get(`/notifications?page=${pageNumber}`);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      notify("failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);
  console.log(open)
  useEffect(() => {
    if (open) {
      setIsModalOpen(true);
    }
  }, [open]);

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
              ) : (
                notifications.map((notification, index) => (
                  <li
                    key={notification.id}
                    className={`p-3 rounded-lg flex items-start space-x-2 ${index % 2 === 0 ? 'bg-grayboro' : 'bg-gray-500'}`}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-custom-size text-gray-500 self-end">
                          {new Date(notification.createdAt).toLocaleDateString()}{" "}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-bold text-sm">{notification.message}</p>
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
            >
              Back
            </button>
            <h4>Page {page}</h4>
            <button
              onClick={handleNextPage}
              className={`bg-back_next text-white px-4 py-2 rounded ${page === totalPages && "opacity-50 cursor-not-allowed"}`}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
          <div className="absolute top-2 right-2 px-4 py-2 rounded">
            <FaTimes size={22} onClick={closeModal} /> 
          </div >
         
        </div>
      </Modal>
    </div>
  );
};

export default NotificationPane;
