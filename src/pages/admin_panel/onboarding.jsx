







import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { db, auth } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

  // ✅ Next Step Function
  const nextStep = () => {
    if (
      step === 1 &&
      (!watch("companyName") || !watch("companyDescription") || 
       !watch("companyOwner") || !logoFile)
    ) {
      toast.error("Please fill all company info fields before proceeding.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ✅ Check if at least one user has admin role
  const hasAdminUser = () => {
    return users.some(user => user.role.toLowerCase() === "admin");
  };

  // ✅ Calculate 5 minutes timer in milliseconds
  const getFiveMinuteTimer = () => {
    const fiveMinutesInMilliseconds = 5 * 60 * 1000;
    const futureTimestamp = new Date().getTime() + fiveMinutesInMilliseconds;
    return futureTimestamp;
  };

  // ✅ IMPROVED: Final Submit with better error handling
  const onSubmit = async (data) => {
    if (!hasAdminUser()) {
      toast.error("❌ At least one user must have the 'admin' role!", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    if (users.length === 0) {
      toast.error("❌ Please add at least one user!");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Create company first
      const companyRef = await addDoc(collection(db, "companies"), {
        companyName: data.companyName,
        companyDescription: data.companyDescription,
        companyOwner: data.companyOwner,
        logoName: logoFile ? logoFile.name : null,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Company created with ID:", companyRef.id);

      // ✅ Create users one by one with better error handling
      const userCreationPromises = users.map(async (user, index) => {
        try {
          console.log(`Creating user ${index + 1}:`, user.email);
          
          // ✅ Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            user.email,
            user.password
          );
          
          const uid = userCredential.user.uid;
          console.log(`✅ Firebase Auth user created: ${user.email} (UID: ${uid})`);

          // ✅ Prepare user data for Firestore
          const userData = {
            uid,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role,
            department: user.department,
            status: "inactive",
            cid: companyRef.id,
            createdAt: serverTimestamp(),
          };

          // ✅ Add timer for admin users
          if (user.role.toLowerCase() === "admin") {
            userData.timerExpiry = getFiveMinuteTimer();
            userData.timerDuration = 300000;
          }

          // ✅ Save user to Firestore
          await addDoc(collection(db, "users"), userData);
          console.log(`✅ User saved to Firestore: ${user.email}`);
          
          return { success: true, email: user.email };
          
        } catch (userErr) {
          console.error(`❌ Error creating user ${user.email}:`, userErr);
          return { 
            success: false, 
            email: user.email, 
            error: userErr.message 
          };
        }
      });

      // ✅ Wait for all user creations to complete
      const results = await Promise.all(userCreationPromises);
      
      // ✅ Check results
      const failedCreations = results.filter(result => !result.success);
      
      if (failedCreations.length > 0) {
        const errorMessages = failedCreations.map(f => `${f.email}: ${f.error}`).join(', ');
        toast.error(`Some users failed to create: ${errorMessages}`);
        return;
      }

      // ✅ SUCCESS
      toast.success("✅ Company & Users Registered Successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // ✅ Redirect after successful creation
      setTimeout(() => {
        navigate("/admin/allusers");
      }, 3000);

      // ✅ Reset form
      reset();
      setLogoFile(null);
      setUsers([]);
      setStep(1);
      
    } catch (err) {
      console.error("Main submission error:", err);
      toast.error(`Failed to save data: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ IMPROVED: Add User function
  const addUser = (userData) => {
    // ✅ Validate passwords match
    if (userData.userPasswordOnboard !== userData.userConfirmPasswordOnboard) {
      toast.error("Passwords do not match!");
      return;
    }

    // ✅ Validate password strength
    if (userData.userPasswordOnboard.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    // ✅ Check for duplicate email
    const emailExists = users.some(user => 
      user.email.toLowerCase() === userData.userEmailOnboard.toLowerCase()
    );
    if (emailExists) {
      toast.error("User with this email already exists!");
      return;
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.userEmailOnboard)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    const newUser = {
      name: userData.userNameOnboard.trim(),
      email: userData.userEmailOnboard.toLowerCase().trim(),
      password: userData.userPasswordOnboard,
      contact: userData.userContactOnboard.trim(),
      role: userData.userRoleOnboard.trim(),
      department: userData.userDepartmentOnboard.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    
    setUsers([...users, newUser]);
    toast.success("✅ User added successfully!");

    // ✅ Reset form fields
    setShowUserForm(false);
    [
      "userNameOnboard",
      "userEmailOnboard",
      "userPasswordOnboard",
      "userConfirmPasswordOnboard",
      "userContactOnboard",
      "userRoleOnboard",
      "userDepartmentOnboard",
    ].forEach((field) => setValue(field, ""));
  };

  // ✅ Delete User function
  const deleteUser = (index) => {
    const userToDelete = users[index];
    if (userToDelete.role.toLowerCase() === "admin") {
      const adminUsers = users.filter(user => user.role.toLowerCase() === "admin");
      if (adminUsers.length === 1) {
        toast.error("❌ Cannot delete the only admin user!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }

    setUsers(users.filter((_, i) => i !== index));
    toast.info("User deleted", { position: "top-center", autoClose: 2000 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2939] p-6">
      <div className="w-full max-w-7xl bg-[#101828] border border-gray-200 rounded-2xl shadow-xl p-12">
        <h2 className="text-4xl font-bold text-white text-center mb-10">
          Onboarding
        </h2>

        {/* Steps */}
        <div className="flex justify-center items-center gap-6 mb-10">
          <div
            className={`w-5 h-5 rounded-full ${
              step >= 1 ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <div
            className={`w-5 h-5 rounded-full ${
              step >= 2 ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Admin Requirement Notice */}
        {step === 2 && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm font-medium">
              ⚠️ <span className="font-bold">Important:</span> At least one user must have the "admin" role.
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          autoComplete="off"
        >
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6 flex flex-col items-center">
              <label className="flex items-center justify-between w-3/4 max-w-lg p-3 border rounded-lg cursor-pointer text-white bg-[#1E2939] hover:shadow-lg transition">
                <span>{logoFile ? logoFile.name : "Upload Company Logo"}</span>
                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition">
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

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 font-medium text-white">
                  Company Name
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  {...register("companyName", {
                    required: "Company Name is required",
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 font-medium text-white">
                  Company Owner
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  {...register("companyOwner", {
                    required: "Company Owner is required",
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
                />
                {errors.companyOwner && (
                  <p className="text-red-500 text-sm">
                    {errors.companyOwner.message}
                  </p>
                )}
              </div>

              <div className="w-3/4 max-w-lg">
                <label className="block mb-1 font-medium text-white">
                  Company Description
                </label>
                <textarea
                  autoComplete="off"
                  {...register("companyDescription", {
                    required: "Description is required",
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none hover:shadow-md text-white bg-[#1E2939]"
                />
                {errors.companyDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.companyDescription.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Users */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Company Users {hasAdminUser() && "✅"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUserForm(!showUserForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  {showUserForm ? "Cancel" : "Add User"}
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                  <thead className="text-white bg-[#1E2939]">
                    <tr>
                      <th className="px-6 py-3 border rounded-lg">Name</th>
                      <th className="px-6 py-3 border rounded-lg">Email</th>
                      <th className="px-6 py-3 border rounded-lg">Contact</th>
                      <th className="px-6 py-3 border rounded-lg">Role</th>
                      <th className="px-6 py-3 border rounded-lg">
                        Department
                      </th>
                      <th className="px-6 py-3 border rounded-lg">
                        Created At
                      </th>
                      <th className="px-6 py-3 border rounded-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={index}
                        className={`text-white bg-[#1E2939] shadow-md hover:bg-gray-700 transition rounded-lg ${
                          user.role.toLowerCase() === "admin" ? "border-l-4 border-l-green-500" : ""
                        }`}
                      >
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.contact}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded ${
                            user.role.toLowerCase() === "admin" 
                              ? "bg-green-600 text-white" 
                              : "bg-gray-600"
                          }`}>
                            {user.role}
                            {user.role.toLowerCase() === "admin" && (
                              <span className="text-xs ml-1">⏱️</span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.department}</td>
                        <td className="px-6 py-4">{user.createdAt}</td>
                        <td
                          className="px-6 py-4 text-red-500 cursor-pointer text-center"
                          onClick={() => deleteUser(index)}
                        >
                          ✖
                        </td>
                      </tr>
                    ))}

                    {showUserForm && (
                      <tr className="text-white bg-[#1E2939] rounded-lg shadow-inner">
                        <td className="px-2 py-1 border rounded-lg">
                          <input
                            type="text"
                            placeholder="Name"
                            autoComplete="new-name"
                            {...register("userNameOnboard", {
                              required: "Name is required",
                            })}
                            className="w-full p-3.5 bg-transparent"
                          />
                          {errors.userNameOnboard && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.userNameOnboard.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-1 border rounded-lg">
                          <input
                            type="email"
                            placeholder="Email"
                            autoComplete="new-email"
                            {...register("userEmailOnboard", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format"
                              }
                            })}
                            className="w-full p-3.5 bg-transparent"
                          />
                          {errors.userEmailOnboard && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.userEmailOnboard.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-1 border rounded-lg">
                          <input
                            type="text"
                            placeholder="Contact"
                            autoComplete="new-contact"
                            {...register("userContactOnboard", {
                              required: "Contact is required",
                            })}
                            className="w-full p-3.5 bg-transparent"
                          />
                          {errors.userContactOnboard && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.userContactOnboard.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-1 border rounded-lg">
                          <input
                            type="text"
                            placeholder="Role (e.g., admin)"
                            autoComplete="new-role"
                            {...register("userRoleOnboard", {
                              required: "Role is required",
                            })}
                            className="w-full p-3.5 bg-transparent"
                          />
                          {errors.userRoleOnboard && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.userRoleOnboard.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-1 border rounded-lg">
                          <input
                            type="text"
                            placeholder="Department"
                            autoComplete="new-department"
                            {...register("userDepartmentOnboard", {
                              required: "Department is required",
                            })}
                            className="w-full p-3.5 bg-transparent"
                          />
                          {errors.userDepartmentOnboard && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.userDepartmentOnboard.message}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-1 border rounded-lg text-gray-500 text-center">
                          Now
                        </td>
                        <td className="space-x-2 border rounded-lg text-center">
                          <button
                            type="button"
                            className="text-green-600 mr-3 cursor-pointer text-lg font-bold"
                            onClick={handleSubmit(addUser)}
                          >
                            ✔
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowUserForm(false)}
                            className="text-red-600 cursor-pointer text-lg font-bold"
                          >
                            ✖
                          </button>
                        </td>
                      </tr>
                    )}

                    {users.length === 0 && !showUserForm && (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-gray-500 italic"
                        >
                          No users added yet. Click "Add User" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Password fields for new user form */}
                {showUserForm && (
                  <div className="mt-4 p-4 bg-[#1E2939] rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-white text-sm">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="Password (min 6 characters)"
                          autoComplete="new-password"
                          {...register("userPasswordOnboard", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters"
                            }
                          })}
                          className="w-full p-3 border rounded-lg bg-transparent text-white"
                        />
                        {errors.userPasswordOnboard && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.userPasswordOnboard.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-1 text-white text-sm">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          autoComplete="new-password"
                          {...register("userConfirmPasswordOnboard", {
                            required: "Please confirm your password",
                          })}
                          className="w-full p-3 border rounded-lg bg-transparent text-white"
                        />
                        {errors.userConfirmPasswordOnboard && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.userConfirmPasswordOnboard.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            {step > 1 && (
              <button
                type="button"
                className="px-6 py-2 bg-gray-600 cursor-pointer text-white rounded-lg hover:bg-blue-500 transition"
                onClick={prevStep}
              >
                Back
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                className="ml-auto px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer text-white transition"
                onClick={nextStep}
              >
                Next
              </button>
            )}

            {step === 2 && (
              <button
                type="submit"
                disabled={users.length === 0 || !hasAdminUser() || isSubmitting}
                className={`ml-auto px-6 py-2 rounded-lg text-white transition ${
                  users.length === 0 || !hasAdminUser() || isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Creating..." : (!hasAdminUser() ? "Add Admin User" : "Submit")}
              </button>
            )}
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}