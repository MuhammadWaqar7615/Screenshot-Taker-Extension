// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { db } from "../../config/firebase"; // Firestore instance
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

//   // Loader Component
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
//         </div>
//       </div>
//     </div>
//   );

//   const nextStep = () => {
//     if (
//       step === 1 &&
//       (!watch("companyName") ||
//         !watch("companyDescription") ||
//         !watch("companyOwner") ||
//         !logoFile)
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
//       // Step 1: Create Company
//       setSubmissionProgress(25);
//       const companyRef = doc(collection(db, "companies"));
//       await setDoc(companyRef, {
//         companyName: data.companyName,
//         companyDescription: data.companyDescription,
//         companyOwner: data.companyOwner,
//         logoName: logoFile ? logoFile.name : null,
//         createdAt: serverTimestamp(),
//       });

//       setSubmissionProgress(40);

//       // Step 2: Create Users in Firestore directly
//       const totalUsers = users.length;
//       let completed = 0;

//       await Promise.all(
//         users.map(async (user) => {
//           const userRef = doc(collection(db, "users"));
//           const userData = {
//             uid: userRef.id,
//             name: user.name,
//             email: user.email,
//             password: user.password, // ⚠️ plain text storage
//             contact: user.contact,
//             role: user.role,
//             department: user.department,
//             status: "inactive",
//             cid: companyRef.id,
//             createdAtClient: user.createdAt,
//             createdAt: serverTimestamp(),
//           };
//           if (user.role.toLowerCase() === "admin") {
//             userData.timer = 300000; // 5 minutes for admin
//           }

//           await setDoc(userRef, userData);

//           completed++;
//           const progress = 40 + (completed / totalUsers) * 50;
//           setSubmissionProgress(Math.min(progress, 90));
//         })
//       );

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
//       password: data.userPasswordOnboard,
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
//           {/* Step 1 */}
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

//           {/* Step 2 */}
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
//                   </tbody>
//                 </table>
//               </div>

//               {showUserForm && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                   <input type="text" placeholder="Name" {...register("userNameOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="email" placeholder="Email" {...register("userEmailOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="text" placeholder="Contact" {...register("userContactOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="text" placeholder="Role" {...register("userRoleOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="text" placeholder="Department" {...register("userDepartmentOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="password" placeholder="Password" {...register("userPasswordOnboard", { required: "Required", minLength: 6 })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <input type="password" placeholder="Confirm Password" {...register("userConfirmPasswordOnboard", { required: "Required" })} className="p-3 border rounded-lg bg-transparent text-white" />
//                   <button type="button" className="px-4 py-2 bg-green-500 rounded-lg text-white" onClick={handleSubmit(addUser)}>Add User</button>
//                   <button type="button" className="px-4 py-2 bg-red-500 rounded-lg text-white" onClick={() => setShowUserForm(false)}>Cancel</button>
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


//=============================================================================================================

