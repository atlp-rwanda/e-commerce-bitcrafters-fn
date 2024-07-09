import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useAxiosClient from "../hooks/AxiosInstance";

interface Confirmation {
  orderNumber: string;
  totalCost: number;
  expectedDeliveryDate: string;
}

const ConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const axiosClient = useAxiosClient();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const authToken = useSelector((state: any) => state.auth.authToken);
  const userId = useSelector((state: any) => state.auth.userId);

  useEffect(() => {
    if (!isLoggedIn || !authToken) {
      navigate("/login");
      return;
    }

    const fetchConfirmation = async () => {
      try {
        const response = await axiosClient.get<{ confirmation: Confirmation }>(
          `/stripe-return?orderId=${orderId}&userId=${userId}`,
        );
        setConfirmation(response.data.confirmation);
      } catch (error) {
        console.error("Failed to fetch confirmation", error);
      }
    };

    fetchConfirmation();
  }, [location.search, isLoggedIn, authToken, navigate, orderId, userId]);

  if (!isLoggedIn || !authToken) {
    return null;
  }

  if (!confirmation) {
    return <div>Loading confirmation details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Order Confirmation
      </h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
        <p className="mb-2">Order Number: {confirmation.orderNumber}</p>
        <p className="mb-2">Total Cost: {confirmation.totalCost}</p>
        <p className="mb-2">
          Expected Delivery Date: {confirmation.expectedDeliveryDate}
        </p>
        <p className="text-green-500 font-bold mb-2">Payment Successful</p>
        <button
          type="submit"
          className="w-60 bg-black text-white align-center py-2 px-4 rounded disabled:opacity-50"
        >
          Track Your Order
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
