// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { db } from "../../config/firebase"; // firestore instance only
// import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function Onboarding() {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm({ mode: "onBlur" });

//   const [logoFile, setLogoFile] = useState(null);
//   const [step, setStep] = useState(1);
//   const [showUserForm, setShowUserForm] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionProgress, setSubmissionProgress] = useState(0);

//   // Loader UI
//   const ProfessionalLoader = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-[#101828] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <h3 className="text-white text-xl font-semibold mb-2">Creating Company & Users</h3>
//           <p className="text-gray-400 text-center mb-4">
//             Please wait while we set up your company and user accounts...
//           </p>
//           <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${submissionProgress}%` }}
//             ></div>
//           </div>
//           <span className="text-white text-sm">{submissionProgress}% Complete</span>
//           <div className="mt-4 text-sm text-gray-400 space-y-1">
//             <div className={`flex items-center ${submissionProgress >= 25 ? "text-green-400" : ""}`}>
//               <span className="mr-2">{submissionProgress >= 25 ? "✓" : "○"}</span>
//               Creating Company
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 50 ? "text-green-400" : ""}`}>
//               <span className="mr-2">{submissionProgress >= 50 ? "✓" : "○"}</span>
//               Creating Users
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 75 ? "text-green-400" : ""}`}>
//               <span className="mr-2">{submissionProgress >= 75 ? "✓" : "○"}</span>
//               Finalizing Setup
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 100 ? "text-green-400" : ""}`}>
//               <span className="mr-2">{submissionProgress >= 100 ? "✓" : "○"}</span>
//               Redirecting...
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const nextStep = () => {
//     if (
//       step === 1 &&
//       (!watch("companyName") || !watch("companyDescription") || !watch("companyOwner") || !logoFile)
//     ) {
//       toast.error("Please fill all company info fields before proceeding.");
//       return;
//     }
//     setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const hasAdminUser = () => users.some((u) => u.role.toLowerCase() === "admin");

//   // Main form submit
//   const onSubmit = async (data) => {
//     if (!hasAdminUser()) {
//       toast.error("❌ At least one user must have the 'admin' role!");
//       return;
//     }

//     if (users.length === 0) {
//       toast.error("❌ Please add at least one user!");
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmissionProgress(10);

//     try {
//       // Step 1: Create company
//       setSubmissionProgress(25);
//       const companyRef = doc(collection(db, "companies"));
//       await setDoc(companyRef, {
//         companyName: data.companyName,
//         companyDescription: data.companyDescription,
//         companyOwner: data.companyOwner,
//         logoName: logoFile ? logoFile.name : null,
//         createdAt: serverTimestamp(),
//       });

//       console.log("✅ Company created:", companyRef.id);
//       setSubmissionProgress(40);

//       // Step 2: Create users inside "users" collection
//       const totalUsers = users.length;
//       let completed = 0;

//       await Promise.all(
//         users.map(async (user) => {
//           const userRef = doc(collection(db, "users"));
//           const userData = {
//             name: user.name,
//             email: user.email,
//             password: user.password, // ⚠️ stored plain text
//             contact: user.contact,
//             role: user.role,
//             department: user.department,
//             status: "inactive",
//             cid: companyRef.id,
//             createdAtClient: user.createdAt,
//             createdAt: serverTimestamp(),
//             uid: userRef.id,
//           };

//           if (user.role.toLowerCase() === "admin") {
//             userData.timer = 300000; // 5 min
//           }

//           await setDoc(userRef, userData);
//           console.log("✅ User saved:", user.email);

//           completed++;
//           const progress = 40 + (completed / totalUsers) * 50;
//           setSubmissionProgress(Math.min(progress, 90));
//         })
//       );

//       // Success
//       setSubmissionProgress(100);
//       toast.success(`✅ Company & ${users.length} Users Registered Successfully!`, {
//         autoClose: 2000,
//         position: "top-center",
//       });

//       setTimeout(() => {
//         setIsSubmitting(false);
//         setSubmissionProgress(0);
//         navigate("/admin/allusers");
//         reset();
//         setLogoFile(null);
//         setUsers([]);
//         setStep(1);
//       }, 1500);
//     } catch (err) {
//       console.error("❌ Error:", err);
//       toast.error(`Failed to save: ${err.message}`);
//       setIsSubmitting(false);
//       setSubmissionProgress(0);
//     }
//   };

//   // Add user into state
//   const addUser = (data) => {
//     if (data.userPasswordOnboard !== data.userConfirmPasswordOnboard) {
//       toast.error("Passwords do not match!");
//       return;
//     }
//     if (data.userPasswordOnboard.length < 6) {
//       toast.error("Password must be at least 6 characters long!");
//       return;
//     }
//     if (users.some((u) => u.email.toLowerCase() === data.userEmailOnboard.toLowerCase())) {
//       toast.error("User with this email already exists!");
//       return;
//     }
//     const newUser = {
//       name: data.userNameOnboard.trim(),
//       email: data.userEmailOnboard.toLowerCase().trim(),
//       password: data.userPasswordOnboard, // plain text
//       contact: data.userContactOnboard.trim(),
//       role: data.userRoleOnboard.trim(),
//       department: data.userDepartmentOnboard.trim(),
//       createdAt: new Date().toLocaleDateString(),
//     };
//     setUsers([...users, newUser]);
//     setShowUserForm(false);
//     toast.success("✅ User added!");
//     [
//       "userNameOnboard",
//       "userEmailOnboard",
//       "userPasswordOnboard",
//       "userConfirmPasswordOnboard",
//       "userContactOnboard",
//       "userRoleOnboard",
//       "userDepartmentOnboard",
//     ].forEach((f) => setValue(f, ""));
//   };

//   const deleteUser = (i) => {
//     const u = users[i];
//     if (u.role.toLowerCase() === "admin" && users.filter((x) => x.role.toLowerCase() === "admin").length === 1) {
//       toast.error("❌ Cannot delete the only admin user!");
//       return;
//     }
//     setUsers(users.filter((_, idx) => idx !== i));
//     toast.info("User deleted");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#1E2939] p-6">
//       {isSubmitting && <ProfessionalLoader />}

//       <div className="w-full max-w-7xl bg-[#101828] border border-gray-200 rounded-2xl shadow-xl p-12">
//         <h2 className="text-4xl font-bold text-white text-center mb-10">Onboarding</h2>

//         <div className="flex justify-center gap-6 mb-10">
//           <div className={`w-5 h-5 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-300"}`} />
//           <div className={`w-5 h-5 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-300"}`} />
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
//           {step === 1 && (
//             <div className="space-y-6 flex flex-col items-center">
//               <label className="flex items-center justify-between w-3/4 max-w-lg p-3 border rounded-lg cursor-pointer text-white bg-[#1E2939]">
//                 <span>{logoFile ? logoFile.name : "Upload Company Logo"}</span>
//                 <span className="bg-blue-600 text-white px-3 py-1 rounded-md">Choose File</span>
//                 <input type="file" accept="image/*" className="hidden" {...register("logo")} onChange={(e) => setLogoFile(e.target.files[0])} />
//               </label>
//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 text-white">Company Name</label>
//                 <input type="text" {...register("companyName", { required: "Company Name is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
//                 {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
//               </div>
//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 text-white">Company Owner</label>
//                 <input type="text" {...register("companyOwner", { required: "Company Owner is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
//                 {errors.companyOwner && <p className="text-red-500 text-sm">{errors.companyOwner.message}</p>}
//               </div>
//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 text-white">Company Description</label>
//                 <textarea {...register("companyDescription", { required: "Description is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
//                 {errors.companyDescription && <p className="text-red-500 text-sm">{errors.companyDescription.message}</p>}
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-semibold text-white">Company Users {hasAdminUser() && "✅"}</h3>
//                 <button type="button" onClick={() => setShowUserForm(!showUserForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
//                   {showUserForm ? "Cancel" : "Add User"}
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left border-separate border-spacing-y-3">
//                   <thead className="text-white bg-[#1E2939]">
//                     <tr>
//                       <th className="px-6 py-3">Name</th>
//                       <th className="px-6 py-3">Email</th>
//                       <th className="px-6 py-3">Contact</th>
//                       <th className="px-6 py-3">Role</th>
//                       <th className="px-6 py-3">Department</th>
//                       <th className="px-6 py-3">Created At</th>
//                       <th className="px-6 py-3">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((u, i) => (
//                       <tr key={i} className="text-white bg-[#1E2939] hover:bg-gray-700">
//                         <td className="px-6 py-4">{u.name}</td>
//                         <td className="px-6 py-4">{u.email}</td>
//                         <td className="px-6 py-4">{u.contact}</td>
//                         <td className="px-6 py-4">{u.role}</td>
//                         <td className="px-6 py-4">{u.department}</td>
//                         <td className="px-6 py-4">{u.createdAt}</td>
//                         <td className="px-6 py-4 text-red-500 cursor-pointer" onClick={() => deleteUser(i)}>✖</td>
//                       </tr>
//                     ))}
//                     {showUserForm && (
//                       <tr className="text-white bg-[#1E2939]">
//                         <td><input type="text" placeholder="Name" {...register("userNameOnboard", { required: "Required" })} className="w-full p-2 bg-transparent" /></td>
//                         <td><input type="email" placeholder="Email" {...register("userEmailOnboard", { required: "Required" })} className="w-full p-2 bg-transparent" /></td>
//                         <td><input type="text" placeholder="Contact" {...register("userContactOnboard", { required: "Required" })} className="w-full p-2 bg-transparent" /></td>
//                         <td><input type="text" placeholder="Role" {...register("userRoleOnboard", { required: "Required" })} className="w-full p-2 bg-transparent" /></td>
//                         <td><input type="text" placeholder="Department" {...register("userDepartmentOnboard", { required: "Required" })} className="w-full p-2 bg-transparent" /></td>
//                         <td>Now</td>
//                         <td>
//                           <button type="button" className="text-green-500 mr-2" onClick={handleSubmit(addUser)}>✔</button>
//                           <button type="button" className="text-red-500" onClick={() => setShowUserForm(false)}>✖</button>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {showUserForm && (
//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="text-white">Password</label>
//                     <input type="password" placeholder="Password" {...register("userPasswordOnboard", { required: "Required", minLength: 6 })} className="w-full p-3 border rounded-lg bg-transparent text-white" />
//                   </div>
//                   <div>
//                     <label className="text-white">Confirm Password</label>
//                     <input type="password" placeholder="Confirm" {...register("userConfirmPasswordOnboard", { required: "Required" })} className="w-full p-3 border rounded-lg bg-transparent text-white" />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="flex justify-between mt-10">
//             {step > 1 && <button type="button" className="px-6 py-2 bg-gray-600 text-white rounded-lg" onClick={prevStep}>Back</button>}
//             {step === 1 && <button type="button" className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={nextStep}>Next</button>}
//             {step === 2 && (
//               <button type="submit" disabled={users.length === 0 || !hasAdminUser() || isSubmitting} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg">
//                 {isSubmitting ? "Processing..." : !hasAdminUser() ? "Add Admin User" : "Submit"}
//               </button>
//             )}
//           </div>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }


