import React  from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";


const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();


  return (
    <div data-testid="toast-container" className="container m-3 mx-auto tablet:m-10 flex flex-col gap-2 space-x-2 items-center justify-center h-[70vh] tablet:min-h-[80vh] px-10">
      <div className={"p-4 tablet:p-7 bg-green-300 rounded-full flex items-center justify-center"}>
      <div className={"p-4 tablet:p-7 bg-green-400 rounded-full flex items-center justify-center"}>
      <div className={"p-4 tablet:p-7 bg-green-500 rounded-full flex items-center justify-center"}>
<FaCheck className="text-5xl text-white" data-testid="fa-check"/>
      </div>
      </div>
      </div>
      <p>Payment Successful</p>

<div className="w-[40%] mx-auto">
          <Button value="View Order"
      onClick={()=>{navigate(`/order/${orderId}`)}}
      />
</div>

      <ToastContainer />
    </div>
  );
};

export default PaymentSuccess;