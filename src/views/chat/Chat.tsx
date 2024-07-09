import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { PUBLIC_URL } from "../../constants";
import { ToastContainer, toast } from "react-toastify";
import Avatar from "../../assets/images/profileImage.svg";
import { RootState } from "../../redux/store";
import { FaPaperPlane } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import emojiData from "emoji.json";
import { useNavigate } from "react-router-dom";
import { setUnreadMessagesCount } from "../../redux/chatSlice";
interface Message {
  id: string;
  userId: number | string;
  user: {
    id: number;
    username: string;
  };
  online: boolean;
  message: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const authToken = useSelector((state: RootState) => state.auth.authToken);

  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.authUserId,
  );
  const notify = (message: string) => toast(message);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number[]>([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (authToken) {
      const newSocket = io(`${PUBLIC_URL}chat`, {
        auth: { token: authToken },
      });
      newSocket.on("connect", () => {
        newSocket.emit("requestPastMessages");
        scrollToBottom();
      });

      newSocket.on("pastMessages", (pastMessages: any[]) => {
        const formattedMessages = pastMessages.map((msg) => ({
          id: msg.id,
          userId: msg.userId,
          user: {
            id: msg.id,
            username: msg.username || "Unknown",
          },
          message: msg.message,
          timestamp: msg.createdAt,
          online: activeUsers.includes(msg.userId),
        }));
        setMessages(formattedMessages.reverse());
        scrollToBottom();
      });

      newSocket.on("chatMessage", (msg: any) => {
        if (msg.user && msg.user.username) {
          const formattedMessage = {
            id: Date.now().toString(),
            userId: msg.user.id,
            user: {
              id: msg.user.id,
              username: msg.user.username,
            },
            message: msg.message,
            timestamp: new Date().toISOString(),
            online: true,
          };
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map((message) =>
              message.userId === msg.user.id
                ? { ...message, online: true }
                : message,
            );

            return [...updatedMessages, formattedMessage];
          });

          if (!activeUsers.includes(msg.userId)) {
            setActiveUsers((prevUsers) => [...prevUsers, msg.userId]);
          }
          scrollToBottom();
          if (msg.user.id !== loggedInUserId) {
            setNewMessagesCount((prevCount) => prevCount + 1);
            dispatch(setUnreadMessagesCount(newMessagesCount + 1)); // Update the Redux state
          }
        } else {
          notify("Your message was not sent");
        }
      });

      newSocket.on(
        "userJoined",
        (data: { user: { id: number; username: string } }) => {
          if (data && data.user && data.user.id) {
            setActiveUsers((prevUsers) => [...prevUsers, data.user.id]);
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.userId === data.user.id ? { ...msg, online: true } : msg,
              ),
            );
            scrollToBottom();
          }
        },
      );

      newSocket.on(
        "userLeft",
        (data: { user: { id: number; username: string } }) => {
          if (data && data.user && data.user.id) {
            setActiveUsers((prevUsers) =>
              prevUsers.filter((userId) => userId !== data.user.id),
            );
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.userId === data.user.id ? { ...msg, online: false } : msg,
              ),
            );
          }
        },
      );

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      notify("Please Login");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [authToken]);

  useEffect(() => {
    const resetUnreadMessagesCount = () => {
      setNewMessagesCount(0);
      dispatch(setUnreadMessagesCount(0));
    };
    window.addEventListener("focus", resetUnreadMessagesCount);
    return () => {
      window.removeEventListener("focus", resetUnreadMessagesCount);
    };
  }, [dispatch]);

  const handleEmojiClick = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      try {
        socket.emit("chatMessage", message);
        setMessage("");
      } catch (error: any) {
        toast.error("Your message was not sent");
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-chat_back">
      <p className="text-center font-bold">Chats</p>
      <div className="flex-1 overflow-y-auto rounded p-4">
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`p-3 rounded-lg flex items-start space-x-2 ${
                msg?.userId === loggedInUserId
                  ? "self-end bg-slate-900 text-white"
                  : "bg-white self-start border p-1 border-gray-100 rounded-r text-black"
              }`}
            >
              {msg?.userId !== loggedInUserId && (
                <div className="flex items-center justify-center">
                  <img
                    src={Avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span
                    className={`w-2 h-2 rounded-full ml-1 ${
                      msg.online ? "bg-green-500 " : "bg-red-500"
                    }`}
                  ></span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">{msg.user.username}</span>
                  <span className="text-custom-size text-gray-500 self-end">
                    {new Date(msg.timestamp).toLocaleDateString()}{" "}
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm">{msg.message}</p>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <form
        data-testid="chat-form"
        onSubmit={handleSubmit}
        className="flex mt-4 space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-gray-300 text-black hover:bg-gray-400 flex"
          aria-label="Show emoji picker"
        >
          <FontAwesomeIcon icon={faSmile} className="h-7 w-7 sm:w-auto" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-black text-black rounded w-full sm:w-auto"
          placeholder="Type your message here..."
        />

        <button
          type="submit"
          className="p-2 text-black rounded flex sm:w-auto"
          aria-label="Send"
        >
          <FaPaperPlane className="h-8 w-9" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 z-50 bg-white border border-gray-300 rounded shadow-lg p-2 grid grid-cols-5 gap-2">
            {emojiData.slice(0, 15).map((emoji) => (
              <button
                key={emoji.codes}
                onClick={() => handleEmojiClick(emoji.char)}
                className="text-2xl p-1 hover:bg-gray-200 rounded"
              >
                {emoji.char}
              </button>
            ))}
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default Chat;
