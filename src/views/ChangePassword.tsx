import React, { useState } from "react";
import TextInput from "../components/TextInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../hooks/AxiosInstance";

const ChangePassword: React.FC = () => {
  const client = axiosClient();
  const navigate = useNavigate();
  const notify = (message: string) => toast(message);

  const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must contain at least 6 characters"),
  });

  const handlePasswordChange = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      const response = await client.post(`/users/reset/password/${token}`, {
        password: values.password,
      });

      if (response.status === 200) {
        setIsLoading(false);
        notify(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (err: any) {
      setIsLoading(false);
      notify(err.response ? err.response.data.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container m-3 my-10 tablet:my-2 flex space-x-2 items-center justify-center tablet:min-h-[80vh] ">
      <div className="content flex flex-col  gap-5 space-y-4 w-[70%]  phone:w-[80%] tablet:w-[40%]  justify-start items-start  h-full">
        <h3 className="text-lg font-semibold text-center self-center">
          RESET PASSWORD
        </h3>
        <p className="text-sm py-2">Set a new password</p>

        <Formik
          initialValues={{ oldPassword: "", password: "" }}
          validateOnMount={true}
          onSubmit={(values) => {
            handlePasswordChange(values);
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
                title="New Password"
                placeholder="Enter new password"
                value={values.password}
                onChange={handleChange("password")}
              />
              <div className="flex flex-col ">
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
                  {isLoading ? "Loading..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
