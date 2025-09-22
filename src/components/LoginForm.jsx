



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../config/firebase";
// import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";


// import ForgotPasswordForm from "./ForgotPasswordForm";

// const LoginForm = ({ toggleForm }) => {
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [savedEmail, setSavedEmail] = useState(""); // ✅ state to hold email
//   const navigate = useNavigate();

//   useEffect(() => {
//     const form = document.querySelector("form");
//     if (form) form.reset();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const email = e.target.email.value.trim();
//     const password = e.target.password.value;

//     try {
//       // Firebase login
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       toast.success("Login successful!");
//       console.log("Login successful:", user.email);

//       // Fetch IP and device info
//       const ipRes = await axios.get("https://api.ipify.org?format=json");
//       const ipAddress = ipRes.data.ip;
//       const deviceInfo = navigator.userAgent;

//       // Save login info to Firestore
//       await addDoc(collection(db, "log_time"), {
//         "user-id": doc(db, "users", user.uid),
//         date: new Date().toLocaleDateString(),
//         device_info: deviceInfo,
//         "ip-adress": ipAddress,
//         login_time: serverTimestamp(),
//         logout_time: null,
//         work_hours: null,
//       });

//       navigate("/users"); // redirect to dashboard after login
//     } catch (error) {
//       console.error("Login error:", error.code, error.message);
//       toast.error(error.message);
//     }
//   };

//   const toggleForgotPassword = () => {
//     const emailInput = document.getElementById("email");
//     if (emailInput && emailInput.value.trim() !== "") {
//       setSavedEmail(emailInput.value.trim()); // ✅ Save email before switching
//     }
//     setShowForgotPassword(!showForgotPassword);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-300">
//       {showForgotPassword ? (
//         <ForgotPasswordForm toggleForgotPassword={toggleForgotPassword} />
//       ) : (
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

//           <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//                 placeholder="Enter your email"
//                 autoComplete="new-email"
//                 defaultValue={savedEmail} // ✅ pre-fill saved email
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//                 placeholder="Enter your password"
//                 autoComplete="new-password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full cursor-pointer bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md hover:bg-[#111111] transition duration-200 hover:scale-103"
//             >
//               Login
//             </button>
//           </form>

//           <button
//             onClick={toggleForgotPassword}
//             className="text-blue-500 cursor-pointer hover:underline focus:outline-none mt-4 ml-60"
//           >
//             Forgot Password?
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <button
//               onClick={toggleForm}
//               className="text-blue-500 cursor-pointer hover:underline focus:outline-none"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default LoginForm;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../config/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// // ✅ Allowed credentials
// const ALLOWED_EMAIL = "alloweduser@gmail.com";
// const ALLOWED_PASSWORD = "allowed123";

// const LoginForm = () => {
//   const [savedEmail, setSavedEmail] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const form = document.querySelector("form");
//     if (form) form.reset();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const email = e.target.email.value.trim();
//     const password = e.target.password.value;

//     try {
//       // ✅ Client-side validation
//       if (email !== ALLOWED_EMAIL || password !== ALLOWED_PASSWORD) {
//         toast.error("Invalid credentials!");
//         return;
//       }

//       toast.success("Login successful!");
//       console.log("Login successful:", email);

//       // ✅ Get IP and device info
//       const ipRes = await axios.get("https://api.ipify.org?format=json");
//       const ipAddress = ipRes.data.ip;
//       const deviceInfo = navigator.userAgent;

//       // ✅ Save login info in Firestore
//       await addDoc(collection(db, "log_time"), {
//         email,
//         device_info: deviceInfo,
//         ip_address: ipAddress,
//         login_time: serverTimestamp(),
//         reached_onboarding: false,
//       });

//       // ✅ Redirect to onboarding page
//       navigate("/onboarding");
//     } catch (error) {
//       console.error("Login error:", error.message);
//       toast.error("Something went wrong!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-300">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

//         <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//               placeholder="Enter your email"
//               defaultValue={savedEmail}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full cursor-pointer bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md transition duration-200"
//           >
//             Login
//           </button>
//         </form>

//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </div>
//   );
// };

// export default LoginForm;












import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// ✅ Allowed credentials
const ALLOWED_EMAIL = "alloweduser@gmail.com";
const ALLOWED_PASSWORD = "allowed123";

const LoginForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Form reset on mount
    const form = document.querySelector("form");
    if (form) form.reset();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

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

      // ✅ Redirect to onboarding page
      navigate("/admin/onboarding");
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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your password"
              required
            />
          </div>

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
