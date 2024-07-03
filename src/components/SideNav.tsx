import profileImage from "../assets/images/profileImage.svg";

import React, { useEffect, useState } from "react";
import Logo from "../assets/images/Bit.Shop.svg";
import { CiSearch } from "react-icons/ci";
import {
  MdSpaceDashboard,
  MdOutlineSpaceDashboard,
  MdShoppingCart,
  MdOutlineShoppingCart,
  MdReviews,
  MdOutlineReviews,
} from "react-icons/md";
import { MdOutlineStorefront, MdStorefront } from "react-icons/md";
import { IoPersonOutline, IoPerson } from "react-icons/io5";

import { RiSettings3Fill, RiSettings3Line } from "react-icons/ri";
import {
  IoIosNotifications,
  IoIosNotificationsOutline,
  IoMdLogOut,
} from "react-icons/io";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import DashboardButton from "./DashBoardButton";
import axiosClient from "../hooks/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Badge from "@mui/material/Badge";
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from "./notificationtoast";

interface User {
  id: number;
  username: string;
  email: string;
  userRole: string;
  status: string;
  profileImageUrl: string;
}
interface InputProps {
  heading?: string;
  subheading?: string;
  color?: string | any;
  icon?: any;
}

const DashBoardSideBar: React.FC<InputProps> = () => {
  const [isSelected, setIsSelected] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { unreadCount } = useNotifications();

  const navigate = useNavigate();
  const notify = (message: string) => toast(message);

  const client = axiosClient();
  const fetchProfile = async () => {
    try {
      const response = await client.get("/users/profile");
      setUser(response.data);
    } catch (err: any) {
      notify(err.response ? err : "Fetching users failed");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div
      data-testid="side-nav"
      className={
        showMenu
          ? "flex p-3 tablet:p-7 pb-2 resize-x items-center justify-between  flex-col tablet:w-[20%] bg-white border border-gray_100 rounded h-full transition-all"
          : "flex p-4 w-24 pb-2 resize-x items-center justify-between  flex-col  bg-white border border-gray_100 rounded h-full transition-all"
      }
    >
      <div className=" w-full flex items-center justify-between   gap-3">
        {showMenu && (
          <img
            src={Logo}
            alt=""
            className="w-16 tablet:w-24  tablet:flex p-2 "
          />
        )}
        {showMenu ? (
          <IoIosArrowBack
            className="text-2xl tablet:text-4xl self-end mx-auto bg-black text-white rounded-full p-1"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            data-testid="menu-toggle-button"
          />
        ) : (
          <IoIosArrowForward
            className="text-xl tablet:text-3xl mx-auto  bg-black text-white rounded-full p-1  "
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            data-testid="menu-toggle-button2"
          />
        )}
      </div>

      <div className="search flex items-center self-start gap-2 justify-start rounded-full p-2  border border-gray_100 my-3 w-full">
        <CiSearch className="text-xl self-center " />
        {showMenu && (
          <input
            type="text"
            placeholder="Search ..."
            className="rounded flex p-1 w-full outline-none tablet:w-full  text-black text-sm bg-transparent"
          />
        )}
      </div>

      <div className="dashboard-link-container w-full overflow-y-auto bg-red-70 h-[45%] pt-10 flex flex-col items-center justify-center transition-all">
        <div className="link w-full">
          <DashboardButton
            dataTestId="dashboard-button"
            icon={
              isSelected == "dashboard" ? (
                <MdSpaceDashboard className="text-white text-lg tablet:text-2xl" />
              ) : (
                <MdOutlineSpaceDashboard className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "Dashboard" : ""}
            onClick={() => {
              setIsSelected("dashboard");
              navigate("/admin/dashboard");
            }}
            color={isSelected == "dashboard" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "dashboard" ? "white" : "rgb(38 38 38)"}
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>

        <div className="link w-full">
          <DashboardButton
            dataTestId="user-button"
            icon={
              isSelected == "users" ? (
                <IoPerson className="text-white text-lg tablet:text-2xl" />
              ) : (
                <IoPersonOutline className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "Users" : ""}
            onClick={() => {
              setIsSelected("users");
              navigate("/admin/users");
            }}
            // rounded='8px'
            color={isSelected == "users" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "users" ? "white" : "rgb(38 38 38)"}
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>

        <div className="link w-full">
          <DashboardButton
            dataTestId="product-button"
            icon={
              isSelected == "products" ? (
                <MdStorefront className="text-white text-lg tablet:text-2xl" />
              ) : (
                <MdOutlineStorefront className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "Products" : ""}
            onClick={() => {
              setIsSelected("products");
              navigate("/admin/products");
            }}
            color={isSelected == "products" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "products" ? "white" : "rgb(38 38 38)"}
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>
        <div className="link w-full">
          <DashboardButton
            dataTestId="notification-button"
            icon={
              isSelected == "notifications" ? (
                
                <Badge badgeContent={unreadCount} color="primary">
                <IoIosNotifications className="text-white text-lg tablet:text-2xl" size={24} />
              </Badge>
              ) : (
                
                <Badge badgeContent={unreadCount} color="primary">
                <IoIosNotificationsOutline className="text-black text-lg tablet:text-2xl" size={24} />
              </Badge>
              )
            }
            value={showMenu ? "Notificarions" : ""}
            onClick={() => {
              setIsSelected("notifications");
              navigate("/admin/notifications");
            }}
            color={isSelected == "notifications" ? "rgb(38 38 38)" : "white"}
            textColor={
              isSelected == "notifications" ? "white" : "rgb(38 38 38)"
            }
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>
        <div className="link w-full">
          <DashboardButton
            dataTestId="orders-button"
            icon={
              isSelected == "order" ? (
                <MdShoppingCart className="text-white text-lg tablet:text-2xl" />
              ) : (
                <MdOutlineShoppingCart className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "Orders" : ""}
            onClick={() => {
              setIsSelected("order");
              navigate("/admin/orders");
            }}
            color={isSelected == "order" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "order" ? "white" : "rgb(38 38 38)"}
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>
        <div className="link w-full">
          <DashboardButton
            dataTestId="review-button"
            icon={
              isSelected == "reviews" ? (
                <MdReviews className="text-white text-lg tablet:text-2xl" />
              ) : (
                <MdOutlineReviews className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "Reviews" : ""}
            onClick={() => {
              setIsSelected("reviews");
              navigate("/admin/reviews");
            }}
            color={isSelected == "reviews" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "reviews" ? "white" : "rgb(38 38 38)"}
            showFull={showMenu}
            borderColor={"1px solid rgb(240 238 237)"}
          />
        </div>
      </div>

      <div className="w-full  flex flex-col justify-end">
        <div className="link w-full">
          <DashboardButton
            dataTestId="setting-button"
            icon={
              isSelected == "settings" ? (
                <RiSettings3Fill className="text-white text-lg tablet:text-2xl" />
              ) : (
                <RiSettings3Line className="text-black text-lg tablet:text-2xl" />
              )
            }
            value={showMenu ? "settings" : ""}
            onClick={() => {
              setIsSelected("settings");
              navigate("/admin/settings");
            }}
            color={isSelected == "settings" ? "rgb(38 38 38)" : "white"}
            textColor={isSelected == "settings" ? "white" : "rgb(38 38 38)"}
          />
        </div>
        <div className="link w-full">
          <DashboardButton
            dataTestId="logout-button"
            icon={<IoMdLogOut className="text-black text-lg tablet:text-2xl" />}
            value={showMenu ? "Logout" : ""}
            reverse={true}
            onClick={() => {
              setIsSelected("logout");
            }}
            color={"white"}
            textColor={"rgb(38 38 38)"}
          />
        </div>

        <div className="flex gap-3 items-center justify-center my-5 border-t border-gray_100  align-bottom pt-2">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <img
                src={profileImage || user?.profileImageUrl}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-gray_100"
              />
              {showMenu && (
                <div className="flex flex-col ">
                  <p className="name text-xs tablet:text-sm font-semibold">
                    {user?.username}
                  </p>
                  <p className="text-[9px] tablet:text-xs">{user?.email}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoardSideBar;
