
// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";

// export default function CompanyRegisterOnboarding() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm({ mode: "onBlur" });

//   const [logoFile, setLogoFile] = useState(null);
//   const [step, setStep] = useState(1);

//   const onSubmit = (data) => {
//     toast.success("Company Registered Successfully!", {
//       position: "top-center",
//       autoClose: 3000,
//     });

//     console.log("Submitted data:", { ...data, logoFile });
//     reset();
//     setLogoFile(null);
//     setStep(1);
//   };

//   const nextStep = () => {
//     if (step === 1 && (!watch("companyName") || !watch("companyDescription") || !logoFile)) {
//       toast.error("Please fill all company info fields before proceeding.");
//       return;
//     }
//     if (step === 2 && (!watch("userNames") || !watch("userRoles") || !watch("userEmails") || !watch("userPasswords"))) {
//       toast.error("Please fill all user info fields before proceeding.");
//       return;
//     }
//     setStep(step + 1);
//   };

//   const prevStep = () => setStep(step - 1);

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
//       style={{
//         backgroundImage:
//           "url(https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjg5fHx0ZWNobm9sb2d5fGVufDB8fDB8fHww)",
//       }}
//     >
//       <div className="w-full max-w-xl bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-10">
//         <h2 className="text-4xl font-bold text-center text-white mb-10 tracking-wide drop-shadow-lg">
//           Onboarding
//         </h2>

//         {/* Progress Indicator */}
//         <div className="flex justify-between mb-8">
//           <div className={`w-1/3 h-2 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-white/30"}`}></div>
//           <div className={`w-1/3 h-2 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-white/30"}`}></div>
//           <div className={`w-1/3 h-2 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-white/30"}`}></div>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Step 1: Company Info */}
//           {step === 1 && (
//             <div className="space-y-5">
//               <div>
//                 <label className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer text-white hover:text-purple-200 bg-white/10 backdrop-blur-sm hover:shadow-lg transition">
//                   <span>{logoFile ? logoFile.name : "Upload Company Logo"}</span>
//                   <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition">
//                     Choose File
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     {...register("logo")}
//                     onChange={(e) => setLogoFile(e.target.files[0])}
//                   />
//                 </label>
//                 {!logoFile && <p className="text-red-400 text-sm mt-1">Logo is required</p>}
//               </div>

//               <input
//                 type="text"
//                 placeholder="Company Name"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
//                 {...register("companyName", { required: "Company Name is required" })}
//               />
//               {errors.companyName && <p className="text-red-400 text-sm">{errors.companyName.message}</p>}

//               <textarea
//                 placeholder="Company Description"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
//                 {...register("companyDescription", { required: "Description is required" })}
//               />
//               {errors.companyDescription && <p className="text-red-400 text-sm">{errors.companyDescription.message}</p>}
//             </div>
//           )}

//           {/* Step 2: Users Info */}
//           {step === 2 && (
//             <div className="space-y-5 text-white">
//               <h3 className="text-lg font-semibold mb-3">Company Users</h3>

//               <input
//                 type="text"
//                 placeholder="User Names "
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userNames", { required: "User names are required" })}
//               />
//               {errors.userNames && <p className="text-red-400 text-sm">{errors.userNames.message}</p>}

//               <input
//                 type="text"
//                 placeholder="User Roles "
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userRoles", { required: "User roles are required" })}
//               />
//               {errors.userRoles && <p className="text-red-400 text-sm">{errors.userRoles.message}</p>}

//               <input
//                 type="text"
//                 placeholder="User Emails "
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userEmails", { required: "User emails are required" })}
//               />
//               {errors.userEmails && <p className="text-red-400 text-sm">{errors.userEmails.message}</p>}

//               <input
//                 type="text"
//                 placeholder="User Passwords "
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userPasswords", { required: "User passwords are required" })}
//               />
//               {errors.userPasswords && <p className="text-red-400 text-sm">{errors.userPasswords.message}</p>}
//             </div>
//           )}

//           {/* Step 3: Review */}
//           {step === 3 && (
//             <div className="space-y-4 text-white">
//               <h3 className="text-lg font-semibold">Review & Submit</h3>
//               <p><strong>Company Name:</strong> {watch("companyName")}</p>
//               <p><strong>Description:</strong> {watch("companyDescription")}</p>
//               <p><strong>Logo:</strong> {logoFile?.name}</p>
//               <p><strong>User Names:</strong> {watch("userNames")}</p>
//               <p><strong>User Roles:</strong> {watch("userRoles")}</p>
//               <p><strong>User Emails:</strong> {watch("userEmails")}</p>
//               <p><strong>User Passwords:</strong> {watch("userPasswords")}</p>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-8">
//             {step > 1 && (
//               <button
//                 type="button"
//                 className="px-6 py-2 bg-gray-500/60 text-white rounded-lg hover:bg-blue-500 transition cursor-pointer"
//                 onClick={prevStep}
//               >
//                 Back
//               </button>
//             )}
//             {step < 3 && (
//               <button
//                 type="button"
//                 className="ml-auto px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer text-white transition"
//                 onClick={nextStep}
//               >
//                 Next
//               </button>
//             )}
//             {step === 3 && (
//               <button
//                 type="submit"
//                 className="ml-auto px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white transition"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </form>