//-------------------------------------------------------------------------------------------------------

// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { db, auth } from "../../config/firebase";
// import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function Onboarding() {
//   const navigate = useNavigate();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm({ mode: "onBlur" });

//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [step, setStep] = useState(1);
//   const [showUserForm, setShowUserForm] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionProgress, setSubmissionProgress] = useState(0);

//   // ✅ Professional Loader Component
//   const ProfessionalLoader = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-[#101828] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <h3 className="text-white text-xl font-semibold mb-2">Creating Company & Users</h3>
//           <p className="text-gray-400 text-center mb-4">
//             Please wait while we set up your company and user accounts...
//           </p>
//           <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
//             <div 
//               className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${submissionProgress}%` }}
//             ></div>
//           </div>
//           <span className="text-white text-sm">{submissionProgress}% Complete</span>
//           <div className="mt-4 text-sm text-gray-400 space-y-1">
//             <div className={`flex items-center ${submissionProgress >= 20 ? 'text-green-400' : ''}`}>
//               <span className="mr-2">{submissionProgress >= 20 ? '✓' : '○'}</span>
//               Processing Logo
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 40 ? 'text-green-400' : ''}`}>
//               <span className="mr-2">{submissionProgress >= 40 ? '✓' : '○'}</span>
//               Creating Company
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 70 ? 'text-green-400' : ''}`}>
//               <span className="mr-2">{submissionProgress >= 70 ? '✓' : '○'}</span>
//               Creating Users
//             </div>
//             <div className={`flex items-center ${submissionProgress >= 100 ? 'text-green-400' : ''}`}>
//               <span className="mr-2">{submissionProgress >= 100 ? '✓' : '○'}</span>
//               Redirecting...
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ✅ Compress Image Function
//   const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           let width = img.width;
//           let height = img.height;

