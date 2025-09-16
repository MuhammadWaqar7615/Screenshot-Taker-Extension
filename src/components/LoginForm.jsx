// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../config/firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import ForgotPasswordForm from "./ForgotPasswordForm";

// const LoginForm = ({ toggleForm }) => {
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const email = e.target.email.value.trim();
//     const password = e.target.password.value;

//     try {
//       // Firebase Auth login
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;

//       // Ensure user document exists
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);
//       if (!userSnap.exists()) {
//         await setDoc(userRef, {
//           uid,
//           email,
//           name: userCredential.user.displayName || "",
//           createdAt: serverTimestamp(),
//           phone: "",
//           department_id: "",
//           position: "",
//           is_active: true,
//           joining_at: "",
//           updated_at: serverTimestamp(),
//         });
//       }

//       // Create login record in log_time collection
//       await addDoc(collection(db, "log_time"), {
//         date: new Date().toLocaleDateString(),
//         device_info: navigator.userAgent || "",
//         "ip-address": "", // leave empty or fetch via API if needed
//         login_time: new Date().toLocaleTimeString(),
//         logout_time: "",
//         "user-id": userRef, // reference to the user document
//         work_hours: "",
//       });

//       toast.success("Login successful!");
//       console.log("Login successful:", userCredential.user.email);

//       navigate("/users");
//     } catch (error) {
//       console.error("Login error:", error.code, error.message);
//       toast.error(error.message);
//     }
//   };

//   const toggleForgotPassword = () => {
//     setShowForgotPassword(!showForgotPassword);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-300">
//       {showForgotPassword ? (
//         <ForgotPasswordForm toggleForgotPassword={toggleForgotPassword} />
//       ) : (
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//             Login
//           </h2>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full cursor-pointer bg-[#202020] text-white p-2 rounded-md hover:bg-[#111111] transition duration-200"
//             >
//               Login
//             </button>

//             <span className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={toggleForgotPassword}
//                 className="cursor-pointer text-sm text-blue-500 hover:underline focus:outline-none mt-2"
//               >
//                 Forgot Password?
//               </button>
//             </span>
//           </form>

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

// ----------------------------------------------------------------------------------------------------------

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth, db } from "../config/firebase";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import axios from "axios";

// import ForgotPasswordForm from "./ForgotPasswordForm";

// const LoginForm = ({ toggleForm }) => {
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const navigate = useNavigate();

//   // Work session tracking
//   let loginStartTime = null;
//   let logId = null;

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const email = e.target.email.value.trim();
//     const password = e.target.password.value;

//     try {
//       // ✅ Firebase login
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       toast.success("Login successful!");
//       console.log("Login successful:", user.email);

//       // ✅ Fetch IP address
//       const ipRes = await axios.get("https://api.ipify.org?format=json");
//       const ipAddress = ipRes.data.ip;

//       // ✅ Get device info
//       const deviceInfo = navigator.userAgent;

//       // ✅ Current date
//       const currentDate = new Date().toLocaleDateString();

//       // ✅ Save log to Firestore
//       const docRef = await addDoc(collection(db, "log_time"), {
//         user_id: user.uid,
//         login_time: serverTimestamp(),
//         ip_address: ipAddress,
//         device_info: deviceInfo,
//         date: currentDate,
//         logout_time: null,
//         work_hours: null
//       });

//       logId = docRef.id; // store log id for logout update
//       loginStartTime = Date.now();

//       // ✅ Navigate after successful login
//       navigate("/users");
//     } catch (error) {
//       console.error("Login error:", error.code, error.message);
//       toast.error(error.message);
//     }
//   };

//   // ✅ Logout + update log_time
//   const handleLogout = async () => {
//     try {
//       const logoutTime = new Date();
//       const workHours = ((Date.now() - loginStartTime) / 1000 / 60).toFixed(2); // minutes

//       if (logId) {
//         const logRef = doc(db, "log_time", logId);
//         await updateDoc(logRef, {
//           logout_time: serverTimestamp(),
//           work_hours: workHours
//         });
//       }

//       await signOut(auth);
//       toast.success("Logged out successfully!");
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error.message);
//     }
//   };

//   const toggleForgotPassword = () => {
//     setShowForgotPassword(!showForgotPassword);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-300">
//       {showForgotPassword ? (
//         <ForgotPasswordForm toggleForgotPassword={toggleForgotPassword} />
//       ) : (
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//             Login
//           </h2>

//           <form onSubmit={handleLogin} className="space-y-4">
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
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full cursor-pointer bg-[#202020] text-white p-2 rounded-md hover:bg-[#111111] transition duration-200"
//             >
//               Login
//             </button>
//           </form>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <button
//               onClick={toggleForm}
//               className="text-blue-500 cursor-pointer hover:underline focus:outline-none"
//             >
//               Sign Up
//             </button>
//           </p>

//           <div className="mt-4 flex justify-center">
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = ({ toggleForm }) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast.success("Login successful!");
      console.log("Login successful:", user.email);

      // Fetch IP and device info
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;
      const deviceInfo = navigator.userAgent;

      // Save login info to Firestore (logout_time and work_hours null at this point)
      await addDoc(collection(db, "log_time"), {
        "user-id": doc(db, "users", user.uid),
        date: new Date().toLocaleDateString(),
        device_info: deviceInfo,
        "ip-adress": ipAddress,
        login_time: serverTimestamp(),
        logout_time: null,
        work_hours: null,
      });

      navigate("/users"); // redirect to dashboard after login
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      toast.error(error.message);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      {showForgotPassword ? (
        <ForgotPasswordForm toggleForgotPassword={toggleForgotPassword} />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#202020]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-[#202020] text-white p-2 rounded-md hover:bg-[#111111] transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={toggleForm}
              className="text-blue-500 cursor-pointer hover:underline focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginForm;
