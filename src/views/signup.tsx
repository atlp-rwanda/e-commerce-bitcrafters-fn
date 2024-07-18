import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { AppDispatch } from '../redux/store';

const SignupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  return (
    <>
      <Formik
        initialValues={{ username: '',email: '', password: ''  }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          email: Yup
            .string()
            .required("Email is required")
            .matches(emailPattern, "Please enter a valid email")
            .transform(value => value?.toLowerCase().trim()),
          password: Yup.string().min(6, 'Must be at least 8 characters').required('Required'),
          
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await dispatch(signupUser(values)).unwrap();
            toast.success('Account created successfully! Check your email to verify.');
            resetForm();
          } catch (error: any) {
            toast.error(error.message ?? 'Signup failed. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <section>
              <div className="bg-white relative laptop:py-0">
                <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-0 mr-auto mb-0 ml-auto max-w-7xl xl:px-0 lg:flex-row">
                  <div className="flex flex-col items-center w-full pt-5 lg:pr-10 pb-10 lg:pl-10 xs:pr-0 xs:pl-0 lg:pt-20 lg:flex-row">
                    <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
                      <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                        <img src="bg0.svg" alt="Background" className="btn-" />
                      </div>
                    </div>

                    <div className="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-4xl lg:mt-0 lg:w-8/12">
                      <div className="flex flex-col items-start justify-start pt-0 lg:pr-10 pb-10 lg:pl-10 xs:pr-0 xs:pl-0 bg-white rounded-xl relative z-10">
                        <p className="w-full laptop:text-2xl font-medium phone:text-xl text-center leading-snug">CREATE ACCOUNT</p>

                        <span className="py-6 laptop:text-2xl font-medium phone:text-lg text-center ">Enter the details below</span>
                        <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                          <div className="relative">
                            <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Name</p>
                            <Field
                              name="username"
                              type="text"
                              placeholder="John"
                              className={`border placeholder-gray-400 focus:outline-none w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white rounded-sm ${touched.username && errors.username ? 'border-red-500' : 'border-gray_100'}`}
                              />
                            <ErrorMessage name="username" component="div" className="text-red-500 mt-2 " />
                          </div>
                          <div className="relative">
                            <p className="font-sans bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Email</p>
                            <Field
                              name="email"
                              type="email"
                              placeholder="123@ex.com"
                              className={`border placeholder-gray-400 focus:outline-none w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white rounded-sm ${touched.email && errors.email ? 'border-red-500' : 'border-gray_100'}`}
                              />
                            <ErrorMessage name="email" component="div" className="text-red-500 mt-2" />
                          </div>
                          <div className="relative">
                            <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">Password</p>
                            <Field
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Password"
                              className={`border placeholder-gray-400 focus:outline-none w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white rounded-sm ${touched.password && errors.password ? 'border-red-500' : 'border-gray_100'}`}
                              />
                              <div className="eye absolute top-[30%] right-[5%]">
                              <button onClick={() => setShowPassword(!showPassword)} type="button" className="" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <IoEyeOffOutline aria-hidden="true" /> : <IoEyeOutline aria-hidden="true" />}
                                </button>
                            </div>
                            <ErrorMessage name="password" component="div" className="text-red-500 mt-2" />
                          </div>
                          <div className="relative mt-3">
                            <button
                              type="submit"
                              className="w-full inline-block pt-4 pr-5 pb-4 pl-5 laptop:text-xl phone:text-lg font-medium text-center text-white bg-black rounded-lg transition duration-200 hover:bg-gray-700 ease"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>
                            <p className="text-gray-800 py-5 text-2xl text-center">OR</p>

                            <a
                              href="#"
                              className="w-full inline-flex pt-4 pr-5 pb-4 pl-5 laptop:text-xl phone:text-lg justify-center items-center text-center text-white bg-black rounded-lg transition duration-200 hover:bg-gray-700 ease"
                            >
                              <FcGoogle className="mr-2" size={24} /> Signup with Google
                            </a>
                          </div>

                          <p className="text-gray-800 py-2 text-xl phone:text-lg ">
                            Have an account? <Link to="/login"className="text-blue-500 no-underline">Sign In</Link> 
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </>
  );
};

export default SignupForm;
