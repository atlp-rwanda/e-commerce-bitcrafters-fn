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
import { IoMdLogOut } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchComponent from "./SearchComponent";
import Badge from "@mui/material/Badge";
import "react-toastify/dist/ReactToastify.css";
import { useNotifications } from "./notificationtoast";
import NotificationPane from "../views/NotificationPane";
import { FaTimes } from "react-icons/fa";
import Chat from "../views/chat/Chat";
import { setAuthRole, setAuthToken, setIsLoggedIn } from "../redux/authSlice";
import { toast } from "react-toastify";
import { MdSpaceDashboard } from "react-icons/md";

interface NavbarProps {
  burgerShown?: boolean;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );
  const authRole = useSelector(
    (state: RootState) => state.auth.authRole,
    shallowEqual,
  );
  const username = useSelector(
    (state: RootState) => state.auth.username,
    shallowEqual,
  );

  const unreadMessagesCount = useSelector(
    (state: RootState) => state.chat.unreadMessagesCount,
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const { count } = useSelector((state: any) => state.cart);
  const wishListCount = useSelector((state: any) => state.wishList?.count ?? 0);
  const [burgerShown, setIsBurgerShown] = useState(props.burgerShown || false);
  const [showSearch, setShowSearch] = useState(props.showSearch || false);
  const { unreadCount } = useNotifications();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleLogout = async () => {
    try {
      
        dispatch(setIsLoggedIn(false));
        dispatch(setAuthToken(null));
        dispatch(setAuthRole(null));
      
    } catch (error) {
      toast.error("logout failed");
    }
  };

  return (
    <div className=" w-full flex flex-col  ">
    <nav className="navbar-container  w-full border-b-1 p-8 flex-between space-x-2 border-b-[1px] border-gray_100">
      <Link to="/" className="nav-logo w-[20%] ">
        <img src={Logo} alt="Logo" className="w-24 object-contain " />
      </Link>
      <div className="nav-link flex-between  w-[30%] hidden tablet:flex">
        <ul className="flex-between space-x-4">
          <li>
            <Link to="/" className="text-sm">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-sm">
              About
            </Link>
          </li>
          <li>
            <Link to="/" className="text-sm">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/" className="text-sm">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-icons flex-between hidden tablet:flex">
        <ul className="flex-between space-x-4">
          <li>
            <div className="search-container bg-gray rounded-sm flex-between space-x-2 p-2 cursor-pointer" onClick={()=>setShowSearch(!showSearch)}>
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
                    {" "}
                    <IoCartOutline size={24} aria-label="Cart"/>
                    {count >0 && <p className="bg-red-500 p-1 text-1 flex items-center justify-center text-white absolute rounded-full bottom-[-3px] right-[-3px] text-[8px] h-[13px] w-[13px]">{count}</p>}
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
                    <Link to="/orders" className="text-lg">
                      <IoLocationOutline size={24} />
                    </Link>
                  </li>
                
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
              </>
            )}
          </ul>
        </div>
        <NotificationPane
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <div className=" hidden tablet:flex">
          {!isLoggedIn ? (
            <Link to="/login" className="flex gap-2 rounded-full bg-black p-3 px-6">
                <p className="text-white text-sm">Log in</p>
            </Link>
          ) : (
            <div className="text-sm w-[5%]  relative group transition-all">
              <div className="absolute hidden  transition-all group-hover:flex flex-col gap-1 p-2 left-[-90px] bottom-[-90px]  bg-gray rounded border border-gray_100">
              <Link
                    to="/view-edit-profile"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 gap-2 p-2 px-5 hover:bg-neutral-300 rounded">
                      <RxAvatar className="text-black" title={username as string} />
                      <p className="text-xs text-black">Profile</p>
                    </div>
                  </Link>
    {  authRole =="admin" &&            <Link
                    to="/admin"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 gap-2 p-2 px-5 hover:bg-neutral-300 rounded">
                      <MdSpaceDashboard className="text-black" />
                      <p className="text-xs text-black">Dashboard</p>
                    </div>
                  </Link>}
{  authRole =="seller" &&            <Link
                    to="/seller"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 gap-2 p-2 px-5 hover:bg-neutral-300 rounded">
                      <MdSpaceDashboard className="text-black" />
                      <p className="text-xs text-black">Dashboard</p>
                    </div>
                  </Link>}
                <Link to="" className="text-lg" >
                <Link to="" className="text-lg" onClick={()=>{handleLogout()}}>
                    <div className="flex-between justify-center space-x-1 p-2">
                      <IoMdLogOut className="text-black" />
                      <p className="text-xs text-black">Logout</p>
                    </div>
                  </Link>
                  </Link>
              </div>
              <RxAvatar className="text-2xl" />
              <p>{username}</p>
            </div>
          )}
        </div>
        <div className="flex gap-10 items-center">
          <CiSearch
            className="text-xl flex tablet:hidden"
            onClick={() => setShowSearch(!showSearch)}
          />
          {!isLoggedIn ? (
            <Link to="/login" className="flex gap-2 rounded-full bg-black p-3 px-6 tablet:hidden">
                <p className="text-white text-sm">Log in</p>
            </Link>
          ) : (
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
          )}
        </div>

       {isLoggedIn && burgerShown && (
          <div className="bg-black flex tablet:hidden z-10 absolute w-[80%] tablet:w-[60%] top-[10%] right-[15%] border border-gray_100 rounded-sm">
            <ul className="w-full p-4 space-y-2">
              <li className="bg-gray rounded-sm">
                <Link to="/" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                    <IoMdHome />
                    <p className="text-xs">Home</p>
                  </div>
                </Link>
              </li>

              <li>
              {  authRole =="admin" &&            <Link
                    to="/admin"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 gap-2 p-2 px-5 hover:bg-neutral-300 rounded">
                      <MdSpaceDashboard className="text-gray_100" />
                      <p className="text-xs text-gray_100">Dashboard</p>
                    </div>
                  </Link>}

              </li>
              <li>
              {  authRole =="seller" &&            <Link
                    to="/seller"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 gap-2 p-2 px-5 hover:bg-neutral-300 rounded">
                      <MdSpaceDashboard className="text-gray_100" />
                      <p className="text-xs text-gray_100">Dashboard</p>
                    </div>
                  </Link>}
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
                <Link to="/wishList" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2">
                  <Badge badgeContent={wishListCount} color="primary">
                    <CiHeart className="text-gray_100" />
                  </Badge>
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
         
              <li className="rounded-sm hover:bg-white transition-all">
                  <Link
                    to="/view-edit-profile"
                    className="text-lg"
                    onClick={() => setIsBurgerShown(false)}
                  >
                    <div className="flex-between justify-center space-x-1 p-2">
                      <RxAvatar className="text-gray_100" title={username as string}/>
                      <p className="text-xs text-gray_100">Profile</p>
                    </div>
                  </Link>
              </li>

                <li className="rounded-sm hover:bg-white transition-all">
                  <Link to="" className="text-lg" onClick={()=>{handleLogout()}}>
                    <div className="flex-between justify-center space-x-1 p-2">
                      <IoMdLogOut className="text-gray_100" />
                      <p className="text-xs text-gray_100">Logout</p>
                    </div>
                  </Link>
                </li>
            </ul>
          </div>
        )}
      </nav>
      {showSearch && (
        <div className="absolute top-24 w-full h-[75%] tablet:h-[70%] z-10 transition-all duration-300">
          <SearchComponent
          hideSearch={()=>{setShowSearch(false)}}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;