//         <ToastContainer />
//       </div>
//     </div>
//   );
// }


















// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { db, auth } from "../config/firebase";
// import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

// export default function CompanyRegisterOnboarding() {
//   const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ mode: "onBlur" });
//   const [logoFile, setLogoFile] = useState(null);
//   const [step, setStep] = useState(1);

//   const onSubmit = async (data) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         toast.error("User not logged in!");
//         return;
//       }

//       // ✅ Save onboarding details
//       await addDoc(collection(db, "onboarding"), {
//         uid: user.uid,
//         email: user.email,
//         company: data.companyName,
//         description: data.companyDescription,
//         logo: logoFile?.name || null,
//         createdAt: new Date(),
//       });

//       // ✅ Mark user reached onboarding
//       const logRef = doc(db, "log_time", user.uid);
//       await updateDoc(logRef, { reached_onboarding: true });

//       toast.success("Company Registered Successfully!", { position: "top-center", autoClose: 3000 });

//       reset();
//       setLogoFile(null);
//       setStep(1);
//     } catch (err) {
//       console.error("Onboarding error:", err);
//       toast.error("Failed to save onboarding data!");
//     }
//   };

//   // ✅ (rest of your onboarding UI code remains same)
// }








// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";

// export default function Onboarding() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm({ mode: "onBlur" });

//   const [logoFile, setLogoFile] = useState(null);
//   const [step, setStep] = useState(1);

//   const onSubmit = (data) => {
//     toast.success("Company Registered Successfully!", {
//       position: "top-center",
//       autoClose: 3000,
//     });

//     console.log("Submitted data:", { ...data, logoFile });
//     reset();
//     setLogoFile(null);
//     setStep(1);
//   };

//   const nextStep = () => {
//     if (
//       step === 1 &&
//       (!watch("companyName") ||
//         !watch("companyDescription") ||
//         !logoFile)
//     ) {
//       toast.error("Please fill all company info fields before proceeding.");
//       return;
//     }
//     if (
//       step === 2 &&
//       (!watch("userNames") ||
//         !watch("userRoles") ||
//         !watch("userEmails") ||
//         !watch("userPasswords"))
//     ) {
//       toast.error("Please fill all user info fields before proceeding.");
//       return;
//     }
//     setStep(step + 1);
//   };

//   const prevStep = () => setStep(step - 1);

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
//       style={{
//         backgroundImage:
//           "url(https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=1200&auto=format&fit=crop&q=60)",
//       }}
//     >
//       <div className="w-full max-w-xl bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-10">
//         <h2 className="text-4xl font-bold text-center text-white mb-10 tracking-wide drop-shadow-lg">
//           Onboarding
//         </h2>

//         {/* Progress Indicator */}
//         <div className="flex justify-between mb-8">
//           <div
//             className={`w-1/3 h-2 rounded-full ${
//               step >= 1 ? "bg-blue-500" : "bg-white/30"
//             }`}
//           ></div>
//           <div
//             className={`w-1/3 h-2 rounded-full ${
//               step >= 2 ? "bg-blue-500" : "bg-white/30"
//             }`}
//           ></div>
//           <div
//             className={`w-1/3 h-2 rounded-full ${
//               step >= 3 ? "bg-blue-500" : "bg-white/30"
//             }`}
//           ></div>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Step 1: Company Info */}
//           {step === 1 && (
//             <div className="space-y-5">
//               <div>
//                 <label className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer text-white hover:text-purple-200 bg-white/10 backdrop-blur-sm hover:shadow-lg transition">
//                   <span>
//                     {logoFile ? logoFile.name : "Upload Company Logo"}
//                   </span>
//                   <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition">
//                     Choose File
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     {...register("logo")}
//                     onChange={(e) => setLogoFile(e.target.files[0])}
//                   />
//                 </label>
//                 {!logoFile && (
//                   <p className="text-red-400 text-sm mt-1">
//                     Logo is required
//                   </p>
//                 )}
//               </div>

//               <input
//                 type="text"
//                 placeholder="Company Name"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
//                 {...register("companyName", {
//                   required: "Company Name is required",
//                 })}
//               />
//               {errors.companyName && (
//                 <p className="text-red-400 text-sm">
//                   {errors.companyName.message}
//                 </p>
//               )}

