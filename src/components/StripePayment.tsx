// @ts-nocheck
// Todo: Fix this file it's typescript
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useAxiosClient from "../hooks/AxiosInstance";
import { PUBLIC_KEY_STRIPE } from "../constants";

const stripePromise = loadStripe(PUBLIC_KEY_STRIPE);

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  amount,
  currency,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: createError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name,
          email,
        },
      });

    if (createError) {
      setError(createError.message || "Failed to create payment method");
      setProcessing(false);
      return;
    }
try{
    const { data: paymentIntentData } = await axiosClient.post(
      `/payment/process-payment/${orderId}`,
      {
        currency,
        paymentMethodId: paymentMethod.id,
      },
    );

    if (!paymentIntentData.clientSecret) {
      setError("Failed to get client secret from payment intent");
      setProcessing(false);
      return;
    }

    if (paymentIntentData.success) {
      navigate(`/confirmation/${orderId}`);
      return;
    }

    const handlePaymentIntent = async (clientSecret: string) => {
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "requires_action") {
        const { error: authError, paymentIntent: confirmedIntent } =
          await stripe.handleCardAction(clientSecret);

        if (authError) {
          setError(authError.message || "3D Secure authentication failed");
          setProcessing(false);
          return;
        }

        if (confirmedIntent.status === "succeeded") {
          navigate(`/confirmation/${orderId}`);
        } else {
          setError("Payment failed after 3D Secure authentication");
          setProcessing(false);
        }
      } else if (paymentIntent.status === "succeeded") {
        navigate(`/confirmation/${orderId}`);
      }

      if (
        paymentIntent.status !== "succeeded" &&
        paymentIntent.status !== "requires_action"
      ) {
        setError("Unexpected PaymentIntent status");
        setProcessing(false);
        return;
      }
    };

    await handlePaymentIntent(paymentIntentData.clientSecret);
  } catch (err) {
    setError(err.response?.data?.message || "Payment processing failed");
    setProcessing(false);
  }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4 font-semibold text-start">
        <p className="mb-2">Name</p>
        <input
          type="text"
          placeholder="Name on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-100 rounded px-3 py-2 w-full mb-2"
        />
        <p className="mb-2">Email</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-100 rounded px-3 py-2 w-full mb-2"
        />
        <p className="mb-2">Card details</p>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
            hidePostalCode: true,
          }}
          className="border border-gray-100 rounded px-3 py-2 w-full mb-2"
        />
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full bg-black text-white align-center py-2 px-4 rounded disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay RWF ${amount}`}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState();
  const axiosClient = useAxiosClient();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const authToken = useSelector((state: any) => state.auth.authToken);

  useEffect(() => {
    if (!isLoggedIn || !authToken) {
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axiosClient.get(`/orders/${orderId}`);
        const order = response.data.order;
        setOrderDetails(order);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isLoggedIn, authToken, navigate]);

  if (!isLoggedIn || !authToken) {
    return null;
  }

  if (!orderDetails || !orderId) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-36 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <div className="mb-4">
        <p>Order Total: RWF {orderDetails.totalAmount} </p>
      </div>
      <Elements stripe={stripePromise}>
        <PaymentForm
          orderId={orderDetails.id}
          amount={orderDetails.totalAmount}
          currency="RWF" // TODO: Get currency from orderDetails
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
