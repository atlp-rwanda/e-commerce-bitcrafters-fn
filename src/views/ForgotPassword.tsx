import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
// import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import { GrFormNextLink } from "react-icons/gr";
import axiosClient from "../hooks/AxiosInstance";

const ForgotPassword: React.FC = () => {
  const client = axiosClient();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(emailPattern, "Please enter a valid email"),
  });

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      const response = await client.post("/users/reset/link", {
        email: values.email
      });

      if (response.status === 200) {
        toast.success("Password reset email sent");
      } else {
        toast.error("Error sending reset email");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center h-fit-content">
      <div className="container flex flex-col items-center justify-center w-full max-w-lg p-5 rounded-lg">
        <div className="mb-20 w-full">
          <h1 className="forgotP text-center text-xl font-bold mb-3">
            FORGOT PASSWORD
          </h1>
          <p className="text-center mb-3">
            Enter the email address associated with your account
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleForgotPassword(values);
            }}
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
              <form
                className="w-full flex flex-col space-y-5 h-[45%] justify-end py-2.5"
                onSubmit={handleSubmit}
              >
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
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`reset-btn mt-5 w-full py-3 text-white text-sm rounded-sm flex items-center justify-center ${
                    isValid
                      ? "bg-main-black-color"
                      : "bg-main-black-color opacity-50 cursor-not-allowed"
                  }`}
                >
                  Send Code <GrFormNextLink className="icon ml-2" />
                </button>
              </form>
            )}
          </Formik>
          <p className="login-register text-xs mb-3 text-center">
            Already have an account.{" "}
            <Link to="/login" className="text-customBlue hover:text-customBlue-hover">
              Login
            </Link>
          </p>
          <p className="login-register text-xs text-center">
            Don't have an account.{" "}
            <Link to="/register" className="text-customBlue hover:text-customBlue-hover">
              Create One
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
