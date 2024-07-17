import React, { useState } from "react";
import TextInput from "../components/TextInput.tsx";
import Hero from "../assets/images/women-signup.svg";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import {
  setAuthRole,
  setAuthToken,
  setAuthUserId,
  setIsLoggedIn,
} from "../redux/authSlice";
import { useDispatch } from "react-redux";
import axiosClient from "../hooks/AxiosInstance";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { PUBLIC_URL } from "../constants";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  email: string;
  id: string;
  username: string;
  userRole: string;
  otp?: string
}
const Login: React.FC = () => {
  const client = axiosClient();
  const notify = (message: string) => toast(message);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
  
  const backendUrl = PUBLIC_URL;

  const loginWithGoogle = async () => {
    try {
      window.open(`${backendUrl}users/google`, "_self");

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        const bearerToken = `Bearer ${token}`;
        localStorage.setItem("AUTH_TOKEN", bearerToken);
        dispatch(setAuthToken(token));
        dispatch(setIsLoggedIn(true));
      }
    } catch (error) {
      notify("Login with Google failed");
    }
  };
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(emailPattern, "Please enter a valid email")
      .transform(value => value?.toLowerCase().trim()),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must contain at least 6 characters"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    if (isLoading) return; 
    setIsLoading(false);
    try {
      setIsLoading(true);
      const response = await client.post(`/users/login`, {
        email: values.email.toLowerCase(),
        password: values.password,
      });
      if (response.status === 200) {
        setIsLoading(false);
        if (response.data.message.includes("OTP")) {
          navigate("/verify-otp", { state: { email: values.email } });
          notify(response.data.message);
        } else {
          const decodedToken: DecodedToken = jwtDecode(response.data.authToken);
          let userRole = decodedToken.userRole;
          dispatch(setAuthToken(response.data.authToken));
          dispatch(setAuthRole(userRole));
          dispatch(setIsLoggedIn(true));
          dispatch(setAuthUserId(decodedToken.id));

          notify(response.data.message);
          setTimeout(() => {
            if (userRole === "admin") {
              navigate("/admin");
            } else if (userRole === "buyer") {
              navigate("/");
            } else {
              navigate("/");
            }
          }, 2500);
        }
      }
    } catch (err: any) {
      notify(err.response ? err.response.data.message : "Login failed");

      if (
        err?.response?.data?.message ===
        "Your password has expired please update it"
      ) {
        setTimeout(() => {
          navigate("/request", { state: { email: values.email } });
        }, 2500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container m-3 tablet:m-10 flex space-x-2 items-center justify-center tablet:min-h-[100vh] px-10">
      <div className="image-container hidden tablet:flex tablet:w-[45%] ">
        <img src={Hero} alt="Women" className="w-[80%]" />
      </div>

      <div className="content flex flex-col  gap-5 space-y-4 w-[100%]  phone:w-[80%] tablet:w-[40%] justify-start items-start  h-full">
        <h3 className="text-lg font-semibold text-center self-center">
          LOGIN TO CONTINUE
        </h3>
        <p className="text-smpy-2">Enter details below</p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validateOnMount={true}
          onSubmit={(values) => {
            handleLogin(values);
          }}
          validationSchema={loginSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid,
          }) => (
            <form className="w-full flex flex-col space-y-5 h-[45%] justify-end">
              <TextInput
                error={errors.email && touched.email ? `${errors.email}` : ""}
                borderColor={errors.email && touched.email ? `red` : "gray"}
                onBlur={handleBlur("email")}
                secured={false}
                type="email"
                title="Email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange("email")}
              />
              <TextInput
                error={
                  errors.password && touched.password
                    ? `${errors.password}`
                    : ""
                }
                borderColor={
                  errors.password && touched.password ? `red` : "gray"
                }
                onBlur={handleBlur("password")}
                secured={true}
                type="password"
                title="Password"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange("password")}
              />
              <div className="flex flex-col ">
                <p className="text-xs">
                  <Link
                    to="/forgot-password"
                    className="text-blue-500 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </p>

                <Button
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                  disabled={!isValid}
                  color={isValid ? "rgb(38 38 38)" : "rgba(0,0,0,.5)"}
                  value={isLoading ? "Loading..." : "Login"}
                />
              </div>
            </form>
          )}
        </Formik>
        <p className="text-center align-middle self-center ">- OR -</p>

        <Button
          icon={<FcGoogle />}
          value="Continue with google"
          type="submit"
          onClick={loginWithGoogle}
        />

        <p className="text-sm">
          Don't have an account.{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-800">
            Create One
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;