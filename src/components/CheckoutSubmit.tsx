// CheckoutSubmit.tsx
import { FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAxiosClient from "../hooks/AxiosInstance";

export interface CheckoutFormValues {
  fullName: string;
  phoneNumber: string;
  country: string;
  streetAddress: string;
  town: string;
  email: string;
  deliveryDate: string;
  paymentMethod: string;
  mobileMoneyNumber?: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export const useCheckoutSubmit = () => {
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: CheckoutFormValues,
    { setSubmitting }: FormikHelpers<CheckoutFormValues>,
  ) => {
    const filteredValues = { ...values };
    if (filteredValues.paymentMethod !== "mobileMoney") {
      delete filteredValues.mobileMoneyNumber;
    }
    if (filteredValues.paymentMethod !== "creditCard") {
      delete filteredValues.cardNumber;
      delete filteredValues.cardHolderName;
      delete filteredValues.expiryDate;
      delete filteredValues.cvv;
    }
    try {
      const response = await axiosClient.post("/checkout", filteredValues);
      toast.success("Order has been sent successfully!");
      response.data;

      setTimeout(() => {
        if (values.paymentMethod === "mobileMoney") {
          navigate("/mobileMoney");
        } else if (values.paymentMethod === "creditCard") {
          navigate("/creditCard");
        }
      }, 2000);
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return handleSubmit;
};
