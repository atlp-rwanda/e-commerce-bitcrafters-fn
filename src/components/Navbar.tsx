import React, { useState } from "react";
import Logo from "../assets/images/Bit.Shop.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchComponent from "./SearchComponent";
import Badge from "@mui/material/Badge";
import "react-toastify/dist/ReactToastify.css";
import { useNotifications } from "./notificationtoast";
import NotificationPane from "../views/NotificationPane";
import { FaTimes } from "react-icons/fa";
import Chat from "../views/chat/Chat";

interface NavbarProps {
  burgerShown?: boolean;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );
  const unreadMessagesCount = useSelector(
    (state: RootState) => state.chat.unreadMessagesCount,
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const { count } = useSelector((state: any) => state.cart);
  const [burgerShown, setIsBurgerShown] = useState(props.burgerShown || false);
  const [showSearch, setShowSearch] = useState(props.showSearch || false);
  const { unreadCount } = useNotifications();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  
  return (
    <div className=" w-full flex flex-col  ">
      <nav className="navbar-container w-full border-b-1 p-8 flex-between space-x-2 border-b-[1px] border-gray_100">
        <div className="nav-logo w-[20%]">
          <img src={Logo} alt="Logo" className="w-24 object-contain" />
        </div>
        <div className="nav-link flex-between w-[30%] hidden tablet:flex">
          <ul className="flex-between space-x-4">
            <li>
              <Link to="" className="text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm">
                About
              </Link>
            </li>
            <li>
              <Link to="" className="text-sm">
                Shop
              </Link>
            </li>
            <li>
              <Link to="" className="text-sm">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-icons flex-between hidden tablet:flex">
          <ul className="flex-between space-x-4">
            <li>
              <div
                className="search-container bg-gray rounded-sm flex-between space-x-2 p-2 cursor-pointer"
                onClick={() => setShowSearch(!showSearch)}
              >
                <p className="text-xs">search here</p>
                <CiSearch />
              </div>
            </li>
            <li>
              <Link to="" className="text-lg">
                <CiHeart size={24} />
              </Link>
            </li>
            <li>
            <Link to="/cart" className="text-lg relative">
              {" "}
              <IoCartOutline size={24} />
    {count >0 && <p className="bg-red-500 p-1 text-1 flex items-center justify-center text-white absolute rounded-full top-[-3px] right-[-3px] text-[10px] h-[13px] w-[13px]">{count}</p>}
    
            </Link>
          </li>
            <li>
              <Link to="" className="text-lg">
                <Badge badgeContent={unreadCount} color="primary">
                  <IoNotificationsOutline
                    size={24}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  />
                </Badge>
              </Link>
            </li>
            <li>
              <Link to="" className="text-lg">
                <IoLocationOutline size={24} />
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <button
                  data-testid="chat-button"
                  onClick={toggleChat}
                  className="text-black p-3 rounded-full"
                >
                  <IoChatbubblesOutline size={24} />
                </button>
                {isChatOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end z-40">
                    <div
                      data-testid="chat-container"
                      className="bg-white w-full max-w-sm md:max-w-lg h-5/6 rounded shadow-lg p-4 relative overflow-hidden mr-10 mb-10"
                    >
                      <button
                        data-testid="close-button"
                        onClick={toggleChat}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes size={24} />
                      </button>
                      <Chat />
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
        <NotificationPane
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <div className="w-[5%] hidden tablet:flex">
          {!isLoggedIn ? (
            <Link to="/login" className="text-lg">
              <RxAvatar className="text-2xl" />
            </Link>
          ) : (
            <Link to="/view-edit-profile" className="text-sm">
              <RxAvatar className="text-2xl" />
            </Link>
          )}
        </div>
        <div className="flex gap-10 items-center">
          <CiSearch
            className="text-xl flex tablet:hidden"
            onClick={() => setShowSearch(!showSearch)}
          />
          <button
            onClick={() => setIsBurgerShown(!burgerShown)}
            className="tablet:hidden"
          >
            {!burgerShown ? (
              <RxHamburgerMenu className="text-3xl" />
            ) : (
              <RxCross2 className="text-3xl" />
            )}
          </button>
        </div>

        {burgerShown && (
          <div className="bg-black flex tablet:hidden z-10 absolute w-[80%] tablet:w-[60%] top-[10%] right-[15%] border border-gray_100 rounded-sm">
            <ul className="w-full p-4 space-y-2">
              <li className="bg-gray rounded-sm">
                <Link to="" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                    <IoMdHome />
                    <p className="text-xs">Home</p>
                  </div>
                </Link>
              </li>
              <li className="rounded-sm hover:bg-white">
                <Link
                  to=""
                  className="text-lg"
                  onClick={() => {
                    setIsBurgerShown(false);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="flex-between justify-center space-x-1 p-2">
                    <Badge badgeContent={unreadCount} color="primary">
                      <IoNotificationsOutline
                        size={24}
                        className="text-gray_100"
                      />
                    </Badge>
                    <p className="text-xs text-gray_100">Notifications</p>
                    <NotificationPane
                      open={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                    />
                  </div>
                </Link>
              </li>

              <li className="rounded-sm hover:bg-white transition-all">
                <Link to="" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                    <CiHeart className="text-gray_100" />
                    <p className="text-xs text-gray_100">My wishlist</p>
                  </div>
                </Link>
              </li>
              <li className=" rounded-sm hover:bg-white transition-all">
              <Link to="/cart" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <div className="relative">
                  <IoCartOutline className="text-gray_100" />
                  {count >0 && <p className="bg-red-500 p-1 text-1 flex items-center justify-center text-white absolute rounded-full top-[-3px] right-[-3px] text-[8px] h-[13px] w-[13px]">{count}</p>}
                  </div>

                  <p className="text-xs text-gray_100">My cart</p>
                </div>
              </Link>
            </li>

              <li className="rounded-sm hover:bg-white transition-all">
                <Link to="" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                    <IoLocationOutline className="text-gray_100" />
                    <p className="text-xs text-gray_100">My Orders</p>
                  </div>
                </Link>
              </li>
              {isLoggedIn && (
                <li className="flex items-center justify-center space-x-1 p-2 rounded-sm">
                  <button
                    data-testid="chat-button"
                    onClick={toggleChat}
                    className="text-gray flex items-center"
                  >
                    <Badge badgeContent={unreadMessagesCount} color="primary">
                      <IoChatbubblesOutline size={17} />
                    </Badge>

                    <span className="text-xs text-gray_100 ml-1">Chat</span>
                  </button>

                  {isChatOpen && (
                    <div className="fixed inset-0 text-white bg-opacity-50 flex justify-end items-end z-40">
                      <div
                        data-testid="chat-container"
                        className="bg-white w-full max-w-sm md:max-w-lg h-5/6 rounded shadow-lg p-4 relative overflow-hidden mr-10 mb-10"
                      >
                        <button
                          data-testid="close-button"
                          onClick={toggleChat}
                          className="absolute top-2 right-2 text-black hover:text-gray-700"
                        >
                          <FaTimes size={24} />
                        </button>
                        <Chat />
                      </div>
                    </div>
                  )}
                </li>
              )}
              <li className="rounded-sm hover:bg-white transition-all">
                {isLoggedIn ? (
                  <Link
                    to="/view-edit-profile"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 p-2">
                      <RxAvatar className="text-gray_100" />
                      <p className="text-xs text-gray_100">Profile</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 p-2">
                      <IoMdLogIn className="text-gray_100" />
                      <p className="text-xs text-gray_100">Login</p>
                    </div>
                  </Link>
                )}
              </li>
              {isLoggedIn && (
                <li className="rounded-sm hover:bg-white transition-all">
                  <Link to="/logout" className="text-lg">
                    <div className="flex-between justify-center space-x-1 p-2">
                      <IoMdLogOut className="text-gray_100" />
                      <p className="text-xs text-gray_100">Logout</p>
                    </div>
                  </Link>
                </li>
              )}
              <li className="rounded-sm hover:bg-white transition-all">
                <Link to="/settings" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                    <IoSettingsSharp className="text-gray_100" />
                    <p className="text-xs text-gray_100">Settings</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {showSearch && (
        <div className="transition-all duration-300">
          <SearchComponent />
        </div>
      )}
    </div>
  );
};

export default Navbar;