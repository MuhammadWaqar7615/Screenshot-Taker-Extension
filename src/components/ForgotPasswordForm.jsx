import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"; 

const ForgotPasswordForm = ({ toggleForgotPassword }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      
      await sendPasswordResetEmail(auth, resetEmail);

      alert(" Password reset link has been sent to your email!");
      setResetEmail("");
      toggleForgotPassword(); 
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error.code === "auth/user-not-found") {
        alert(" No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        alert(" Invalid email address.");
      } else if (error.code === "auth/missing-email") {
        alert(" Please enter your email.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Reset Password
      </h2>
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div>
          <label
            htmlFor="reset-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="reset-email"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded-md transition duration-200 ${
            loading
              ? "bg-gray-400  cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-800 cursor-pointer hover:scale-103"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <button
          type="button"
          onClick={toggleForgotPassword}
          className="w-full text-sm text-blue-500 hover:underline focus:outline-none mt-2 cursor-pointer"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
