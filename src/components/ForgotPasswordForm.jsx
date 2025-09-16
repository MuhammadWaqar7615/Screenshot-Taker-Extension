import React, { useState } from 'react';

const ForgotPasswordForm = ({ toggleForgotPassword }) => {
  const [resetEmail, setResetEmail] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (resetEmail) {
      localStorage.setItem('passwordResetRequest', JSON.stringify({ email: resetEmail, timestamp: new Date().toISOString() }));
      console.log('Password reset requested for:', resetEmail);
      alert('Password reset link sent to your email! (Simulated)');
      setResetEmail('');
      toggleForgotPassword();
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="reset-email"
            name="reset-email"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Send Reset Link
        </button>
        <button
          type="button"
          onClick={toggleForgotPassword}
          className="w-full text-sm text-blue-500 hover:underline focus:outline-none mt-2"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;