//           // Calculate new dimensions
//           if (width > height) {
//             if (width > maxWidth) {
//               height = Math.round((height * maxWidth) / width);
//               width = maxWidth;
//             }
//           } else {
//             if (height > maxHeight) {
//               width = Math.round((width * maxHeight) / height);
//               height = maxHeight;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;

//           const ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0, width, height);

//           // Convert to base64 with quality
//           const base64 = canvas.toDataURL('image/jpeg', quality);
//           resolve(base64);
//         };
//         img.onerror = error => reject(error);
//       };
//       reader.onerror = error => reject(error);
//     });
//   };

//   // ✅ Logo Upload Handler with Compression
//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // ✅ File type validation
//       if (!file.type.startsWith('image/')) {
//         toast.error("Please upload an image file");
//         return;
//       }

//       // ✅ File size validation (max 500KB before compression)
//       if (file.size > 500 * 1024) {
//         toast.error("File size should be less than 500KB");
//         return;
//       }

//       setLogoFile(file);
      
//       // ✅ Preview with compression
//       compressImage(file, 200, 200, 0.8)
//         .then(compressedBase64 => {
//           setLogoPreview(compressedBase64);
//         })
//         .catch(error => {
//           console.error("Preview compression error:", error);
//           // Fallback to regular file reader
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             setLogoPreview(e.target.result);
//           };
//           reader.readAsDataURL(file);
//         });
//     }
//   };

//   // ✅ Next Step Function
//   const nextStep = () => {
//     if (
//       step === 1 &&
//       (!watch("companyName") || !watch("companyDescription") || 
//        !watch("companyOwner") || !logoFile)
//     ) {
//       toast.error("Please fill all company info fields before proceeding.");
//       return;
//     }
//     setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   // ✅ Check if at least one user has admin role
//   const hasAdminUser = () => {
//     return users.some(user => user.role.toLowerCase() === "admin");
//   };

//   // ✅ IMPROVED: Final Submit with Compressed Base64 Logo
//   const onSubmit = async (data) => {
//     if (!hasAdminUser()) {
//       toast.error("❌ At least one user must have the 'admin' role!", {
//         position: "top-center",
//         autoClose: 4000,
//       });
//       return;
//     }

//     if (users.length === 0) {
//       toast.error("❌ Please add at least one user!");
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmissionProgress(10);

//     try {
//       let logoBase64 = null;

