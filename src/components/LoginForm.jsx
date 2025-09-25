



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// ✅ Allowed credentials
const ALLOWED_EMAIL = "siteadmin@gmail.com";
const ALLOWED_PASSWORD = "siteadmin123";

const LoginForm = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Reset form on mount (to clear autofill)
    const form = document.querySelector("form");
    if (form) form.reset();
    
    // ✅ Check if any company exists
    checkCompaniesExist();
  }, []);

  // ✅ Check if any company is registered
  const checkCompaniesExist = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "companies"));
      setCompanies(querySnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error("Error checking companies:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.loginEmail.value.trim();
    const password = e.target.loginPassword.value;

    try {
      // ✅ Validation
      if (email !== ALLOWED_EMAIL || password !== ALLOWED_PASSWORD) {
        toast.error("❌ Invalid credentials!");
        return;
      }

      toast.success("✅ Login successful!");
      console.log("Login successful:", email);

      // ✅ Get IP and device info
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;
      const deviceInfo = navigator.userAgent;

      // ✅ Save login info in Firestore
      await addDoc(collection(db, "log_time"), {
        email,
        device_info: deviceInfo,
        ip_address: ipAddress,
        login_time: serverTimestamp(),
        reached_onboarding: true,
      });

      // ✅ DECISION: Redirect based on company existence
      if (companies.length > 0) {
        // ✅ If companies exist → go to allusers page
        navigate("/admin/allusers");
        toast.info("Redirecting to All Users page");
      } else {
        // ✅ If no companies exist → go to onboarding page
        navigate("/admin/onboarding");
        toast.info("No companies found. Please register a company first.");
      }

    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("⚠️ Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>


        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          {/* Email */}
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="loginEmail"
              name="loginEmail"
              autoComplete="off"
              className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="loginPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              name="loginPassword"
              autoComplete="new-password"
              className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default LoginForm;