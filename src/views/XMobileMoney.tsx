// mobilePayment

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosClient from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
// import Button from "../components/Button";
import { Formik } from "formik";
import * as yup from "yup";
import { GrFormNextLink } from "react-icons/gr";
import TextInput from "../components/TextInput";

const XMobileMoney: React.FC = () => {
  const client = useAxiosClient();
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>();
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderResponse, setOrderResponse] = useState<any>([])
  const notify = (message: string) => toast(message);



  const fetchOrder = async () => {
    try {
      const response = await client.get(`/orders/${orderId}`);

      if (response?.status === 200){
        console.log("data fetched: ", response?.data.order?.paymentInfo)
        setPhoneNumber( response?.data.order?.paymentInfo.mobileMoneyNumber)
        setOrderResponse(response.data.order)
      }

    } catch (err: any) {
      setIsLoading(false);
      notify(err.order ? err.response?.data.message : "Fetching Order failed");
      console.log("fetch failed", err)
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(()=>{
    fetchOrder()
  },
[])


  const InitiateOrder = async (number:any) => {
    setIsLoading(true)
    console.log(number)
   
    try {
      const response = await client.post(`/payment/momo/pay/${orderId}`);

      if (response?.status === 200){
        console.log("data response: ", response?.data )
        await checkOrder()
      }

    } catch (error: any) {
      setIsLoading(false);
      if(error?.response?.data?.message === "Order has already been Initiated"){
        checkOrder()
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkOrder = async () => {
   
    try {
      const response = await client.post(`/payment/momo/check/${orderId}`);

      if (response?.status === 200){
        console.log("check data response: ", response?.data )
        navigate(`/payment-complete/${orderId}`)
      }

    } catch (error: any) {
      if(error.response.data.message === "Order has already been Completed"){
        navigate(`/payment-complete/${orderId}`)
      }
      console.log("check failed", error)
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(phoneNumber as any, "Invalid number")
      
  });  

  console.log(orderResponse, isLoading)
  console.log("phonemunber", phoneNumber)
  return (
    <div className="w-full h-[60vh] flex justify-center items-center">
      <div className="p-10 shadow-lg rounded bg-grayd border border-gray_100 flex flex-col gap-2 items-center justify-center">
      <p>Confirm Mobile Money Number</p>
      <p className="text-xs">{phoneNumber}</p>
      <Formik
            initialValues={{ phoneNumber: phoneNumber }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              InitiateOrder(values);
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
                  error={errors.phoneNumber && touched.phoneNumber ? `${errors.phoneNumber}` : ""}
                  borderColor={errors.phoneNumber && touched.phoneNumber ? `red` : "gray"}
                  onBlur={handleBlur("phoneNumber")}
                  secured={false}
                  type="phoneNumber"
                  placeholder="Enter phone number"
                  value={values.phoneNumber}
                  onChange={handleChange("phoneNumber")}
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

       {!isLoading?           <div className="flex items-center gap-2">
                    <p>Proceed Payment</p>
                     <GrFormNextLink className="icon ml-2" />
                  </div>:<p>Processing...</p>}
                  
                </button>
              </form>
            )}
          </Formik>
      </div>
     
    </div>
  );
};
export default XMobileMoney;