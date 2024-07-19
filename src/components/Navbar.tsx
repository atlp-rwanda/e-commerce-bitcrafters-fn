import React, { useState } from "react";
import Logo from "../assets/images/Bit.Shop.svg";
import { RxHamburgerMenu, RxCross2, RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { CiSearch, CiHeart, CiSettings } from "react-icons/ci";
import { IoCartOutline, IoNotificationsOutline, IoLocationOutline, IoChatbubblesOutline} from "react-icons/io5";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchComponent from "./SearchComponent";
import Badge from "@mui/material/Badge";
import "react-toastify/dist/ReactToastify.css";
import { useNotifications } from "./notificationtoast";
import NotificationPane from "../views/NotificationPane";
import { FaTimes } from "react-icons/fa";
import Chat from "../views/chat/Chat";
import { TbDashboard } from "react-icons/tb";
import Logout from "./Logout";
import { IoMdHome } from "react-icons/io";

interface NavbarProps {
  burgerShown?: boolean;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  // const dispatch = useDispatch();
  const authRole = useSelector(
    (state: RootState) => state.auth.authRole,
    shallowEqual,
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const { count } = useSelector((state: any) => state.cart);
  const wishListCount = useSelector((state: any) => state.wishList?.count ?? 0);
  const [burgerShown, setIsBurgerShown] = useState(props.burgerShown || false);
  const [showSearch, setShowSearch] = useState(props.showSearch || false);
  const { unreadCount } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col">
      <nav className="navbar-container w-full border-b-1 p-8 flex-between space-x-2 border-b-[1px] border-gray_100">
        <div className="nav-logo w-[20%]">
          <img src={Logo} alt="Logo" className="w-24 object-contain" />
        </div>
        <div className="nav-link flex-between w-[30%] hidden tablet:flex">
          <ul className="flex-between space-x-4">
            <li data-testid="mobile-menu-home">
              <Link to="/" className="text-sm">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-sm">About</Link>
            </li>
            <li>
              <Link to="/" className="text-sm">Shop</Link>
            </li>
            <li>
              <Link to="/" className="text-sm">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="nav-icons flex-between hidden tablet:flex">
          <ul className="flex-between space-x-4">
            <li>
              <div className="search-container bg-gray rounded-sm flex-between space-x-2 p-2 cursor-pointer" onClick={() => setShowSearch(!showSearch)}>
                <p className="text-xs">search here</p>
                <CiSearch />
              </div>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/wishList" className="text-lg">
                    {" "}
                    <Badge badgeContent={wishListCount} color="primary">
                      <CiHeart size={24} aria-label="Heart" />
                    </Badge>
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-lg relative">
                    <IoCartOutline size={24} aria-label="Cart" />
                    {count > 0 && (
                      <p className="bg-red-500 p-1 text-1 flex items-center justify-center text-white absolute rounded-full bottom-[-3px] right-[-3px] text-[8px] h-[13px] w-[13px]">{count}</p>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to="" className="text-lg" data-testid="notifications-link">
                    <Badge badgeContent={unreadCount} color="primary">
                      <IoNotificationsOutline size={24} onClick={() => setIsModalOpen(true)} />
                    </Badge>
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-lg" data-testid="orders-link">
                    <IoLocationOutline size={24} />
                  </Link>
                </li>
                <li>
                  <button data-testid="chat-button" onClick={toggleChat} className="text-black p-3 rounded-full">
                    <IoChatbubblesOutline size={24} />
                  </button>
                  {isChatOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end z-40">
                      <div data-testid="chat-container" className="bg-white w-full max-w-sm md:max-w-lg h-5/6 rounded shadow-lg p-4 relative overflow-hidden mr-10 mb-10">
                        <button data-testid="close-button" onClick={toggleChat} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                          <FaTimes size={24} />
                        </button>
                        <Chat />
                      </div>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </div>
        <NotificationPane data-testid="notification-pane" open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <div className="hidden tablet:flex">
          {!isLoggedIn ? (
            <Link to="/login" className="flex gap-2 rounded-full bg-black p-3 px-6">
              <p className="text-white text-sm">Log in</p>
            </Link>
          ) : (
            <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="text-sm w-[5%]" data-testid="profile-button">
              <RxAvatar className="text-2xl" />
            </button>
          )}
        </div>
        <div className="flex gap-10 items-center">
          <CiSearch className="text-xl flex tablet:hidden" onClick={() => setShowSearch(!showSearch)} />
          {!isLoggedIn ? (
            <Link to="/login" className="flex gap-2 rounded-full bg-black p-3 px-6 tablet:hidden">
              <p className="text-white text-sm">Log in</p>
            </Link>
          ) : (
            <button onClick={() => setIsBurgerShown(!burgerShown)} className="tablet:hidden" data-testid="burger-button">
              {!burgerShown ? <RxHamburgerMenu className="text-3xl" /> : <RxCross2 className="text-3xl" />}
            </button>
          )}
        </div>
  {isLoggedIn && burgerShown && (
  <div className="bg-black flex tablet:hidden z-10 absolute w-[80%] tablet:w-[60%] top-[10%] right-[15%] border border-gray_100 rounded-sm" data-testid="mobile-menu">
    <ul className="w-full p-4 space-y-2">
      <li className="bg-gray rounded-sm">
        <Link to="/" className="text-lg">
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
              data-testid="notification-pane"
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </Link>
      </li>
      <li className="rounded-sm hover:bg-white transition-all">
        <Link to="/wishList" className="text-lg">
          <div className="flex-between justify-center space-x-1 p-2">
            <Badge badgeContent={wishListCount} color="primary">
              <CiHeart className="text-gray_100" />
            </Badge>
            <p className="text-xs text-gray_100">My wishlist</p>
          </div>
        </Link>
      </li>
      <li className="rounded-sm hover:bg-white transition-all">
        <Link to="/cart" className="text-lg">
          <div className="flex-between justify-center space-x-1 p-2 ">
            <div className="relative">
              <IoCartOutline className="text-gray_100" />
              {count > 0 && (
                <p className="bg-red-500 p-1 text-1 flex items-center justify-center text-white absolute rounded-full top-[-3px] right-[-3px] text-[8px] h-[13px] w-[13px]">
                  {count}
                </p>
              )}
            </div>
            <p className="text-xs text-gray_100">My cart</p>
          </div>
        </Link>
      </li>
      <li className="rounded-sm hover:bg-white transition-all">
        <Link to="/orders" className="text-lg">
          <div className="flex-between justify-center space-x-1 p-2">
            <IoLocationOutline className="text-gray_100" />
            <p className="text-xs text-gray_100">My Orders</p>
          </div>
        </Link>
      </li>
      <li className="flex items-center justify-center space-x-1 p-2 rounded-sm">
        <button
          data-testid="chat-button"
          onClick={toggleChat}
          className="text-gray flex items-center"
        >
          <Badge color="primary">
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
      <li className="rounded-sm hover:bg-white transition-all">
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
      </li>
      {(authRole === 'seller' || authRole === 'admin') && (
        <li className="rounded-sm hover:bg-white transition-all">
          <Link to={authRole === 'seller' ? '/seller' : '/admin'} className="text-lg">
            <div className="flex-between justify-center space-x-1 p-2">
              <TbDashboard className="text-gray_100" />
              <p className="text-xs text-gray_100">Dashboard</p>
            </div>
          </Link>
        </li>
      )}
      <li className="rounded-sm hover:bg-white transition-all">
        <Link to="/logout" className="text-lg">
          <div className="flex-between justify-center space-x-1 p-2">
            <Logout />
          </div>
        </Link>
      </li>
    </ul>
  </div>
)}
      </nav>
      {isProfileModalOpen && (
  <div className="absolute right-0 bg-gray shadow-lg rounded-lg p-4 m-12 z-50" style={{ minWidth: '250px' }} data-testid="profile-modal">
    <ul>
      <button data-testid="close-button" onClick={() => setIsProfileModalOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-60">
        <FaTimes size={16} />
      </button>
      <div className="flex flex-col items-center space-y-4">
        {authRole === "admin" || authRole === "seller" ? (
          <Link to={getDashboardLink(authRole)} className="flex items-center space-x-2">
            <TbDashboard size={24} />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link to="/view-edit-profile" className="flex items-center space-x-2">
            <CiSettings size={20} />
            <span className="text-sm">User settings</span>
          </Link>
        )}
        <Logout />
      </div>
    </ul>
  </div>
)}

      {showSearch && <SearchComponent />}
    </div>
  );
};
 export const getDashboardLink = (authRole:string) => {
    if (authRole === "seller") {
      return "/seller";
    } else if (authRole === "admin") {
      return "/admin";
    } else {
      return "/profile";
    }
  };
export default Navbar