//       // ✅ Step 1: Compress and Convert Logo to Base64
//       if (logoFile) {
//         setSubmissionProgress(20);
//         try {
//           // ✅ Compress image for storage (smaller size)
//           logoBase64 = await compressImage(logoFile, 400, 400, 0.6);
//           console.log("✅ Logo compressed to base64, length:", logoBase64.length);
          
//           // ✅ Check if still too large
//           if (logoBase64.length > 900000) { // Leave some buffer
//             toast.warning("Logo is too large, using lower quality compression");
//             logoBase64 = await compressImage(logoFile, 300, 300, 0.5);
//           }
          
//           setSubmissionProgress(30);
//         } catch (convertError) {
//           console.error("❌ Logo compression failed:", convertError);
//           toast.error("Logo processing failed. Please try a different image.");
//           setIsSubmitting(false);
//           setSubmissionProgress(0);
//           return;
//         }
//       }

//       // ✅ Step 2: Create Company with Compressed Base64 Logo
//       setSubmissionProgress(40);
//       const companyRef = doc(collection(db, "companies"));
      
//       const companyData = {
//         companyName: data.companyName,
//         companyDescription: data.companyDescription,
//         companyOwner: data.companyOwner,
//         logoName: logoFile ? logoFile.name : null,
//         logoSize: logoFile ? logoFile.size : null,
//         logoType: logoFile ? logoFile.type : null,
//         createdAt: serverTimestamp(),
//       };

//       // ✅ Only add logoBase64 if it's within Firestore limits
//       if (logoBase64 && logoBase64.length < 1000000) { // 1MB limit
//         companyData.logoName = logoBase64;
//         console.log("✅ Logo added to company data, size:", logoBase64.length);
//       } else if (logoBase64) {
//         console.warn("⚠️ Logo too large for Firestore, skipping base64 storage");
//         toast.warning("Logo too large, stored without image");
//       }

//       await setDoc(companyRef, companyData);

//       console.log("✅ Company created with ID:", companyRef.id);
//       setSubmissionProgress(50);

//       // ✅ Step 3: Create Users (WITHOUT storing logo in each user)
//       const totalUsers = users.length;
//       let completedUsers = 0;

//       const userCreationPromises = users.map(async (user, index) => {
//         try {
//           console.log(`Creating user ${index + 1}:`, user.email);
          
//           // ✅ Create user in Firebase Authentication
//           const userCredential = await createUserWithEmailAndPassword(
//             auth,
//             user.email,
//             user.password
//           );
          
//           const uid = userCredential.user.uid;
//           console.log(`✅ Firebase Auth user created: ${user.email} (UID: ${uid})`);

//           // ✅ Prepare user data for Firestore (NO logo in user document)
//           const userData = {
//             uid: uid,
//             name: user.name,
//             email: user.email,
//             contact: user.contact,
//             role: user.role,
//             department: user.department,
//             status: "inactive",
//             cid: companyRef.id,
//             createdAt: serverTimestamp(),
//           };

//           // ✅ Add timer for admin users
//           if (user.role.toLowerCase() === "admin") {
//             userData.timer = 300000;
//           }

//           // ✅ Save user to Firestore with UID as Document ID
//           const userDocRef = doc(db, "users", uid);
//           await setDoc(userDocRef, userData);
          
//           console.log(`✅ User saved to Firestore: ${user.email}`);
          
//           // ✅ Update progress
//           completedUsers++;
//           const progress = 50 + (completedUsers / totalUsers) * 40;
//           setSubmissionProgress(Math.min(progress, 90));
          
//           return { 
//             success: true, 
//             email: user.email, 
//             uid: uid,
//             documentId: uid
//           };
          
//         } catch (userErr) {
//           console.error(`❌ Error creating user ${user.email}:`, userErr);
//           return { 
//             success: false, 
//             email: user.email, 
//             error: userErr.message 
//           };
//         }
//       });

//       // ✅ Wait for all user creations to complete
//       const results = await Promise.all(userCreationPromises);
      
//       // ✅ Check results
//       const failedCreations = results.filter(result => !result.success);
      
//       if (failedCreations.length > 0) {
//         setSubmissionProgress(100);
//         setTimeout(() => {
//           setIsSubmitting(false);
//           setSubmissionProgress(0);
//         }, 1000);
        
//         const errorMessages = failedCreations.map(f => `${f.email}: ${f.error}`).join(', ');
//         toast.error(`Some users failed to create: ${errorMessages}`);
//         return;
//       }

//       // ✅ SUCCESS - Finalize progress
//       setSubmissionProgress(100);
      
//       // ✅ Show success message briefly
//       toast.success(`✅ Company & ${results.length} Users Registered Successfully!`, {
//         position: "top-center",
//         autoClose: 2000,
//       });

//       // ✅ Wait a moment to show completion, then redirect directly
//       setTimeout(() => {
//         setIsSubmitting(false);
//         setSubmissionProgress(0);
        
//         navigate("/admin/allusers");
        
//         reset();
//         setLogoFile(null);
//         setLogoPreview(null);
//         setUsers([]);
//         setStep(1);
//       }, 1500);