import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { 
  doc, 
  setDoc, 
  collection, 
  serverTimestamp, 
  getDoc,
  updateDoc,
  getDocs,
  query,
  where 
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// ✅ Timestamp format karne ka helper function
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  
  try {
    // Agar timestamp Firestore ka object hai
    if (timestamp.seconds && timestamp.nanoseconds !== undefined) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Agar string ya normal date hai
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    // Agar Date object hai
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    
    return "N/A";
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid Date";
  }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [existingCompany, setExistingCompany] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onBlur" });

  const [step, setStep] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [editingUserIndex, setEditingUserIndex] = useState(null);

  // Load user data and check for existing company
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(userData);

    if (userData && !userData.isSiteAdmin) {
      loadExistingCompany(userData.cid);
      loadExistingUsers(userData.cid);
    }
  }, []);

  const loadExistingCompany = async (companyId) => {
    try {
      const companyDoc = await getDoc(doc(db, "companies", companyId));
      if (companyDoc.exists()) {
        const companyData = companyDoc.data();
        setExistingCompany(companyData);
        setIsEditMode(true);
        
        // Pre-fill form with existing data
        setValue("companyName", companyData.companyName);
        setValue("companyDescription", companyData.companyDescription);
        setValue("companyOwner", companyData.companyOwner);
        
        // toast.info("📝 Company data loaded. You can update your company information.");
      }
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const loadExistingUsers = async (companyId) => {
    try {
      const usersQuery = query(
        collection(db, "users"), 
        where("cid", "==", companyId)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = [];
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({ 
          id: doc.id, 
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          role: userData.role,
          department: userData.department,
          // ✅ Timestamp ko properly format karo
          createdAt: formatTimestamp(userData.createdAt) || 
                    formatTimestamp(userData.createdAtClient) ||
                    "N/A"
        });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users data");
    }
  };

  // Loader Component
  const ProfessionalLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#101828] rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {isEditMode ? "Updating Company" : "Creating Company & Users"}
          </h3>
          <p className="text-gray-400 text-center mb-4">
            {isEditMode 
              ? "Please wait while we update your company information..." 
              : "Please wait while we set up your company and user accounts..."
            }
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
        !watch("companyOwner"))
    ) {
      toast.error("Please fill all company info fields before proceeding.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const hasAdminUser = () => users.some((u) => u.role?.toLowerCase() === "admin");

  // Main form submit - now handles both create and update
  const onSubmit = async (data) => {
    if (!isEditMode && !hasAdminUser()) {
      toast.error("❌ At least one user must have the 'admin' role!");
      return;
    }
    
    if (!isEditMode && users.length === 0) {
      toast.error("❌ Please add at least one user!");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(10);

    try {
      if (isEditMode) {
        // ✅ UPDATE EXISTING COMPANY
        setSubmissionProgress(50);
        
        const companyRef = doc(db, "companies", currentUser.cid);
        await updateDoc(companyRef, {
          companyName: data.companyName,
          companyDescription: data.companyDescription,
          companyOwner: data.companyOwner,
          updatedAt: serverTimestamp(),
        });

        // ✅ UPDATE USERS IF IN EDIT MODE
        setSubmissionProgress(70);
        
        const totalUsers = users.length;
        let completed = 0;

        await Promise.all(
          users.map(async (user) => {
            if (user.id) {
              // Existing user - update
              const userRef = doc(db, "users", user.id);
              await updateDoc(userRef, {
                name: user.name,
                email: user.email,
                contact: user.contact,
                role: user.role,
                department: user.department,
                updatedAt: serverTimestamp(),
              });
            }

            completed++;
            const progress = 70 + (completed / totalUsers) * 25;
            setSubmissionProgress(Math.min(progress, 95));
          })
        );

        setSubmissionProgress(100);
        
        toast.success("✅ Company & Users Updated Successfully!", {
          autoClose: 2000,
          position: "top-center",
        });

        setTimeout(() => {
          setIsSubmitting(false);
          setSubmissionProgress(0);
          navigate("/admin/allusers");
        }, 1500);

      } else {
        // ✅ CREATE NEW COMPANY (Original functionality)
        setSubmissionProgress(25);
        const companyRef = doc(collection(db, "companies"));
        await setDoc(companyRef, {
          companyName: data.companyName,
          companyDescription: data.companyDescription,
          companyOwner: data.companyOwner,
          createdAt: serverTimestamp(),
        });

        setSubmissionProgress(40);

        // Create Users
        const totalUsers = users.length;
        let completed = 0;

        await Promise.all(
          users.map(async (user) => {
            const userRef = doc(collection(db, "users"));
            const userData = {
              uid: userRef.id,
              name: user.name,
              email: user.email,
              password: user.password,
              contact: user.contact,
              role: user.role,
              department: user.department,
              status: "inactive",
              cid: companyRef.id,
              createdAtClient: new Date().toLocaleDateString(), // ✅ String format mein save karo
              createdAt: serverTimestamp(),
            };
            if (user.role?.toLowerCase() === "admin") {
              userData.timer = 300000;
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
          setUsers([]);
          setStep(1);
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(`Failed to save: ${err.message}`);
      setIsSubmitting(false);
      setSubmissionProgress(0);
    }
  };

  // Add user into state (only for new company creation)
  const addUser = (data) => {
    if (data.userPasswordOnboard !== data.userConfirmPasswordOnboard) {
      toast.error("Passwords do not match!");
      return;
    }
    if (data.userPasswordOnboard.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    if (users.some((u) => u.email?.toLowerCase() === data.userEmailOnboard?.toLowerCase())) {
      toast.error("User with this email already exists!");
      return;
    }
    const newUser = {
      name: data.userNameOnboard?.trim(),
      email: data.userEmailOnboard?.toLowerCase()?.trim(),
      password: data.userPasswordOnboard,
      contact: data.userContactOnboard?.trim(),
      role: data.userRoleOnboard?.trim(),
      department: data.userDepartmentOnboard?.trim(),
      createdAt: new Date().toLocaleDateString(), // ✅ String format mein save karo
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
    if (u.role?.toLowerCase() === "admin" && users.filter((x) => x.role?.toLowerCase() === "admin").length === 1) {
      toast.error("❌ Cannot delete the only admin user!");
      return;
    }
    setUsers(users.filter((_, idx) => idx !== i));
    toast.info("User deleted");
  };

  // Handle row click to make it editable
  const handleRowClick = (index) => {
    setEditingUserIndex(index);
  };

  // Handle input change for editable fields
  const handleUserFieldChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [field]: value
    };
    setUsers(updatedUsers);
  };

  // Save the edited user
  const saveUserEdit = (index) => {
    setEditingUserIndex(null);
    toast.success("✅ User updated successfully!");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingUserIndex(null);
    // Reload original data if needed
    if (isEditMode) {
      loadExistingUsers(currentUser.cid);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2939] p-6">
      {isSubmitting && <ProfessionalLoader />}

      <div className="w-full max-w-7xl bg-[#101828] border border-gray-200 rounded-2xl shadow-xl p-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-white text-center">
            {isEditMode ? "Company Profile" : "Onboarding"}
          </h2>
          {isEditMode && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Edit Mode
            </div>
          )}
        </div>

        {currentUser && !currentUser.isSiteAdmin && existingCompany && (
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-center">
              📊 Viewing and editing company: <strong>{existingCompany.companyName}</strong>
            </p>
          </div>
        )}

        <div className="flex justify-center gap-6 mb-10">
          <div className={`w-5 h-5 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-300"}`} />
          <div className={`w-5 h-5 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-300"}`} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
          {/* Step 1 - Company Information */}
          {step === 1 && (
            <div className="space-y-6 flex flex-col items-center">
              {/* COMPANY LOGO INPUT REMOVED */}

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Name</label>
                <input 
                  type="text" 
                  {...register("companyName", { required: "Company Name is required" })} 
                  className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" 
                />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Owner</label>
                <input 
                  type="text" 
                  {...register("companyOwner", { required: "Company Owner is required" })} 
                  className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" 
                />
                {errors.companyOwner && <p className="text-red-500 text-sm">{errors.companyOwner.message}</p>}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 text-white">Company Description</label>
                <textarea 
                  {...register("companyDescription", { required: "Description is required" })} 
                  className="w-full p-3 border rounded-lg bg-[#1E2939] text-white" 
                />
                {errors.companyDescription && <p className="text-red-500 text-sm">{errors.companyDescription.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2 - Users Management */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Company Users {!isEditMode && hasAdminUser() && "✅"}
                </h3>
                
                {!isEditMode && (
                  <button 
                    type="button" 
                    onClick={() => setShowUserForm(!showUserForm)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    {showUserForm ? "Cancel" : "Add User"}
                  </button>
                )}
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
                    {users.length > 0 ? (
                      users.map((u, i) => (
                        <tr 
                          key={i} 
                          className={`text-white bg-[#1E2939] hover:bg-gray-700 ${editingUserIndex === i ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => !isEditMode && handleRowClick(i)}
                        >
                          <td className="px-6 py-4">
                            {editingUserIndex === i ? (
                              <input
                                type="text"
                                value={u.name || ""}
                                onChange={(e) => handleUserFieldChange(i, 'name', e.target.value)}
                                className="w-full p-2 border rounded bg-[#2D3748] text-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              u.name || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingUserIndex === i ? (
                              <input
                                type="email"
                                value={u.email || ""}
                                onChange={(e) => handleUserFieldChange(i, 'email', e.target.value)}
                                className="w-full p-2 border rounded bg-[#2D3748] text-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              u.email || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingUserIndex === i ? (
                              <input
                                type="text"
                                value={u.contact || ""}
                                onChange={(e) => handleUserFieldChange(i, 'contact', e.target.value)}
                                className="w-full p-2 border rounded bg-[#2D3748] text-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              u.contact || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingUserIndex === i ? (
                              <select
                                value={u.role || ""}
                                onChange={(e) => handleUserFieldChange(i, 'role', e.target.value)}
                                className="w-full p-2 border rounded bg-[#2D3748] text-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                              </select>
                            ) : (
                              u.role || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingUserIndex === i ? (
                              <input
                                type="text"
                                value={u.department || ""}
                                onChange={(e) => handleUserFieldChange(i, 'department', e.target.value)}
                                className="w-full p-2 border rounded bg-[#2D3748] text-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              u.department || "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4">{u.createdAt || "N/A"}</td>
                          <td className="px-6 py-4 flex gap-2">
                            {editingUserIndex === i ? (
                              <>
                                <button 
                                  type="button"
                                  className="text-green-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveUserEdit(i);
                                  }}
                                >
                                  ✅
                                </button>
                                <button 
                                  type="button"
                                  className="text-red-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEdit();
                                  }}
                                >
                                  ❌
                                </button>
                              </>
                            ) : (
                              <>
                                <span 
                                  className="text-blue-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(i);
                                  }}
                                >
                                  ✏️
                                </span>
                                <span 
                                  className="text-red-500 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteUser(i);
                                  }}
                                >
                                  ✖
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-white">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {showUserForm && !isEditMode && (
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
              <button 
                type="submit" 
                disabled={(isEditMode ? false : users.length === 0 || !hasAdminUser()) || isSubmitting} 
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isSubmitting 
                  ? "Processing..." 
                  : !isEditMode && !hasAdminUser() 
                    ? "Add Admin User" 
                    : isEditMode 
                      ? "Update Company & Users" 
                      : "Submit"
                }
              </button>
            )}
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}