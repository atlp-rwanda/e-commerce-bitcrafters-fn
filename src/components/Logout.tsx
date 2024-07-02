import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";
import useAxiosClient from "../hooks/AxiosInstance";
import { setAuthRole, setAuthToken, setIsLoggedIn } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Logout: React.FC = () => {
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axiosClient.post("/users/logout");
      if (response.status === 200) {
        dispatch(setIsLoggedIn(false));
        dispatch(setAuthToken(null));
        dispatch(setAuthRole(null));
        navigate("/login");
        toast.success("Logout successful");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <Link to="/login" onClick={handleLogout} className="text-lg">
      <div className="flex space-x-1 py-2 ">
        <RiLogoutCircleLine className="" />
        <p className="text-xs ">Logout</p>
      </div>
    </Link>
  );
};

export default Logout;