//     } catch (err) {
//       console.error("Main submission error:", err);
//       setSubmissionProgress(100);
      
//       setTimeout(() => {
//         setIsSubmitting(false);
//         setSubmissionProgress(0);
//       }, 1000);
      
//       if (err.message.includes("longer than 1048487 bytes")) {
//         toast.error("Logo is too large. Please use a smaller image file.");
//       } else {
//         toast.error(`Failed to save data: ${err.message}`);
//       }
//     }
//   };

//   // ✅ Rest of your functions remain the same...
//   const addUser = (userData) => {
//     if (userData.userPasswordOnboard !== userData.userConfirmPasswordOnboard) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     if (userData.userPasswordOnboard.length < 6) {
//       toast.error("Password must be at least 6 characters long!");
//       return;
//     }

//     const emailExists = users.some(user => 
//       user.email.toLowerCase() === userData.userEmailOnboard.toLowerCase()
//     );
//     if (emailExists) {
//       toast.error("User with this email already exists!");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(userData.userEmailOnboard)) {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     const newUser = {
//       name: userData.userNameOnboard.trim(),
//       email: userData.userEmailOnboard.toLowerCase().trim(),
//       password: userData.userPasswordOnboard,
//       contact: userData.userContactOnboard.trim(),
//       role: userData.userRoleOnboard.trim(),
//       department: userData.userDepartmentOnboard.trim(),
//       createdAt: new Date().toLocaleDateString(),
//     };
    
//     setUsers([...users, newUser]);
//     toast.success("✅ User added successfully!");

//     setShowUserForm(false);
//     [
//       "userNameOnboard",
//       "userEmailOnboard",
//       "userPasswordOnboard",
//       "userConfirmPasswordOnboard",
//       "userContactOnboard",
//       "userRoleOnboard",
//       "userDepartmentOnboard",
//     ].forEach((field) => setValue(field, ""));
//   };

//   const deleteUser = (index) => {
//     const userToDelete = users[index];
//     if (userToDelete.role.toLowerCase() === "admin") {
//       const adminUsers = users.filter(user => user.role.toLowerCase() === "admin");
//       if (adminUsers.length === 1) {
//         toast.error("❌ Cannot delete the only admin user!", {
//           position: "top-center",
//           autoClose: 3000,
//         });
//         return;
//       }
//     }

//     setUsers(users.filter((_, i) => i !== index));
//     toast.info("User deleted", { position: "top-center", autoClose: 2000 });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#1E2939] p-6">
//       {/* Professional Loader */}
//       {isSubmitting && <ProfessionalLoader />}
      
//       <div className="w-full max-w-7xl bg-[#101828] border border-gray-200 rounded-2xl shadow-xl p-12">
//         <h2 className="text-4xl font-bold text-white text-center mb-10">
//           Onboarding
//         </h2>

//         {/* Steps */}
//         <div className="flex justify-center items-center gap-6 mb-10">
//           <div
//             className={`w-5 h-5 rounded-full ${
//               step >= 1 ? "bg-blue-500" : "bg-gray-300"
//             }`}
//           />
//           <div
//             className={`w-5 h-5 rounded-full ${
//               step >= 2 ? "bg-blue-500" : "bg-gray-300"
//             }`}
//           />
//         </div>

        
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-8"
//           autoComplete="off"
//         >
//           {/* Step 1: Company Info */}
//           {step === 1 && (
//             <div className="space-y-6 flex flex-col items-center">
//               {/* ✅ Improved Logo Upload Section */}
//               <div className="w-3/4 max-w-lg space-y-4">
//                 <label className="block mb-1 font-medium text-white">
//                   Company Logo
//                 </label>
                
