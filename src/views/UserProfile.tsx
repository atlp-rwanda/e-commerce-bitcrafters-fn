import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosClient from "../hooks/AxiosInstance";
import SectionHeader from "../components/SectionHeader";
import Logout from "../components/Logout";
import defaultProfileImage from "../assets/images/profileImage.svg"; 

interface Profile {
  username: string;
  email: string;
  gender: string;
  birthdate: string;
  preferredLanguage: string;
  preferredCurrency: string;
  phoneNumber: string;
  homeAddress: string;
  billingAddress: string;
  profileImageUrl: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const axiosClient = useAxiosClient();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/users/profile");
        setProfile(response.data);
      } catch (error) {
      }
    };
    fetchProfile();
  }, [axiosClient]);

  const validationSchema = yup.object().shape({
    username: yup.string().min(3, "Username must be at least 3 characters"),
    gender: yup.string().oneOf(["male", "female"]),
    birthdate: yup.string(),
    preferredLanguage: yup.string(),
    preferredCurrency: yup.string(),
    phoneNumber: yup
      .string()
      .matches(
        /^(078|079|072|073)\d{7}$/,
        "Please provide a valid phone number starting with 078/079/072/073",
      ),
    homeAddress: yup.string(),
    billingAddress: yup.string(),
  });

  const handleSubmit = async (
    values: Omit<Profile, "email" | "profileImageUrl">,
  ) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key as keyof typeof values] as string);
      });

      if (profileImage) {
        formData.append("image", profileImage);
      }

      const response = await axiosClient.patch("users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setProfile(response.data);
        setIsEditing(false);
        setImagePreview(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleFieldClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (!profile)
    return (
      <div className="h-50vh ml-10 text-slate-600 text-blue-500">
        Loading...
        <div className="">
                <Logout />
              </div>
      </div>
    );

  return (
    <div className="container mx-auto p-6 w-full lg:ml-10">
      <div className="flex items-center pb-10">
        <SectionHeader title="My profile" />
      </div>
      <div className="lg:ml-20 mx-auto max-w-4xl">
        <Formik
          initialValues={{
            username: profile.username,
            gender: profile.gender,
            birthdate: profile.birthdate,
            preferredLanguage: profile.preferredLanguage,
            preferredCurrency: profile.preferredCurrency,
            phoneNumber: profile.phoneNumber,
            homeAddress: profile.homeAddress,
            billingAddress: profile.billingAddress,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div className="profile-image-container">
                <div className="relative inline-block">
                  <img
                    src={imagePreview || profile.profileImageUrl || defaultProfileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover shadow-[0_0_5px_rgba(0,0,0,0.9)]"
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
                    >
                      <CiEdit className="h-6 w-6 text-gray-600" />
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          if (
                            event.currentTarget.files &&
                            event.currentTarget.files[0]
                          ) {
                            const file = event.currentTarget.files[0];
                            setProfileImage(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="w-full md:w-3/4 lg:flex lg:gap-10">
                <div className="w-full lg:w-1/2">
                  <label className="block">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    className="input text-sm w-full p-2 shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    disabled
                  />
                </div>
                <div className="w-1/2 hidden lg:block"></div>
              </div>
              <div className="semi-container w-full md:w-3/4 lg:flex lg:gap-10">
                <div className="left space-y-5 w-full lg:w-1/2">
                  <div>
                    <label className="block">Username</label>
                    <Field
                      name="username"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.username && touched.username ? (
                      <div className="text-red-500 text-xs">
                        {errors.username}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Gender</label>
                    <Field
                      name="gender"
                      className={`input ${isEditing ? " p-2 w-full text-main-black-color text-sm border-2 border-main-black-color]" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.gender && touched.gender ? (
                      <div className="text-red-500 text-xs">
                        {errors.gender}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Birthdate</label>
                    <Field
                      name="birthdate"
                      type={`${isEditing ? "date" : ""}`}
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.birthdate && touched.birthdate ? (
                      <div className="text-red-500 text-xs">
                        {errors.birthdate}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Preferred Language</label>
                    <Field
                      name="preferredLanguage"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.preferredLanguage && touched.preferredLanguage ? (
                      <div className="text-red-500 text-xs">
                        {errors.preferredLanguage}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="right space-y-5 w-full lg:w-1/2">
                  <div>
                    <label className="block">Preferred Currency</label>
                    <Field
                      name="preferredCurrency"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.preferredCurrency && touched.preferredCurrency ? (
                      <div className="text-red-500 text-xs">
                        {errors.preferredCurrency}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Phone Number</label>
                    <Field
                      name="phoneNumber"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <div className="text-red-500 text-xs">
                        {errors.phoneNumber}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Home Address</label>
                    <Field
                      name="homeAddress"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.homeAddress && touched.homeAddress ? (
                      <div className="text-red-500 text-xs">
                        {errors.homeAddress}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block">Billing Address</label>
                    <Field
                      name="billingAddress"
                      className={`input ${isEditing ? "p-2 w-full text-main-black-color text-sm border-2 border-main-black-color" : "w-full p-2 text-sm shadow-[0_0_2px_rgba(0,0,0,0.9)]"}`}
                      disabled={!isEditing}
                      onClick={handleFieldClick}
                    />
                    {errors.billingAddress && touched.billingAddress ? (
                      <div className="text-red-500 text-xs">
                        {errors.billingAddress}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-2 w-full lg:w-1/2 ">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="reset-btn mt-5 w-full lg:w-1/3 py-3 text-white text-sm rounded-sm flex items-center justify-center bg-main-black-color"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                {isEditing && (
                  <button
                    type="submit"
                    className="reset-btn mt-5 w-full sm:w-1/2 lg:w-1/3 py-3 text-white text-sm rounded-sm flex items-center justify-center bg-main-black-color"
                  >
                    Save Changes
                  </button>
                )}
              </div>
              <div className="">
                <Logout />
              </div>
            </Form>
          )}
        </Formik>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;
