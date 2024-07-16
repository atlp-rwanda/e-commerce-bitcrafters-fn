import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosClient from "../hooks/AxiosInstance";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { ThreeDots } from "react-loader-spinner";
import "../app.scss";
import { CheckoutFormValues, useCheckoutSubmit } from "../components/CheckoutSubmit";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  streetAddress: Yup.string().required("Street address is required"),
  town: Yup.string().required("Town is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  deliveryDate: Yup.date().required("Delivery date is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
  mobileMoneyNumber: Yup.string().when("paymentMethod", {
    is: "mobileMoney",
    then: (schema) => schema
      .matches(/^[0-9]{10,15}$/, "Invalid mobile money number")
      .required("Mobile money number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Checkout: React.FC = () => {
  const axiosClient = useAxiosClient();
  const [cart, setCart] = useState<Cart | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const handleSubmit = useCheckoutSubmit();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosClient.get("/cart");
        setCart(response.data.cart);
      } catch (error) {
        // console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  if (!cart) {
    return (
      <div className="w-full text-black h-[60vh] mx-auto items-center justify-center flex flex-col gap-3">
        <p>Loading...</p>
        <ThreeDots
          visible={true}
          height="50"
          width="50"
          color="rgb(38 38 38)"
          radius="5"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cart.items.length / itemsPerPage);

  const initialValues: CheckoutFormValues = {
    fullName: "",
    phoneNumber: "",
    country: "",
    streetAddress: "",
    town: "",
    email: "",
    deliveryDate: "",
    paymentMethod: "",
    mobileMoneyNumber: undefined
  };

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="container md:text-sm text-xs mx-auto md:w-full w-full md:flex justify-center md:gap-20 py-10 md:px-20 px-[5%]">
              <div className="left md:w-1/2 ">
                <div className="flex items-center mb-8">
                  <SectionHeader title="Shipping Address" />
                </div>
                <div className="space-y-3 w-full">
                  <div>
                    <label htmlFor="fullName" className="block mb-1">
                      Name
                    </label>
                    <Field
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block mb-1">
                      Country
                    </label>
                    <Field
                      type="text"
                      id="country"
                      name="country"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="streetAddress" className="block mb-1">
                      Street Address
                    </label>
                    <Field
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="streetAddress"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="town" className="block mb-1">
                      Town/City
                    </label>
                    <Field
                      type="text"
                      id="town"
                      name="town"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="town"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block mb-1">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-1">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="deliveryDate" className="block mb-1">
                      Delivery Date
                    </label>
                    <Field
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      className="outline-none p-2 w-full text-main-black-color md:text-sm text-xs rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)]"
                    />
                    <ErrorMessage
                      name="deliveryDate"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="right md:w-1/2">
                <div className="flex items-center pb-8">
                  <SectionHeader title="Order Details" />
                </div>
                <div className="orders mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className=" ">
                        <th className="text-left py-2 font-bold">Product</th>
                        <th className="text-left py-2 font-bold">Name</th>
                        <th className="text-right py-2 font-bold">Quantity</th>
                        <th className="text-right py-2 font-bold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.productId} className="">
                          <td className="py-2">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded shadow-[0_0_5px_rgba(0,0,0,0.3)]"
                            />
                          </td>
                          <td className="py-2 ">{item.name}</td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-right py-2">{item.price}rwf</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pagination flex justify-between mt-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`border-[1px] border-black px-4 py-1 rounded ${
                        currentPage === 1
                          ? "gradient-right-white-left-black cursor-not-allowed"
                          : "gradient-right-white-left-black"
                      }`}
                    >
                      <GrFormPrevious />
                    </button>
                    {currentPage !== totalPages && (
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="gradient-left-white-right-black px-4 py-1 border-[1px] border-black rounded disabled:bg-gray-300"
                      >
                        <GrFormNext />
                      </button>
                    )}
                  </div>

                  <div className="Total mt-8">
                    <hr className="w-full my-[1rem] border-b border-gray_100" />
                    <div className="flex justify-between my-[1rem]">
                      <p>Subtotal</p>
                      <p>{cart.totalQuantity} items</p>
                      <p>{cart.totalPrice}rwf</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Delivery Fee</p>
                      <p className="text-customRed">0.0 rwf</p>
                    </div>
                    <hr className="w-full my-2 border-b border-gray_100" />
                    <div className="flex justify-between text-lg font-bold">
                      <p className="font-bold">Total</p>
                      <p className="font-bold  text-customGreen">
                        {cart.totalPrice} rwf
                      </p>
                    </div>
                  </div>
                </div>

                <div className="payment-method">
                  <div className="flex items-center py-5">
                    <SectionHeader title="Payment Method" />
                  </div>
                  <div className="ml-[2rem]">
                    <div className="flex mb-2">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="mobileMoney"
                        className="form-radio"
                      />
                      <label htmlFor="mobileMoney" className="block ml-3">
                        <span className="ml-2">Mobile Money</span>
                      </label>
                    </div>
                    <div className="flex">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="creditCard"
                        className="form-radio"
                      />
                      <label htmlFor="creditCard" className="block ml-3">
                        <span className="ml-2">Credit Card</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="text-red-500 text-xs"
                    />

                    {values.paymentMethod === "mobileMoney" && (
                      <div className="">
                        <div className="flex mb-3 mt-[2rem] ">
                          <label htmlFor="mobileMoneyNumber" className="block">
                            Mobile Money Number
                          </label>
                          <Field
                            type="text"
                            id="mobileMoneyNumber"
                            name="mobileMoneyNumber"
                            className="outline-none p-1 w-1/2 text-main-black-color text-sm rounded-[5px] shadow-[0_0_2px_rgba(0,0,0,0.9)] ml-auto"
                          />
                        </div>
                        <ErrorMessage
                          name="mobileMoneyNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1 text-right"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    type="submit"
                    value={isSubmitting ? "Processing..." : "Place Order"}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default Checkout;

