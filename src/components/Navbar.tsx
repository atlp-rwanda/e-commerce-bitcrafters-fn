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
import { IoMdHome } from "react-icons/io";
import { useSelector } from "react-redux";

interface NavbarProps {
  burgerShown?: boolean; // Make burgerShown optional
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { isLoggedIn } = useSelector((state: any) => state.auth);

  const [burgerShown, setIsBurgerShown] = useState(props.burgerShown || false);
  return (
    <nav className="navbar-container  w-full border-b-1 p-8 flex-between space-x-2">
      <div className="nav-logo w-[20%] ">
        <img src={Logo} alt="Logo" className="w-24 object-contain " />
      </div>
      <div className="nav-link flex-between  w-[30%] hidden tablet:flex">
        <ul className="flex-between space-x-4">
          <li>
            <Link to="" className="text-sm">
              Home
            </Link>
          </li>
          <li>
            <Link to="" className="text-sm">
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
            <div className="search-container bg-gray rounded-sm flex-between space-x-2 p-2">
              <p className="text-xs">search here</p>
              <CiSearch />
            </div>
          </li>
          <li>
            <Link to="" className="text-lg">
              {" "}
              <CiHeart />
            </Link>
          </li>
          <li>
            <Link to="" className="text-lg">
              {" "}
              <IoCartOutline />
            </Link>
          </li>
          <li>
            <Link to="" className="text-lg">
              {" "}
              <IoNotificationsOutline />
            </Link>
          </li>
        </ul>
      </div>
      <div className=" w-[5%] hidden tablet:flex">
        <Link to="login" className="text-lg">
          {" "}
          <RxAvatar className="text-2xl" />
        </Link>
      </div>
      <button
        onClick={() => setIsBurgerShown(!burgerShown)}
        className="tablet:hidden"
      >
        {!burgerShown ? (
          <RxHamburgerMenu className="text-3xl " />
        ) : (
          <RxCross2 className="text-3xl " />
        )}
      </button>

      {burgerShown && (
        <div className=" bg-black  flex tablet:hidden z-10 absolute w-[80%] tablet:w-[60%] top-[10%] right-[15%] border border-gray_100 rounded-sm">
          <ul className="w-full p-4 space-y-2">
            <li className="bg-gray rounded-sm">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <IoMdHome />
                  <p className="text-xs">Home</p>
                </div>
              </Link>
            </li>
            <li className=" rounded-sm hover:bg-white">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <IoNotificationsOutline className="text-gray_100" />
                  <p className="text-xs text-gray_100">Notifications</p>
                </div>
              </Link>
            </li>

            <li className=" rounded-sm hover:bg-white transition-all">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <CiHeart className="text-gray_100" />
                  <p className="text-xs text-gray_100">My wishlist</p>
                </div>
              </Link>
            </li>
            <li className=" rounded-sm hover:bg-white transition-all">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <IoCartOutline className="text-gray_100" />
                  <p className="text-xs text-gray_100">My cart</p>
                </div>
              </Link>
            </li>

            <li className=" rounded-sm hover:bg-white transition-all">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <IoLocationOutline className="text-gray_100" />
                  <p className="text-xs text-gray_100">My Orders</p>
                </div>
              </Link>
            </li>

            <li className=" rounded-sm hover:bg-white transition-all">
              <Link to="" className="text-lg">
                <div className="flex-between justify-center space-x-1 p-2 ">
                  <IoSettingsSharp className="text-gray_100" />
                  <p className="text-xs text-gray_100">User Settings</p>
                </div>
              </Link>
            </li>

            {isLoggedIn ? (
              <li className=" rounded-sm hover:bg-white transition-all">
                <Link to="" className="text-lg">
                  <div className="flex-between justify-center space-x-1 p-2 ">
                    <IoMdLogOut className="text-gray_100" />
                    <p className="text-xs text-gray_100">Logout</p>
                  </div>
                </Link>
              </li>
            ) : (
              <li className=" rounded-sm hover:bg-white transition-all">
                <Link to="/login" className="text-lg" onClick={()=>{setIsBurgerShown(!burgerShown)}}>
                  <div className="flex-between justify-center space-x-1 p-2 ">
                    <IoMdLogIn className="text-gray_100" />
                    <p className="text-xs text-gray_100">Login</p>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
