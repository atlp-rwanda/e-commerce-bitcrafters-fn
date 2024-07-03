import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct: React.FC = () => {

  return (
    <div className="container items-center py-10 justify-center tablet:min-h-[100vh] px-10">

<h3>Single Product Page</h3>

      <ToastContainer />
    </div>
  );
};

export default SingleProduct;
