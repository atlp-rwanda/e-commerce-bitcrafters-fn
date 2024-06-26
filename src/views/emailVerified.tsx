import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerified: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className='email-verified-container flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <img src="verified.svg" alt="Verified" className="w-40 h-40 mb-6" />
      <div className="email-verified-page bg-white p-10 text-center rounded ">
        <h2 className="text-2xl font-semibold mb-4">Account Verified Successfully!</h2>
        <button
          className='w-40 pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-white bg-black rounded-lg transition duration-200 hover:bg-gray-700 ease'
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
