import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setAuthRole,
  setAuthToken,
  setAuthUserId,
  setIsLoggedIn,
} from "../redux/authSlice";
import { useDispatch } from "react-redux";
import axiosClient from "../hooks/AxiosInstance";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./Login";

const TwoFactorAuth: React.FC = () => {
  const client = axiosClient();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const notify = (message: string) => toast(message);
  let email = location.state?.email;
  const urlParams = new URLSearchParams(location.search);
  const emailParam = urlParams.get("email");

  if (emailParam) {
    email = emailParam;
  }
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const response = await client.post(`/users/login/verify/otp/${email}`, {
        otp: otp.join(""),
      });

      if (response.status === 200) {
        const token = response.data.jwt;
        const decodedToken: DecodedToken = jwtDecode(response.data.jwt);
        dispatch(setAuthToken(token));
        dispatch(setAuthRole("seller"));
        dispatch(setIsLoggedIn(true));
       dispatch(setAuthUserId(decodedToken.id));
        navigate("/seller");
        notify("Login successful");
      }
    } catch (err: any) {
      notify(
        err.response ? err.response.data.message : "OTP verification failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      {" "}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-center">VERIFY OTP</h2>{" "}
        <h2 className="text-base  mb-6 text-center">
          {" "}
          Enter the OTP code sent to your email{" "}
        </h2>
        <div className="flex space-x-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el!)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleVerifyOtp}
            className={`text-white text-sm bg-black rounded-sm mt-2 px-4 w-1/3 py-3 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"}
            {!isLoading && (
              <FontAwesomeIcon icon={faArrowRight} size="lg" className="ml-2" />
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TwoFactorAuth;
