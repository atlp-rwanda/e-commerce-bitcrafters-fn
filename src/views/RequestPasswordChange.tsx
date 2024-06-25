import React, { useState } from "react";
import TextInput from "../components/TextInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { Formik } from "formik";
// import { Link } from "react-router-dom";
import axiosClient from "../hooks/AxiosInstance";
import { useLocation } from "react-router-dom";

const RequestPasswordChange: React.FC = () => {
  const location = useLocation();
  const client = axiosClient();
  const notify = (message: string) => toast(message);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email")
      .matches(emailPattern, "Please enter a valid email"),
  });

  const handleSendResetEmail = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      const response = await client.post(`/users/reset/link`, {
        email: values.email,
      });

      if (response.status === 200) {
        setIsLoading(false);
        notify(response.data.message);
        setShowText(true);
      }
    } catch (err: any) {
      setIsLoading(false);
      notify(err.response ? err.response.data.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const thisEmail = location.state.email;

  return (
    <div className="container m-3  flex space-x-2 items-center justify-center min-h-[80vh] ">
      <div className="content flex flex-col  gap-5 space-y-5 w-[100%]  phone:w-[80%] tablet:w-[40%]  justify-start items-start  h-full">
        <h3 className="text-lg font-semibold text-center self-center">
          {" "}
          CHANGE PASSWORD
        </h3>
        <p className="text-sm py-2">Your password has expired. Please enter email associated with your account to renew it</p>

        <Formik
          initialValues={{ email: thisEmail as any }}
          validateOnMount={true}
          onSubmit={(values) => {
            handleSendResetEmail(values);
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
            <form className="w-full flex flex-col space-y-10 h-[45%] justify-end">
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
              <div className="flex flex-col ">
                {!showText && (
                  <button
                    type="submit"
                    onClick={(event) => {
                      event.preventDefault();
                      handleSubmit();
                    }}
                    disabled={!isValid}
                    className={
                      isValid
                        ? "text-white text-sm bg-black rounded-sm mt-2 px-4 w-full py-3"
                        : "text-white text-sm bg-black opacity-[.7] rounded-sm mt-2 px-4 w-full py-3"
                    }
                  >
                    {isLoading ? "Loading..." : "Continue"}
                  </button>
                )}
              </div>
            </form>
          )}
        </Formik>
        {showText && (
          <p className="text-sm">
            An email with your password reset link has been sent to your account
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default RequestPasswordChange;