//                 {/* Logo Preview */}
//                 {logoPreview && (
//                   <div className="flex justify-center mb-4">
//                     <div className="relative">
//                       <img 
//                         src={logoPreview} 
//                         alt="Logo preview" 
//                         className="w-32 h-32 object-contain border rounded-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setLogoFile(null);
//                           setLogoPreview(null);
//                           setValue("logo", "");
//                         }}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <label className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer text-white bg-[#1E2939] hover:shadow-lg transition">
//                   <span>{logoFile ? "Change Logo" : "Upload Company Logo"}</span>
//                   <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition">
//                     Choose File
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     {...register("logo", {
//                       required: "Company logo is required"
//                     })}
//                     onChange={handleLogoUpload}
//                   />
//                 </label>
//                 {errors.logo && (
//                   <p className="text-red-500 text-sm">{errors.logo.message}</p>
//                 )}
//                 {!logoFile && (
//                   <p className="text-gray-400 text-sm">
//                     Recommended: Square logo, max 500KB (will be compressed)
//                   </p>
//                 )}
//               </div>

//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 font-medium text-white">
//                   Company Name
//                 </label>
//                 <input
//                   type="text"
//                   autoComplete="off"
//                   {...register("companyName", {
//                     required: "Company Name is required",
//                   })}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
//                 />
//                 {errors.companyName && (
//                   <p className="text-red-500 text-sm">
//                     {errors.companyName.message}
//                   </p>
//                 )}
//               </div>

//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 font-medium text-white">
//                   Company Owner
//                 </label>
//                 <input
//                   type="text"
//                   autoComplete="off"
//                   {...register("companyOwner", {
//                     required: "Company Owner is required",
//                   })}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
//                 />
//                 {errors.companyOwner && (
//                   <p className="text-red-500 text-sm">
//                     {errors.companyOwner.message}
//                   </p>
//                 )}
//               </div>

//               <div className="w-3/4 max-w-lg">
//                 <label className="block mb-1 font-medium text-white">
//                   Company Description
//                 </label>
//                 <textarea
//                   autoComplete="off"
//                   {...register("companyDescription", {
//                     required: "Description is required",
//                   })}
//                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
//                 />
//                 {errors.companyDescription && (
//                   <p className="text-red-500 text-sm">
//                     {errors.companyDescription.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2: Users - Same as before */}
//           {step === 2 && (
//             <div className="space-y-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-semibold text-white">
//                   Company Users {hasAdminUser() && "✅"}
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={() => setShowUserForm(!showUserForm)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
//                 >
//                   {showUserForm ? "Cancel" : "Add User"}
//                 </button>
//               </div>

//               {/* Users table - same as before */}
//               <div className="overflow-x-auto rounded-lg shadow-sm">
//                 <table className="w-full text-sm text-left border-separate border-spacing-y-3">
//                   <thead className="text-white bg-[#1E2939]">
//                     <tr>
//                       <th className="px-6 py-3 border rounded-lg">Name</th>
//                       <th className="px-6 py-3 border rounded-lg">Email</th>
//                       <th className="px-6 py-3 border rounded-lg">Contact</th>
//                       <th className="px-6 py-3 border rounded-lg">Role</th>
//                       <th className="px-6 py-3 border rounded-lg">Department</th>
//                       <th className="px-6 py-3 border rounded-lg">Created At</th>
//                       <th className="px-6 py-3 border rounded-lg">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((user, index) => (
//                       <tr
//                         key={index}
//                         className={`text-white bg-[#1E2939] shadow-md hover:bg-gray-700 transition rounded-lg ${
//                           user.role.toLowerCase() === "admin" ? "border-l-4 border-l-green-500" : ""
//                         }`}
//                       >
//                         <td className="px-6 py-4">{user.name}</td>
//                         <td className="px-6 py-4">{user.email}</td>
//                         <td className="px-6 py-4">{user.contact}</td>
//                         <td className="px-6 py-4">
//                           <span className={`px-2 py-1 rounded ${
//                             user.role.toLowerCase() === "admin" 
//                               ? "bg-green-600 text-white" 
//                               : "bg-gray-600"
//                           }`}>
//                             {user.role}
//                             {user.role.toLowerCase() === "admin" && (
//                               <span className="text-xs ml-1">⏱️</span>
//                             )}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">{user.department}</td>
//                         <td className="px-6 py-4">{user.createdAt}</td>
//                         <td
//                           className="px-6 py-4 text-red-500 cursor-pointer text-center"
//                           onClick={() => deleteUser(index)}
//                         >
//                           ✖
//                         </td>
//                       </tr>
//                     ))}

//                     {showUserForm && (
//                       <tr className="text-white bg-[#1E2939] rounded-lg shadow-inner">
//                         <td className="px-2 py-1 border rounded-lg">
//                           <input
//                             type="text"
//                             placeholder="Name"
//                             autoComplete="new-name"
//                             {...register("userNameOnboard", {
//                               required: "Name is required",
//                             })}
//                             className="w-full p-3.5 bg-transparent"
//                           />
//                         </td>
//                         <td className="px-2 py-1 border rounded-lg">
//                           <input
//                             type="email"
//                             placeholder="Email"
//                             autoComplete="new-email"
//                             {...register("userEmailOnboard", {
//                               required: "Email is required",
//                             })}
//                             className="w-full p-3.5 bg-transparent"
//                           />
//                         </td>
//                         <td className="px-2 py-1 border rounded-lg">
//                           <input
//                             type="text"
//                             placeholder="Contact"
//                             autoComplete="new-contact"
//                             {...register("userContactOnboard", {
//                               required: "Contact is required",
//                             })}
//                             className="w-full p-3.5 bg-transparent"
//                           />
//                         </td>
//                         <td className="px-2 py-1 border rounded-lg">
//                           <input
//                             type="text"
//                             placeholder="Role (e.g., admin)"
//                             autoComplete="new-role"
//                             {...register("userRoleOnboard", {
//                               required: "Role is required",
//                             })}
//                             className="w-full p-3.5 bg-transparent"
//                           />
//                         </td>
//                         <td className="px-2 py-1 border rounded-lg">
//                           <input
//                             type="text"
//                             placeholder="Department"
//                             autoComplete="new-department"
//                             {...register("userDepartmentOnboard", {
//                               required: "Department is required",
//                             })}
//                             className="w-full p-3.5 bg-transparent"
//                           />
//                         </td>
//                         <td className="px-2 py-1 border rounded-lg text-gray-500 text-center">
//                           Now
//                         </td>
//                         <td className="space-x-2 border rounded-lg text-center">
//                           <button
//                             type="button"
//                             className="text-green-600 mr-3 cursor-pointer text-lg font-bold"
//                             onClick={handleSubmit(addUser)}
//                           >
//                             ✔
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setShowUserForm(false)}
//                             className="text-red-600 cursor-pointer text-lg font-bold"
//                           >
//                             ✖
//                           </button>
//                         </td>
//                       </tr>
//                     )}

//                     {users.length === 0 && !showUserForm && (
//                       <tr>
//                         <td
//                           colSpan="7"
//                           className="text-center py-6 text-gray-500 italic"
//                         >
//                           No users added yet. Click "Add User" to get started.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 {/* Password fields for new user form */}
//                 {showUserForm && (
//                   <div className="mt-4 p-4 bg-[#1E2939] rounded-lg">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block mb-1 text-white text-sm">
//                           Password
//                         </label>
//                         <input
//                           type="password"
//                           placeholder="Password (min 6 characters)"
//                           autoComplete="new-password"
//                           {...register("userPasswordOnboard", {
//                             required: "Password is required",
//                             minLength: {
//                               value: 6,
//                               message: "Password must be at least 6 characters"
//                             }
//                           })}
//                           className="w-full p-3 border rounded-lg bg-transparent text-white"
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-1 text-white text-sm">
//                           Confirm Password
//                         </label>
//                         <input
//                           type="password"
//                           placeholder="Confirm Password"
//                           autoComplete="new-password"
//                           {...register("userConfirmPasswordOnboard", {
//                             required: "Please confirm your password",
//                           })}
//                           className="w-full p-3 border rounded-lg bg-transparent text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Navigation */}
//           <div className="flex justify-between mt-10">
//             {step > 1 && (
//               <button
//                 type="button"
//                 className="px-6 py-2 bg-gray-600 cursor-pointer text-white rounded-lg hover:bg-blue-500 transition"
//                 onClick={prevStep}
//               >
//                 Back
//               </button>
//             )}

//             {step === 1 && (
//               <button
//                 type="button"
//                 className="ml-auto px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer text-white transition"
//                 onClick={nextStep}
//               >
//                 Next
//               </button>
//             )}

//             {step === 2 && (
//               <button
//                 type="submit"
//                 disabled={users.length === 0 || !hasAdminUser() || isSubmitting}
//                 className={`ml-auto px-6 py-2 rounded-lg text-white transition ${
//                   users.length === 0 || !hasAdminUser() || isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {isSubmitting ? "Processing..." : (!hasAdminUser() ? "Add Admin User" : "Submit")}
//               </button>
//             )}
//           </div>
//         </form>

//         <ToastContainer />
//       </div>
//     </div>
//   );
// }


//---------------------------------------------------------------------------------------------


import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { db } from "../../config/firebase"; // Firestore instance
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onBlur" });

  const [logoFile, setLogoFile] = useState(null);
  const [step, setStep] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);

  // Loader Component
  const ProfessionalLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#101828] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-white text-xl font-semibold mb-2">Creating Company & Users</h3>
          <p className="text-gray-400 text-center mb-4">
            Please wait while we set up your company and user accounts...
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${submissionProgress}%` }}
            ></div>
          </div>
          <span className="text-white text-sm">{submissionProgress}% Complete</span>
        </div>
      </div>
    </div>
  );

  const nextStep = () => {
    if (
      step === 1 &&
      (!watch("companyName") ||
        !watch("companyDescription") ||
        !watch("companyOwner") ||
        !logoFile)
    ) {
      toast.error("Please fill all company info fields before proceeding.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const hasAdminUser = () => users.some((u) => u.role.toLowerCase() === "admin");

  // Main form submit
  const onSubmit = async (data) => {
    if (!hasAdminUser()) {
      toast.error("❌ At least one user must have the 'admin' role!");
      return;
    }
    if (users.length === 0) {
      toast.error("❌ Please add at least one user!");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(10);

    try {
      // Step 1: Create Company
      setSubmissionProgress(25);
      const companyRef = doc(collection(db, "companies"));
      await setDoc(companyRef, {
        companyName: data.companyName,
        companyDescription: data.companyDescription,
        companyOwner: data.companyOwner,
        logoName: logoFile ? logoFile.name : null,
        createdAt: serverTimestamp(),
      });

      setSubmissionProgress(40);

      // Step 2: Create Users in Firestore directly
      const totalUsers = users.length;
      let completed = 0;

      await Promise.all(
        users.map(async (user) => {
          const userRef = doc(collection(db, "users"));
          const userData = {
            uid: userRef.id,
            name: user.name,
            email: user.email,
            password: user.password, // ⚠️ plain text storage
            contact: user.contact,
            role: user.role,
            department: user.department,
            status: "inactive",
            cid: companyRef.id,
            createdAtClient: user.createdAt,
            createdAt: serverTimestamp(),
          };
          if (user.role.toLowerCase() === "admin") {
            userData.timer = 300000; // 5 minutes for admin
          }

          await setDoc(userRef, userData);

          completed++;
          const progress = 40 + (completed / totalUsers) * 50;
          setSubmissionProgress(Math.min(progress, 90));
        })
      );

      setSubmissionProgress(100);
      toast.success(`✅ Company & ${users.length} Users Registered Successfully!`, {
        autoClose: 2000,
        position: "top-center",
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionProgress(0);
        navigate("/admin/allusers");
        reset();
        setLogoFile(null);
        setUsers([]);
        setStep(1);
      }, 1500);
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(`Failed to save: ${err.message}`);
      setIsSubmitting(false);
      setSubmissionProgress(0);
    }
  };

  // Add user into state
  const addUser = (data) => {
    if (data.userPasswordOnboard !== data.userConfirmPasswordOnboard) {
      toast.error("Passwords do not match!");
      return;
    }
    if (data.userPasswordOnboard.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === data.userEmailOnboard.toLowerCase())) {
      toast.error("User with this email already exists!");
      return;
    }
    const newUser = {
      name: data.userNameOnboard.trim(),
      email: data.userEmailOnboard.toLowerCase().trim(),
      password: data.userPasswordOnboard,
      contact: data.userContactOnboard.trim(),
      role: data.userRoleOnboard.trim(),
      department: data.userDepartmentOnboard.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    setUsers([...users, newUser]);
    setShowUserForm(false);
    toast.success("✅ User added!");
    [
      "userNameOnboard",
      "userEmailOnboard",
      "userPasswordOnboard",
      "userConfirmPasswordOnboard",
      "userContactOnboard",
      "userRoleOnboard",
      "userDepartmentOnboard",
    ].forEach((f) => setValue(f, ""));
  };

  const deleteUser = (i) => {
    const u = users[i];
    if (u.role.toLowerCase() === "admin" && users.filter((x) => x.role.toLowerCase() === "admin").length === 1) {
      toast.error("❌ Cannot delete the only admin user!");
      return;
    }
    setUsers(users.filter((_, idx) => idx !== i));
    toast.info("User deleted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2939] p-6">
      {isSubmitting && <ProfessionalLoader />}

      <div className="w-full max-w-7xl bg-[#101828] border border-gray-200 rounded-2xl shadow-xl p-12">
        <h2 className="text-4xl font-bold text-white text-center mb-10">Onboarding</h2>

        <div className="flex justify-center gap-6 mb-10">
          <div className={`w-5 h-5 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-300"}`} />
          <div className={`w-5 h-5 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-300"}`} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6 flex flex-col items-center">
              <label className="flex items-center justify-between w-3/4 max-w-lg p-3 border rounded-lg cursor-pointer text-white bg-[#1E2939]">
                <span>{logoFile ? logoFile.name : "Upload Company Logo"}</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-md">Choose File</span>
                <input type="file" accept="image/*" className="hidden" {...register("logo")} onChange={(e) => setLogoFile(e.target.files[0])} />
              </label>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Name</label>
                <input type="text" {...register("companyName", { required: "Company Name is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Owner</label>
                <input type="text" {...register("companyOwner", { required: "Company Owner is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
                {errors.companyOwner && <p className="text-red-500 text-sm">{errors.companyOwner.message}</p>}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Description</label>
                <textarea {...register("companyDescription", { required: "Description is required" })} className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" />
                {errors.companyDescription && <p className="text-red-500 text-sm">{errors.companyDescription.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Company Users {hasAdminUser() && "✅"}</h3>
                <button type="button" onClick={() => setShowUserForm(!showUserForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {showUserForm ? "Cancel" : "Add User"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                  <thead className="text-white bg-[#1E2939]">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Contact</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Created At</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="text-white bg-[#1E2939] hover:bg-gray-700">
                        <td className="px-6 py-4">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">{u.contact}</td>
                        <td className="px-6 py-4">{u.role}</td>
                        <td className="px-6 py-4">{u.department}</td>
                        <td className="px-6 py-4">{u.createdAt}</td>
                        <td className="px-6 py-4 text-red-500 cursor-pointer" onClick={() => deleteUser(i)}>✖</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showUserForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input type="text" placeholder="Name" {...register("userNameOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="email" placeholder="Email" {...register("userEmailOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="text" placeholder="Contact" {...register("userContactOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="text" placeholder="Role" {...register("userRoleOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="text" placeholder="Department" {...register("userDepartmentOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="password" placeholder="Password" {...register("userPasswordOnboard", { required: "Required", minLength: 6 })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <input type="password" placeholder="Confirm Password" {...register("userConfirmPasswordOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
                  <button type="button" className="px-4 py-2 bg-green-500 rounded-lg text-white" onClick={handleSubmit(addUser)}>Add User</button>
                  <button type="button" className="px-4 py-2 bg-red-500 rounded-lg text-white" onClick={() => setShowUserForm(false)}>Cancel</button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-10">
            {step > 1 && <button type="button" className="px-6 py-2 bg-gray-600 text-white rounded-lg" onClick={prevStep}>Back</button>}
            {step === 1 && <button type="button" className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg" onClick={nextStep}>Next</button>}
            {step === 2 && (
              <button type="submit" disabled={users.length === 0 || !hasAdminUser() || isSubmitting} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg">
                {isSubmitting ? "Processing..." : !hasAdminUser() ? "Add Admin User" : "Submit"}
              </button>
            )}
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
