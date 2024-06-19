import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {axiosInstance} from '../hooks/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.get(`users/verify/${token}`);
        toast.success('Email verified successfully!');
        navigate('/email-verified');
      } catch (error) {
        toast.error('Verification failed. Please try again.');
        navigate('/invalid-token');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <h2>Verifying your email...</h2>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;
