import React from 'react';

const InvalidToken: React.FC = () => {
  return (
    <div className='invalid-token-container flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <img src="invalid.svg" alt="Invalid Token" className="w-40 h-40 mb-6" />
      <div className="invalid-token-page bg-white p-10 text-center rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Invalid or Expired Token</h2>
        <p className="mb-4">The token you used is either invalid or has expired. Please contact support for assistance.</p>
        <p>You can reach our support team at:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Email: support@example.com</li>
          <li>Phone: (123) 456-7890</li>
        </ul>
        <p>Or visit our <a href="/help-center" className="text-blue-500 hover:underline">Help Center</a> for more information.</p>
      </div>
    </div>
  );
};

export default InvalidToken;
