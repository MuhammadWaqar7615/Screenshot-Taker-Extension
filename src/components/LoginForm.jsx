



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../config/firebase";
// import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// // ✅ Allowed credentials
// const ALLOWED_EMAIL = "siteadmin@gmail.com";
// const ALLOWED_PASSWORD = "siteadmin123";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [companies, setCompanies] = useState([]);

//   useEffect(() => {
//     // Reset form on mount (to clear autofill)
//     const form = document.querySelector("form");
//     if (form) form.reset();
    
//     // ✅ Check if any company exists
//     checkCompaniesExist();
//   }, []);

//   // ✅ Check if any company is registered
//   const checkCompaniesExist = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "companies"));
//       setCompanies(querySnapshot.docs.map(doc => doc.data()));
//     } catch (error) {
//       console.error("Error checking companies:", error);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const email = e.target.loginEmail.value.trim();
//     const password = e.target.loginPassword.value;

//     try {
//       // ✅ Validation
//       if (email !== ALLOWED_EMAIL || password !== ALLOWED_PASSWORD) {
//         toast.error("❌ Invalid credentials!");
//         return;
//       }

//       toast.success("✅ Login successful!");
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
//         reached_onboarding: true,
//       });

//       // ✅ DECISION: Redirect based on company existence
//       if (companies.length > 0) {
//         // ✅ If companies exist → go to allusers page
//         navigate("/admin/allusers");
//         toast.info("Redirecting to All Users page");
//       } else {
//         // ✅ If no companies exist → go to onboarding page
//         navigate("/admin/onboarding");
//         toast.info("No companies found. Please register a company first.");
//       }

//     } catch (error) {
//       console.error("Login error:", error.message);
//       toast.error("⚠️ Something went wrong!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-300">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Login
//         </h2>


//         <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
//           {/* Email */}
//           <div>
//             <label
//               htmlFor="loginEmail"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="text"
//               id="loginEmail"
//               name="loginEmail"
//               autoComplete="off"
//               className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="loginPassword"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="loginPassword"
//               name="loginPassword"
//               autoComplete="new-password"
//               className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {/* Button */}
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




//===============================================================================================================




//login 

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// ✅ Site Admin credentials
const SITE_ADMIN_EMAIL = "siteadmin@gmail.com";
const SITE_ADMIN_PASSWORD = "siteadmin123";

const LoginForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const form = document.querySelector("form");
    if (form) form.reset();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.loginEmail.value.trim().toLowerCase();
    const password = e.target.loginPassword.value;

    console.log("Login attempt:", { email, password });

    try {
      // ✅ CASE 1: Site Admin Login
      if (email === SITE_ADMIN_EMAIL && password === SITE_ADMIN_PASSWORD) {
        toast.success("✅ Site Admin login successful!");

        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const ipAddress = ipRes.data.ip;
        const deviceInfo = navigator.userAgent;

        await addDoc(collection(db, "log_time"), {
          email,
          device_info: deviceInfo,
          ip_address: ipAddress,
          login_time: serverTimestamp(),
          role: "Site Admin",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({ 
            email, 
            role: "Site Admin",
            isSiteAdmin: true
          })
        );

        navigate("/admin/companies");
        return;
      }

      // ✅ CASE 2: Company Admin (from Firestore "users")
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      
      console.log("Firestore results:", {
        totalDocs: querySnapshot.size,
        docs: querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }))
      });

      if (querySnapshot.empty) {
        toast.error("❌ User not found! Please check your email.");
        return;
      }

      let userData = null;
      let userDocId = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Checking user:", data);
        
        if (data.password === password) {
          userData = data;
          userDocId = doc.id;
        }
      });

      if (!userData) {
        toast.error("❌ Invalid password!");
        return;
      }

      const userRole = userData.role?.toLowerCase();
      console.log("User role:", userRole);

      const allowedRoles = ["admin", "company admin"];
      if (!allowedRoles.includes(userRole)) {
        toast.error("⛔ You are not authorized as an Admin!");
        return;
      }

      toast.success(`✅ Welcome back, ${userData.email}`);

      const ipRes = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipRes.data.ip;
      const deviceInfo = navigator.userAgent;

      await addDoc(collection(db, "log_time"), {
        email: userData.email,
        cid: userData.cid,
        company_name: userData.companyName || userData.company_name || "N/A",
        device_info: deviceInfo,
        ip_address: ipAddress,
        login_time: serverTimestamp(),
        role: "Company Admin",
      });

      // ✅ Save complete user data to localStorage including CID
      const userInfo = {
        id: userDocId,
        email: userData.email,
        role: "Company Admin",
        cid: userData.cid, // This is the company ID
        companyName: userData.companyName || userData.company_name,
        name: userData.name,
        contact: userData.contact,
        department: userData.department,
        isSiteAdmin: false
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      
      // ✅ Also store company info separately for easy access
      localStorage.setItem("company", JSON.stringify({
        id: userData.cid, // Company ID
        name: userData.companyName || userData.company_name
      }));

      console.log("Stored user data:", userInfo);
      console.log("Stored company data:", { id: userData.cid, name: userData.companyName });

      navigate("/admin/onboarding");

    } catch (error) {
      console.error("Login error:", error);
      toast.error(`⚠️ Login failed: ${error.message}`);
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
              htmlFor="loginEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="loginEmail"
              name="loginEmail"
              className="mt-1 w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter your email"
              required
            />
          </div>

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