//               <textarea
//                 placeholder="Company Description"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
//                 {...register("companyDescription", {
//                   required: "Description is required",
//                 })}
//               />
//               {errors.companyDescription && (
//                 <p className="text-red-400 text-sm">
//                   {errors.companyDescription.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Step 2: Users Info */}
//           {step === 2 && (
//             <div className="space-y-5 text-white">
//               <h3 className="text-lg font-semibold mb-3">Company Users</h3>

//               <input
//                 type="text"
//                 placeholder="User Names"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userNames", {
//                   required: "User names are required",
//                 })}
//               />
//               {errors.userNames && (
//                 <p className="text-red-400 text-sm">
//                   {errors.userNames.message}
//                 </p>
//               )}

//               <input
//                 type="text"
//                 placeholder="User Roles"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userRoles", {
//                   required: "User roles are required",
//                 })}
//               />
//               {errors.userRoles && (
//                 <p className="text-red-400 text-sm">
//                   {errors.userRoles.message}
//                 </p>
//               )}

//               <input
//                 type="email"
//                 placeholder="User Emails"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userEmails", {
//                   required: "User emails are required",
//                 })}
//               />
//               {errors.userEmails && (
//                 <p className="text-red-400 text-sm">
//                   {errors.userEmails.message}
//                 </p>
//               )}

//               <input
//                 type="password"
//                 placeholder="User Passwords"
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 placeholder-white/70 transition"
//                 {...register("userPasswords", {
//                   required: "User passwords are required",
//                 })}
//               />
//               {errors.userPasswords && (
//                 <p className="text-red-400 text-sm">
//                   {errors.userPasswords.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Step 3: Review */}
//           {step === 3 && (
//             <div className="space-y-4 text-white">
//               <h3 className="text-lg font-semibold">Review & Submit</h3>
//               <p>
//                 <strong>Company Name:</strong> {watch("companyName")}
//               </p>
//               <p>
//                 <strong>Description:</strong> {watch("companyDescription")}
//               </p>
//               <p>
//                 <strong>Logo:</strong> {logoFile?.name}
//               </p>
//               <p>
//                 <strong>User Names:</strong> {watch("userNames")}
//               </p>
//               <p>
//                 <strong>User Roles:</strong> {watch("userRoles")}
//               </p>
//               <p>
//                 <strong>User Emails:</strong> {watch("userEmails")}
//               </p>
//               <p>
//                 <strong>User Passwords:</strong> {watch("userPasswords")}
//               </p>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-8">
//             {step > 1 && (
//               <button
//                 type="button"
//                 className="px-6 py-2 bg-gray-500/60 text-white rounded-lg hover:bg-blue-500 transition cursor-pointer"
//                 onClick={prevStep}
//               >
//                 Back
//               </button>
//             )}
//             {step < 3 && (
//               <button
//                 type="button"
//                 className="ml-auto px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer text-white transition"
//                 onClick={nextStep}
//               >
//                 Next
//               </button>
//             )}
//             {step === 3 && (
//               <button
//                 type="submit"
//                 className="ml-auto px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white transition"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </form>

//         <ToastContainer />
//       </div>
//     </div>
//   );
// }














import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  const [logoFile, setLogoFile] = useState(null);

  const onSubmit = (data) => {
    if (!logoFile) {
      toast.error("Please upload company logo!");
      return;
    }

    toast.success("Company Registered Successfully!", {
      position: "top-center",
      autoClose: 3000,
    });

    console.log("Submitted data:", { ...data, logoFile });
    reset();
    navigate('/admin/allusers');
    setLogoFile(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=1200&auto=format&fit=crop&q=60)",
      }}
    >
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-white mb-10 tracking-wide drop-shadow-lg">
          Onboarding
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Logo */}
          <div>
            <label className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer text-white hover:text-purple-200 bg-white/10 backdrop-blur-sm hover:shadow-lg transition">
              <span>{logoFile ? logoFile.name : "Upload Company Logo"}</span>
              <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition">
                Choose File
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("logo")}
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </label>
            {!logoFile && (
              <p className="text-red-400 text-sm mt-1">Logo is required</p>
            )}
          </div>

          {/* Company Name */}
          <input
            type="text"
            placeholder="Company Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
            {...register("companyName", {
              required: "Company Name is required",
            })}
          />
          {errors.companyName && (
            <p className="text-red-400 text-sm">{errors.companyName.message}</p>
          )}

          {/* Company Description */}
          <textarea
            placeholder="Company Description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-lg bg-white/20 text-white placeholder-white/70 transition"
            {...register("companyDescription", {
              required: "Description is required",
            })}
          />
          {errors.companyDescription && (
            <p className="text-red-400 text-sm">
              {errors.companyDescription.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 text-white font-semibold transition"
          >
            Submit
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
