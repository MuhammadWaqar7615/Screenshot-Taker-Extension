// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { db } from "../../config/firebase";
// import {
//   collection,
//   setDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   onSnapshot,
//   getDocs,
//   getDoc,
//   query,
//   where,
//   writeBatch,
// } from "firebase/firestore";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companiesLoaded, setCompaniesLoaded] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showTimerModal, setShowTimerModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact: "",
//     role: "",
//     department: "",
//     cid: "",
//   });
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [originalUserData, setOriginalUserData] = useState(null);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [deptFilter, setDeptFilter] = useState("");

//   const [selectedAdmin, setSelectedAdmin] = useState("");
//   const [hours, setHours] = useState("");
//   const [minutes, setMinutes] = useState("");
//   const [seconds, setSeconds] = useState("");

//   // Format timer (input expected in milliseconds)
//   const formatTimer = (ms) => {
//     if (!ms && ms !== 0) return "—";
//     const totalSeconds = Math.floor(ms / 1000);
//     const h = Math.floor(totalSeconds / 3600);
//     const m = Math.floor((totalSeconds % 3600) / 60);
//     const s = totalSeconds % 60;
//     // Always show HH:MM:SS for consistency (padStart ensures two digits)
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   // Delete user helper
//   const deleteUserById = async (userId) => {
//     try {
//       const screenshotsRef = collection(db, "screenshots");
//       const screenshotsQuery = query(
//         screenshotsRef,
//         where("user_id", "==", userId)
//       );
//       const screenshotsSnapshot = await getDocs(screenshotsQuery);

//       if (screenshotsSnapshot.size > 0) {
//         const batch = writeBatch(db);
//         screenshotsSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
//         await batch.commit();
//       }

//       await deleteDoc(doc(db, "users", userId));
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   // Load companies and users
//   useEffect(() => {
//   let unsubscribeUsers = () => {};
//   let unsubscribeCompanies = () => {};

//   try {
//     unsubscribeCompanies = onSnapshot(collection(db, "companies"), (companySnapshot) => {
//       const companyList = companySnapshot.docs.map((docSnap) => ({
//         cid: docSnap.id,
//         id: docSnap.id,
//         ...docSnap.data(),
//       }));
//       setCompanies(companyList);
//       const existingCompanyIds = new Set(companyList.map((c) => c.cid));

//       if (unsubscribeUsers) unsubscribeUsers();

//       unsubscribeUsers = onSnapshot(collection(db, "users"), async (snapshot) => {
//         const userList = snapshot.docs.map((docSnap) => ({
//           id: docSnap.id,
//           ...docSnap.data(),
//         }));

//         // ✅ Use the safe deletion check
//         if (companiesLoaded) {
//           const usersToDelete = userList.filter(
//             (u) => u.cid && !existingCompanyIds.has(u.cid)
//           );

//           if (usersToDelete.length > 0) {
//             for (const u of usersToDelete) {
//               await deleteUserById(u.id);
//               console.log(`Deleted user ${u.name || u.email} because company was removed`);
//             }
//           }
//         } else {
//           setCompaniesLoaded(true);
//         }

//         setUsers(userList.filter((u) => !u.cid || existingCompanyIds.has(u.cid)));
//         setLoading(false);
//       });
//     });
//   } catch (err) {
//     console.error("Error initializing data:", err);
//     setLoading(false);
//   }

//   return () => {
//     if (unsubscribeUsers) unsubscribeUsers();
//     if (unsubscribeCompanies) unsubscribeCompanies();
//   };
// }, [companiesLoaded]);


//   const uniqueRoles = useMemo(
//     () =>
//       Array.from(
//         new Set(users.map((u) => u.role?.trim()).filter(Boolean))
//       ).sort(),
//     [users]
//   );

//   const uniqueDepartments = useMemo(
//     () =>
//       Array.from(
//         new Set(users.map((u) => u.department?.trim()).filter(Boolean))
//       ).sort(),
//     [users]
//   );

//   const getCompanyTimer = async (cid) => {
//     try {
//       const companyDoc = await getDoc(doc(db, "companies", cid));
//       if (companyDoc.exists()) {
//         const companyData = companyDoc.data();
//         return companyData.timer || 300000;
//       }
//       return 300000;
//     } catch (err) {
//       console.error("Error fetching company timer:", err);
//       return 300000;
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const usersCol = collection(db, "users");
//       const newDocRef = doc(usersCol);
//       const uid = newDocRef.id;

//       const companyTimer = await getCompanyTimer(formData.cid);

//       const dataToSave = {
//         ...formData,
//         uid,
//         status: "inactive",
//         timer: companyTimer,
//         createdAt: serverTimestamp(),
//       };

//       await setDoc(newDocRef, dataToSave);
//       resetForm();
//     } catch (err) {
//       console.error("Error adding user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startEdit = (user) => {
//     setEditingUserId(user.id);
//     setOriginalUserData(user);
//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       password: user.password || "",
//       contact: user.contact || "",
//       role: user.role || "",
//       department: user.department || "",
//       cid: user.cid || "",
//     });
//     setShowAddForm(false);
//   };

//   const saveEdit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const companyTimer = await getCompanyTimer(formData.cid);

//       const dataToUpdate = {
//         ...formData,
//         timer: companyTimer,
//         updatedAt: serverTimestamp(),
//       };

//       await updateDoc(doc(db, "users", editingUserId), dataToUpdate);
//       resetForm();
//     } catch (err) {
//       console.error("Error updating user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteUserScreenshots = async (userId) => {
//     try {
//       const screenshotsRef = collection(db, "screenshots");
//       const screenshotsQuery = query(
//         screenshotsRef,
//         where("user_id", "==", userId)
//       );
//       const screenshotsSnapshot = await getDocs(screenshotsQuery);

//       if (screenshotsSnapshot.size > 0) {
//         const batch = writeBatch(db);
//         screenshotsSnapshot.forEach((screenshotDoc) =>
//           batch.delete(screenshotDoc.ref)
//         );
//         await batch.commit();
//       }
//       return screenshotsSnapshot.size;
//     } catch (error) {
//       console.error("Error deleting user screenshots:", error);
//       throw error;
//     }
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this user? This will also delete all their screenshots permanently."
//       )
//     )
//       return;

//     setSaving(true);
//     try {
//       const userToDelete = users.find((user) => user.id === id);
//       if (!userToDelete) throw new Error("User not found");

//       const deletedScreenshotsCount = await deleteUserScreenshots(
//         userToDelete.uid
//       );
//       await deleteDoc(doc(db, "users", id));

//       if (deletedScreenshotsCount > 0) {
//         alert(
//           `✅ User deleted successfully. ${deletedScreenshotsCount} screenshots were also deleted.`
//         );
//       } else {
//         alert("✅ User deleted successfully. No screenshots found to delete.");
//       }
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       alert("❌ Error deleting user: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetForm = () => {
//     setEditingUserId(null);
//     setOriginalUserData(null);
//     setShowAddForm(false);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       contact: "",
//       role: "",
//       department: "",
//       cid: "",
//     });
//   };

//   const filteredUsers = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return users.filter(
//       (u) =>
//         (u.name?.toLowerCase().includes(s) ||
//           u.email?.toLowerCase().includes(s)) &&
//         (roleFilter ? u.role === roleFilter : true) &&
//         (deptFilter ? u.department === deptFilter : true)
//     );
//   }, [users, search, roleFilter, deptFilter]);

//   const getCompanyName = (cid) => {
//     if (!cid) return "N/A";
//     const company = companies.find((c) => c.cid === cid || c.id === cid);
//     return company?.companyName ?? "N/A";
//   };

//   const handleSetTimer = async (e) => {
//     e.preventDefault();
//     if (!selectedAdmin) return alert("Please select an admin.");

//     const h = parseInt(hours || 0, 10);
//     const m = parseInt(minutes || 0, 10);
//     const s = parseInt(seconds || 0, 10);
//     const totalMs = (h * 3600 + m * 60 + s) * 1000;

//     if (totalMs <= 0) return alert("Please enter a valid duration.");

//     setSaving(true);
//     try {
//       const adminUser = users.find((u) => u.id === selectedAdmin);
//       if (!adminUser) throw new Error("Admin not found.");

//       const companyId = adminUser.cid;

//       const batch = writeBatch(db);

//       const companyRef = doc(db, "companies", companyId);
//       batch.update(companyRef, {
//         timer: totalMs,
//         timerUpdatedAt: serverTimestamp(),
//         timerUpdatedBy: adminUser.name || adminUser.email,
//       });

//       const usersQuery = query(collection(db, "users"), where("cid", "==", companyId));
//       const usersSnapshot = await getDocs(usersQuery);

//       usersSnapshot.forEach((userDoc) => {
//         const userRef = doc(db, "users", userDoc.id);
//         batch.update(userRef, { timer: totalMs });
//       });

//       await batch.commit();
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (err) {
//       console.error("Error setting timer:", err);
//       alert("❌ Error setting timer: " + err.message);
//     } finally {
//       setSaving(false);
//       setShowTimerModal(false);
//       setSelectedAdmin("");
//       setHours("");
//       setMinutes("");
//       setSeconds("");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">
//             {saving ? "Saving..." : "Loading..."}
//           </p>
//         </div>
//       )}

//       <Sidebar />

//       <main className="flex-1 p-6 overflow-auto">
//         {/* Top controls */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//           <h1 className="text-3xl font-bold text-white">All Users</h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowTimerModal(true)}
//               className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow cursor-pointer"
//               disabled={saving}
//             >
//               ⏰ Set Timer
//             </button>
//             <button
//               onClick={() => {
//                 if (showAddForm || editingUserId) resetForm();
//                 else setShowAddForm(true);
//               }}
//               className={`px-4 py-2 rounded-lg shadow transition-colors cursor-pointer ${
//                 showAddForm || editingUserId
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//               disabled={saving}
//             >
//               {showAddForm || editingUserId ? "Cancel" : "➕ Add User"}
//             </button>
//           </div>
//         </div>

//         {/* Timer Modal */}
//         {showTimerModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative">
//               <button
//                 onClick={() => !saving && setShowTimerModal(false)}
//                 disabled={saving}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 ✖
//               </button>
//               <h2 className="text-xl font-semibold mb-4">Set Company Timer</h2>
//               <p className="text-sm text-gray-400 mb-4">
//                 This will set the timer for ALL users (including admin) in the selected admin's company.
//               </p>
//               <form onSubmit={handleSetTimer} className="space-y-4">
//                 <select
//                   value={selectedAdmin}
//                   onChange={(e) => setSelectedAdmin(e.target.value)}
//                   className="w-full border border-gray-600 rounded p-2 bg-gray-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   required
//                   disabled={saving}
//                 >
//                   <option value="">Select Admin</option>
//                   {users
//                     .filter((u) => u.role?.toLowerCase() === "admin")
//                     .map((admin) => (
//                       <option key={admin.id} value={admin.id}>
//                         {admin.name} ({getCompanyName(admin.cid)})
//                       </option>
//                     ))}
//                 </select>

//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder="HH"
//                     value={hours}
//                     onChange={(e) => setHours(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     disabled={saving}
//                   />
//                   <input
//                     type="number"
//                     placeholder="MM"
//                     value={minutes}
//                     onChange={(e) => setMinutes(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     max="59"
//                     disabled={saving}
//                   />
//                   <input
//                     type="number"
//                     placeholder="SS"
//                     value={seconds}
//                     onChange={(e) => setSeconds(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     max="59"
//                     disabled={saving}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {saving ? "⏳ Setting Timer..." : "✅ Set Timer for ALL Users"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         {!showAddForm && !editingUserId && (
//           <div className="flex flex-wrap gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
//               disabled={saving}
//             />
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">All Roles</option>
//               {uniqueRoles.map((r) => (
//                 <option key={r} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={deptFilter}
//               onChange={(e) => setDeptFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">All Departments</option>
//               {uniqueDepartments.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Add/Edit form */}
//         {(showAddForm || editingUserId) && (
//           <form
//             onSubmit={editingUserId ? saveEdit : handleAddUser}
//             className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleFormChange}
//               required
//               maxLength={30}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//               disabled={saving}
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleFormChange}
//               maxLength={30}
//               required
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//               disabled={saving}
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleFormChange}
//                 required
//                 minLength={6}
//                 maxLength={30}
//                 className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 w-full disabled:opacity-50"
//                 disabled={saving}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-2 top-2 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
//                 disabled={saving}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>

//             <input
//               type="text"
//               name="role"
//               placeholder="Role"
//               value={formData.role}
//               onChange={handleFormChange}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//               disabled={saving}
//             />
//             <input
//               type="text"
//               name="department"
//               placeholder="Department"
//               value={formData.department}
//               onChange={handleFormChange}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//               disabled={saving}
//             />

//             <select
//               name="cid"
//               value={formData.cid}
//               onChange={handleFormChange}
//               required
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">Select Company</option>
//               {companies.map((c) => (
//                 <option key={c.cid} value={c.cid}>
//                   {c.companyName}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="submit"
//               disabled={saving}
//               className="col-span-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saving ? "⏳ Saving..." : editingUserId ? "✅ Save Changes" : "✅ Save User"}
//             </button>
//           </form>
//         )}

//         {/* TABLE (no horizontal scroll; cells truncate with tooltip; vertical scroll only) */}
//         <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//           {filteredUsers.length === 0 ? (
//             <p className="p-4 text-gray-300">No users found.</p>
//           ) : (
//             <div className="max-h-[70vh] overflow-y-auto">
//               <table className="w-full table-fixed border-collapse text-left">
//                 <thead className="bg-gray-700 text-gray-200">
//                   <tr>
//                     <th className="p-3 w-40 truncate whitespace-nowrap">Name</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Email</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Company</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Department</th>
//                     <th className="p-3 w-20 truncate whitespace-nowrap">Role</th>
//                     <th className="p-3 w-19 truncate whitespace-nowrap">Status</th>
//                     <th className="p-3 w-25 truncate whitespace-nowrap">Timer</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Screenshots</th>
//                     <th className="p-3 w-28 truncate whitespace-nowrap">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user, idx) => (
//                     <tr
//                       key={user.id}
//                       className={`${
//                         idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
//                       } hover:bg-gray-700 transition-colors`}
//                     >
//                       <td
//                         className="p-3 flex items-center gap-2 truncate whitespace-nowrap overflow-hidden"
//                         title={user.name || "N/A"}
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
//                           {user.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                         <span className="truncate">{user.name}</span>
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.email || "N/A"}
//                       >
//                         {user.email}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={getCompanyName(user.cid)}
//                       >
//                         {getCompanyName(user.cid)}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.department || "—"}
//                       >
//                         {user.department || "—"}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.role || "—"}
//                       >
//                         {user.role || "—"}
//                       </td>

//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             user.status === "active"
//                               ? "bg-green-600 text-white"
//                               : "bg-gray-600 text-white"
//                           }`}
//                         >
//                           {user.status || "inactive"}
//                         </span>
//                       </td>

//                       <td
//                         className="p-3 font-mono truncate whitespace-nowrap overflow-hidden"
//                         title={formatTimer(user.timer)}
//                       >
//                         {formatTimer(user.timer)}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title="View Screenshots"
//                       >
//                         <Link
//                           to={`/screenshots/${user.id}`}
//                           className="text-blue-400 hover:underline cursor-pointer"
//                         >
//                           View Screenshots
//                         </Link>
//                       </td>

//                       <td className="p-3 flex gap-3">
//                         <button
//                           onClick={() => startEdit(user)}
//                           className="text-yellow-400 hover:text-yellow-200 cursor-pointer disabled:opacity-50"
//                           disabled={saving}
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           className="text-red-500 hover:text-red-300 cursor-pointer disabled:opacity-50"
//                           disabled={saving}
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };
// export default AllUsers;


//===================================================================================================================

// //AllUsers.jsx:


// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Link } from "react-router-dom";
// import { db } from "../../config/firebase";
// import {
//   collection,
//   setDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
//   onSnapshot,
//   getDocs,
//   getDoc,
//   query,
//   where,
//   writeBatch,
// } from "firebase/firestore";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash, FaTimes, FaUser, FaChevronDown } from "react-icons/fa";

// // ------------------------------------------------------------------
// // NOTE: This version restricts visible users / company list to the
// // logged-in company when the current user is a Company Admin.
// // It expects `localStorage.getItem('user')` to contain an object with
// // at least: { cid: "<companyId>", isSiteAdmin: true|false }
// // ------------------------------------------------------------------

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companiesLoaded, setCompaniesLoaded] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false); // Changed from showAddForm
//   const [showTimerModal, setShowTimerModal] = useState(false);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact: "", // Added contact field
//     role: "",
//     department: "",
//     cid: "",
//     skills: [],
//     joiningDate: "", // Added joining date field
//     address: "", // Added address field
//     bloodGroup: "", // Added blood group field
//   });
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [originalUserData, setOriginalUserData] = useState(null);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [deptFilter, setDeptFilter] = useState("");
//   const [skillsFilter, setSkillsFilter] = useState("");

//   const [selectedAdmin, setSelectedAdmin] = useState("");
//   const [hours, setHours] = useState("");
//   const [minutes, setMinutes] = useState("");
//   const [seconds, setSeconds] = useState("");

//   // Skills dropdown state
//   const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
//   const [skillSearch, setSkillSearch] = useState("");
//   const skillsDropdownRef = useRef(null);

//   // Experience years for skills
//   const [skillExperiences, setSkillExperiences] = useState({});

//   // Predefined skills list
//   const predefinedSkills = [
//     "JavaScript",
//     "React",
//     "Node.js",
//     "Python",
//     "Java",
//     "HTML/CSS",
//     "SQL",
//     "Firebase",
//     "Git",
//     "TypeScript"
//   ];

//   // Blood group options
//   const bloodGroups = [
//     "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
//   ];

//   // Filter skills based on search
//   const filteredSkills = useMemo(() => {
//     return predefinedSkills.filter(skill =>
//       skill.toLowerCase().includes(skillSearch.toLowerCase())
//     );
//   }, [skillSearch]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) {
//         setShowSkillsDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // read current logged-in user from localStorage (safely)
//   const [currentUser] = useState(() => {
//     try {
//       const raw = localStorage.getItem("user");
//       return raw ? JSON.parse(raw) : null;
//     } catch (e) {
//       return null;
//     }
//   });

//   const isSiteAdmin = !!currentUser?.isSiteAdmin;
//   const currentCid = currentUser?.cid || null;

//   // Format timer (input expected in milliseconds)
//   const formatTimer = (ms) => {
//     if (!ms && ms !== 0) return "—";
//     const totalSeconds = Math.floor(ms / 1000);
//     const h = Math.floor(totalSeconds / 3600);
//     const m = Math.floor((totalSeconds % 3600) / 60);
//     const s = totalSeconds % 60;
//     return `${h.toString().padStart(2, "0")}:${m
//       .toString()
//       .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   // Format date
//   const formatDate = (timestamp) => {
//     if (!timestamp) return "—";
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (e) {
//       return "—";
//     }
//   };

//   // Format date for input (YYYY-MM-DD)
//   const formatDateForInput = (timestamp) => {
//     if (!timestamp) return "";
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return date.toISOString().split('T')[0];
//     } catch (e) {
//       return "";
//     }
//   };

//   // Helper function to get skill names from skill objects
//   const getSkillNames = (skills) => {
//     if (!skills || !Array.isArray(skills)) return [];
//     return skills.map(skill => 
//       typeof skill === 'object' ? skill.skill : skill
//     );
//   };

//   // Helper function to check if user has a specific skill
//   const userHasSkill = (user, skillToCheck) => {
//     if (!user.skills || !Array.isArray(user.skills)) return false;
//     return user.skills.some(skill => {
//       const skillName = typeof skill === 'object' ? skill.skill : skill;
//       return skillName === skillToCheck;
//     });
//   };

//   // Delete user helper (deletes screenshots then the user doc)
//   const deleteUserById = async (userId) => {
//     try {
//       const screenshotsRef = collection(db, "screenshots");
//       const screenshotsQuery = query(
//         screenshotsRef,
//         where("user_id", "==", userId)
//       );
//       const screenshotsSnapshot = await getDocs(screenshotsQuery);

//       if (screenshotsSnapshot.size > 0) {
//         const batch = writeBatch(db);
//         screenshotsSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
//         await batch.commit();
//       }

//       await deleteDoc(doc(db, "users", userId));
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   // Load companies and users. If logged-in user is a company admin,
//   // only load that company and only load users for that company.
//   useEffect(() => {
//     let unsubscribeUsers = () => {};
//     let unsubscribeCompanies = () => {};

//     try {
//       unsubscribeCompanies = onSnapshot(
//         collection(db, "companies"),
//         (companySnapshot) => {
//           let companyList = companySnapshot.docs.map((docSnap) => ({
//             cid: docSnap.id,
//             id: docSnap.id,
//             ...docSnap.data(),
//           }));

//           // If user is Company Admin, show only their company in the select
//           if (!isSiteAdmin && currentCid) {
//             companyList = companyList.filter((c) => c.cid === currentCid);
//           }

//           setCompanies(companyList);
//           const existingCompanyIds = new Set(companyList.map((c) => c.cid));

//           if (unsubscribeUsers) unsubscribeUsers();

//           unsubscribeUsers = onSnapshot(collection(db, "users"), async (snapshot) => {
//             let userList = snapshot.docs.map((docSnap) => ({
//               id: docSnap.id,
//               ...docSnap.data(),
//             }));

//             // If Company Admin => restrict users to the same company
//             if (!isSiteAdmin && currentCid) {
//               userList = userList.filter((u) => u.cid === currentCid);
//             } else {
//               // Site admin: keep the old safe-deletion logic
//               if (companiesLoaded) {
//                 const usersToDelete = userList.filter(
//                   (u) => u.cid && !existingCompanyIds.has(u.cid)
//                 );

//                 if (usersToDelete.length > 0) {
//                   for (const u of usersToDelete) {
//                     await deleteUserById(u.id);
//                     console.log(`Deleted user ${u.name || u.email} because company was removed`);
//                   }
//                 }
//               } else {
//                 setCompaniesLoaded(true);
//               }

//               userList = userList.filter((u) => !u.cid || existingCompanyIds.has(u.cid));
//             }

//             setUsers(userList);
//             setLoading(false);
//           });
//         }
//       );
//     } catch (err) {
//       console.error("Error initializing data:", err);
//       setLoading(false);
//     }

//     return () => {
//       if (unsubscribeUsers) unsubscribeUsers();
//       if (unsubscribeCompanies) unsubscribeCompanies();
//     };
//   }, [isSiteAdmin, currentCid, companiesLoaded]);

//   const uniqueRoles = useMemo(
//     () =>
//       Array.from(new Set(users.map((u) => u.role?.trim()).filter(Boolean))).sort(),
//     [users]
//   );

//   const uniqueDepartments = useMemo(
//     () =>
//       Array.from(new Set(users.map((u) => u.department?.trim()).filter(Boolean))).sort(),
//     [users]
//   );

//   const uniqueSkills = useMemo(
//     () =>
//       Array.from(
//         new Set(
//           users.flatMap((u) => getSkillNames(u.skills)).filter(Boolean)
//         )
//       ).sort(),
//     [users]
//   );

//   const getCompanyTimer = async (cid) => {
//     try {
//       const companyDoc = await getDoc(doc(db, "companies", cid));
//       if (companyDoc.exists()) {
//         const companyData = companyDoc.data();
//         return companyData.timer || 300000;
//       }
//       return 300000;
//     } catch (err) {
//       console.error("Error fetching company timer:", err);
//       return 300000;
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle skills selection with experience
//   const handleSkillSelect = (skill) => {
//     if (!formData.skills.includes(skill)) {
//       setFormData((prev) => ({
//         ...prev,
//         skills: [...prev.skills, skill]
//       }));
//       // Set default experience to 0 years for new skill
//       setSkillExperiences(prev => ({
//         ...prev,
//         [skill]: 0
//       }));
//     }
//     setSkillSearch("");
//     setShowSkillsDropdown(false);
//   };

//   // Remove skill
//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       skills: prev.skills.filter(skill => skill !== skillToRemove)
//     }));
//     // Remove experience data for the skill
//     setSkillExperiences(prev => {
//       const newExperiences = { ...prev };
//       delete newExperiences[skillToRemove];
//       return newExperiences;
//     });
//   };

//   // Handle experience year change
//   const handleExperienceChange = (skill, years) => {
//     setSkillExperiences(prev => ({
//       ...prev,
//       [skill]: parseInt(years) || 0
//     }));
//   };

//   // Handle skills input click
//   const handleSkillsInputClick = () => {
//     setShowSkillsDropdown(true);
//   };

//   // Ensure form has default cid for Company Admins
//   useEffect(() => {
//     if (!isSiteAdmin && currentCid) {
//       setFormData((prev) => ({ ...prev, cid: currentCid }));
//     }
//   }, [isSiteAdmin, currentCid]);

//   // Handle row click to show user details
//   const handleRowClick = (user) => {
//     setSelectedUser(user);
//     setShowUserModal(true);
//   };

//   // Close user modal
//   const closeUserModal = () => {
//     setShowUserModal(false);
//     setSelectedUser(null);
//   };

//   // Open add user modal
//   const openAddModal = () => {
//     resetForm();
//     setShowAddModal(true);
//   };

//   // Close add user modal
//   const closeAddModal = () => {
//     setShowAddModal(false);
//     resetForm();
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const usersCol = collection(db, "users");
//       const newDocRef = doc(usersCol);
//       const uid = newDocRef.id;

//       // if logged-in user is a Company Admin, force the user's cid to currentCid
//       const cidToSave = !isSiteAdmin && currentCid ? currentCid : formData.cid;

//       const companyTimer = await getCompanyTimer(cidToSave);

//       // Convert joining date to Firestore timestamp
//       const joiningDateTimestamp = formData.joiningDate ? 
//         new Date(formData.joiningDate) : null;

//       // Prepare skills with experiences
//       const skillsWithExperience = formData.skills.map(skill => ({
//         skill,
//         experience: skillExperiences[skill] || 0
//       }));

//       const dataToSave = {
//         ...formData,
//         cid: cidToSave,
//         uid,
//         status: "inactive",
//         timer: companyTimer,
//         createdAt: serverTimestamp(),
//         joiningDate: joiningDateTimestamp,
//         skills: skillsWithExperience, // Save skills with experience
//         address: formData.address,
//         bloodGroup: formData.bloodGroup,
//       };

//       await setDoc(newDocRef, dataToSave);
//       resetForm();
//       closeAddModal(); // Close modal after successful addition
//     } catch (err) {
//       console.error("Error adding user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const startEdit = (user, e) => {
//     e.stopPropagation(); // Prevent triggering row click
//     setEditingUserId(user.id);
//     setOriginalUserData(user);
    
//     // Initialize skill experiences from user data
//     const initialExperiences = {};
//     if (user.skills && Array.isArray(user.skills)) {
//       user.skills.forEach(skillItem => {
//         if (typeof skillItem === 'object' && skillItem.skill) {
//           initialExperiences[skillItem.skill] = skillItem.experience || 0;
//         } else {
//           initialExperiences[skillItem] = 0;
//         }
//       });
//     }
//     setSkillExperiences(initialExperiences);

//     // Extract just skill names for form data
//     const skillNames = user.skills ? user.skills.map(skillItem => 
//       typeof skillItem === 'object' ? skillItem.skill : skillItem
//     ) : [];

//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       password: user.password || "",
//       contact: user.contact || "",
//       role: user.role || "",
//       department: user.department || "",
//       cid: user.cid || (isSiteAdmin ? "" : currentCid),
//       skills: skillNames,
//       joiningDate: formatDateForInput(user.joiningDate) || "",
//       address: user.address || "",
//       bloodGroup: user.bloodGroup || "",
//     });
//     setShowAddModal(true); // Open modal for editing
//   };

//   const saveEdit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const cidToSave = !isSiteAdmin && currentCid ? currentCid : formData.cid;

//       const companyTimer = await getCompanyTimer(cidToSave);

//       // Convert joining date to Firestore timestamp
//       const joiningDateTimestamp = formData.joiningDate ? 
//         new Date(formData.joiningDate) : null;

//       // Prepare skills with experiences
//       const skillsWithExperience = formData.skills.map(skill => ({
//         skill,
//         experience: skillExperiences[skill] || 0
//       }));

//       const dataToUpdate = {
//         ...formData,
//         cid: cidToSave,
//         timer: companyTimer,
//         updatedAt: serverTimestamp(),
//         joiningDate: joiningDateTimestamp,
//         skills: skillsWithExperience, // Save skills with experience
//         address: formData.address,
//         bloodGroup: formData.bloodGroup,
//       };

//       await updateDoc(doc(db, "users", editingUserId), dataToUpdate);
//       resetForm();
//       closeAddModal(); // Close modal after successful update
//     } catch (err) {
//       console.error("Error updating user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteUserScreenshots = async (userId) => {
//     try {
//       const screenshotsRef = collection(db, "screenshots");
//       const screenshotsQuery = query(
//         screenshotsRef,
//         where("user_id", "==", userId)
//       );
//       const screenshotsSnapshot = await getDocs(screenshotsQuery);

//       if (screenshotsSnapshot.size > 0) {
//         const batch = writeBatch(db);
//         screenshotsSnapshot.forEach((screenshotDoc) =>
//           batch.delete(screenshotDoc.ref)
//         );
//         await batch.commit();
//       }
//       return screenshotsSnapshot.size;
//     } catch (error) {
//       console.error("Error deleting user screenshots:", error);
//       throw error;
//     }
//   };

//   const handleDelete = async (id, e) => {
//     e.stopPropagation(); // Prevent triggering row click
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this user? This will also delete all their screenshots permanently."
//       )
//     )
//       return;

//     setSaving(true);
//     try {
//       const userToDelete = users.find((user) => user.id === id);
//       if (!userToDelete) throw new Error("User not found");

//       const deletedScreenshotsCount = await deleteUserScreenshots(
//         userToDelete.uid
//       );
//       await deleteDoc(doc(db, "users", id));

//       if (deletedScreenshotsCount > 0) {
//         alert(
//           `✅ User deleted successfully. ${deletedScreenshotsCount} screenshots were also deleted.`
//         );
//       } else {
//         alert("✅ User deleted successfully. No screenshots found to delete.");
//       }
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       alert("❌ Error deleting user: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetForm = () => {
//     setEditingUserId(null);
//     setOriginalUserData(null);
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       contact: "",
//       role: "",
//       department: "",
//       cid: isSiteAdmin ? "" : currentCid || "",
//       skills: [],
//       joiningDate: "",
//       address: "",
//       bloodGroup: "",
//     });
//     setSkillExperiences({});
//     setShowSkillsDropdown(false);
//     setSkillSearch("");
//   };

//   const filteredUsers = useMemo(() => {
//     const s = search.trim().toLowerCase();
//     return users
//       .filter(
//         (u) =>
//           (u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)) &&
//           (roleFilter ? u.role === roleFilter : true) &&
//           (deptFilter ? u.department === deptFilter : true) &&
//           (skillsFilter ? userHasSkill(u, skillsFilter) : true) &&
//           (isSiteAdmin ? true : u.cid === currentCid)
//       );
//   }, [users, search, roleFilter, deptFilter, skillsFilter, isSiteAdmin, currentCid]);

//   const getCompanyName = (cid) => {
//     if (!cid) return "N/A";
//     const company = companies.find((c) => c.cid === cid || c.id === cid);
//     return company?.companyName ?? "N/A";
//   };

//   const handleSetTimer = async (e) => {
//     e.preventDefault();
//     if (!selectedAdmin) return alert("Please select an admin.");

//     const h = parseInt(hours || 0, 10);
//     const m = parseInt(minutes || 0, 10);
//     const s = parseInt(seconds || 0, 10);
//     const totalMs = (h * 3600 + m * 60 + s) * 1000;

//     if (totalMs <= 0) return alert("Please enter a valid duration.");

//     setSaving(true);
//     try {
//       const adminUser = users.find((u) => u.id === selectedAdmin);
//       if (!adminUser) throw new Error("Admin not found.");

//       const companyId = adminUser.cid;

//       const batch = writeBatch(db);

//       const companyRef = doc(db, "companies", companyId);
//       batch.update(companyRef, {
//         timer: totalMs,
//         timerUpdatedAt: serverTimestamp(),
//         timerUpdatedBy: adminUser.name || adminUser.email,
//       });

//       const usersQuery = query(collection(db, "users"), where("cid", "==", companyId));
//       const usersSnapshot = await getDocs(usersQuery);

//       usersSnapshot.forEach((userDoc) => {
//         const userRef = doc(db, "users", userDoc.id);
//         batch.update(userRef, { timer: totalMs });
//       });

//       await batch.commit();
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (err) {
//       console.error("Error setting timer:", err);
//       alert("❌ Error setting timer: " + err.message);
//     } finally {
//       setSaving(false);
//       setShowTimerModal(false);
//       setSelectedAdmin("");
//       setHours("");
//       setMinutes("");
//       setSeconds("");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">
//       {(loading || saving) && (
//         <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
//             <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
//           </div>
//           <p className="mt-4 text-gray-200 text-lg font-semibold">
//             {saving ? "Saving..." : "Loading..."}
//           </p>
//         </div>
//       )}

//       <Sidebar />

//       <main className="flex-1 p-6 overflow-auto">
//         {/* Top controls */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//           <h1 className="text-3xl font-bold text-white">All Users</h1>
          
//         </div>

//         {/* Timer Modal */}
//         {showTimerModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative">
//               <button
//                 onClick={() => !saving && setShowTimerModal(false)}
//                 disabled={saving}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 ✖
//               </button>
//               <h2 className="text-xl font-semibold mb-4">Set Company Timer</h2>
//               <p className="text-sm text-gray-400 mb-4">
//                 This will set the timer for ALL users (including admin) in the selected admin's company.
//               </p>
//               <form onSubmit={handleSetTimer} className="space-y-4">
//                 <select
//                   value={selectedAdmin}
//                   onChange={(e) => setSelectedAdmin(e.target.value)}
//                   className="w-full border border-gray-600 rounded p-2 bg-gray-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   required
//                   disabled={saving}
//                 >
//                   <option value="">Select Admin</option>
//                   {users
//                     .filter((u) => u.role?.toLowerCase() === "admin")
//                     .map((admin) => (
//                       <option key={admin.id} value={admin.id}>
//                         {admin.name} ({getCompanyName(admin.cid)})
//                       </option>
//                     ))}
//                 </select>

//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     placeholder="HH"
//                     value={hours}
//                     onChange={(e) => setHours(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     disabled={saving}
//                   />
//                   <input
//                     type="number"
//                     placeholder="MM"
//                     value={minutes}
//                     onChange={(e) => setMinutes(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     max="59"
//                     disabled={saving}
//                   />
//                   <input
//                     type="number"
//                     placeholder="SS"
//                     value={seconds}
//                     onChange={(e) => setSeconds(e.target.value)}
//                     className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
//                     min="0"
//                     max="59"
//                     disabled={saving}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {saving ? "⏳ Setting Timer..." : "✅ Set Timer for ALL Users"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Add User Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center  z-50">
//             <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-5xl h-[80vh] overflow-y-auto relative ">
//               <button
//                 onClick={closeAddModal}
//                 disabled={saving}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaTimes size={20} />
//               </button>
              
//               <h2 className="text-2xl font-bold text-white mb-6">
//                 {editingUserId ? "Edit User" : "Add New User"}
//               </h2>

//               <form
//                 onSubmit={editingUserId ? saveEdit : handleAddUser}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-4"
//               >
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="name"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     placeholder="Enter user name"
//                     value={formData.name}
//                     onChange={handleFormChange}
//                     required
//                     maxLength={30}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="email"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     placeholder="Enter user email"
//                     value={formData.email}
//                     onChange={handleFormChange}
//                     maxLength={30}
//                     required
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="flex flex-col relative">
//                   <label
//                     htmlFor="password"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="password"
//                       name="password"
//                       placeholder="Enter password"
//                       value={formData.password}
//                       onChange={handleFormChange}
//                       required
//                       minLength={6}
//                       maxLength={30}
//                       className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 w-full disabled:opacity-50"
//                       disabled={saving}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-2 top-2 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
//                       disabled={saving}
//                     >
//                       {showPassword ? "🙈" : "👁️"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Contact Field */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="contact"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Contact
//                   </label>
//                   <input
//                     type="text"
//                     id="contact"
//                     name="contact"
//                     placeholder="Enter contact number"
//                     value={formData.contact}
//                     onChange={handleFormChange}
//                     maxLength={15}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 {/* Address Field */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="address"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Address
//                   </label>
//                   <textarea
//                     id="address"
//                     name="address"
//                     placeholder="Enter user address"
//                     value={formData.address}
//                     onChange={handleFormChange}
//                     rows={3}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50 resize-vertical"
//                     disabled={saving}
//                   />
//                 </div>

//                 {/* Blood Group Field */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="bloodGroup"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Blood Group
//                   </label>
//                   <select
//                     id="bloodGroup"
//                     name="bloodGroup"
//                     value={formData.bloodGroup}
//                     onChange={handleFormChange}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50"
//                     disabled={saving}
//                   >
//                     <option value="">Select Blood Group</option>
//                     {bloodGroups.map(group => (
//                       <option key={group} value={group}>{group}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="role"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Role
//                   </label>
//                   <input
//                     type="text"
//                     id="role"
//                     name="role"
//                     placeholder="Enter user role"
//                     value={formData.role}
//                     onChange={handleFormChange}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="department"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Department
//                   </label>
//                   <input
//                     type="text"
//                     id="department"
//                     name="department"
//                     placeholder="Enter department"
//                     value={formData.department}
//                     onChange={handleFormChange}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 {/* Joining Date Field */}
//                 <div className="flex flex-col">
//                   <label
//                     htmlFor="joiningDate"
//                     className="text-sm text-gray-300 mb-1 font-semibold"
//                   >
//                     Joining Date
//                   </label>
//                   <input
//                     type="date"
//                     id="joiningDate"
//                     name="joiningDate"
//                     value={formData.joiningDate}
//                     onChange={handleFormChange}
//                     className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
//                     disabled={saving}
//                   />
//                 </div>

//                 {/* Skills dropdown - custom implementation */}
//                 <div className="md:col-span-2 relative" ref={skillsDropdownRef}>
//                   <label className="block text-sm text-gray-400 mb-1">Skills with Experience</label>
                  
//                   {/* Selected skills display with experience inputs */}
//                   <div className="space-y-2 mb-3">
//                     {formData.skills.map((skill, index) => (
//                       <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded">
//                         <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded flex items-center gap-1 flex-1">
//                           {skill}
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveSkill(skill)}
//                             className="text-xs hover:text-red-300 cursor-pointer ml-2"
//                             disabled={saving}
//                           >
//                             ×
//                           </button>
//                         </span>
//                         <div className="flex items-center gap-2">
//                           <label className="text-xs text-gray-400 whitespace-nowrap">Experience:</label>
//                           <input
//                             type="number"
//                             min="0"
//                             max="50"
//                             value={skillExperiences[skill] || 0}
//                             onChange={(e) => handleExperienceChange(skill, e.target.value)}
//                             className="w-16 border border-gray-600 p-1 rounded bg-gray-800 text-white text-sm"
//                             disabled={saving}
//                           />
//                           <span className="text-xs text-gray-400">years</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Skills input with dropdown */}
//                   <div className="relative">
//                     <div
//                       className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer flex items-center justify-between"
//                       onClick={handleSkillsInputClick}
//                     >
//                       <span className="text-gray-400">
//                         {formData.skills.length > 0 ? `Click to add more skills (${formData.skills.length} selected)` : "Click to select skills"}
//                       </span>
//                       <FaChevronDown className={`text-gray-400 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
//                     </div>

//                     {/* Dropdown menu */}
//                     {showSkillsDropdown && (
//                       <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded mt-1 z-10 max-h-90 overflow-y-auto">
//                         {/* Search input */}
//                         <div className="p-2 border-b border-gray-600">
//                           <input
//                             type="text"
//                             placeholder="Search skills..."
//                             value={skillSearch}
//                             onChange={(e) => setSkillSearch(e.target.value)}
//                             className="w-full p-2 bg-gray-900 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-400"
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </div>
                        
//                         {/* Skills list */}
//                         <div className="max-h-56 overflow-y-auto">
//                           {filteredSkills.length > 0 ? (
//                             filteredSkills.map((skill) => (
//                               <div
//                                 key={skill}
//                                 className={`p-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
//                                   formData.skills.includes(skill) ? 'bg-blue-900' : ''
//                                 }`}
//                                 onClick={() => handleSkillSelect(skill)}
//                               >
//                                 <span>{skill}</span>
//                                 {formData.skills.includes(skill) && (
//                                   <span className="text-green-400">✓</span>
//                                 )}
//                               </div>
//                             ))
//                           ) : (
//                             <div className="p-2 text-gray-400  text-center">
//                               No skills found
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Company select */}
//                 {isSiteAdmin ? (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm text-gray-400 mb-1">Company</label>
//                     <select
//                       name="cid"
//                       value={formData.cid}
//                       onChange={handleFormChange}
//                       required
//                       className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                       disabled={saving}
//                     >
//                       <option value="">Select Company</option>
//                       {companies.map((c) => (
//                         <option key={c.cid} value={c.cid}>
//                           {c.companyName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 ) : (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm text-gray-400 mb-1">Company</label>
//                     <select
//                       name="cid"
//                       value={formData.cid || currentCid}
//                       onChange={handleFormChange}
//                       required
//                       className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-not-allowed"
//                       disabled
//                     >
//                       <option value={currentCid}>{getCompanyName(currentCid)}</option>
//                     </select>
//                   </div>
//                 )}

//                 <div className="md:col-span-2 flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={closeAddModal}
//                     disabled={saving}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {saving ? "⏳ Saving..." : editingUserId ? "✅ Save Changes" : "✅ Add User"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className="flex relative gap-3">
//             <button
//               onClick={() => setShowTimerModal(true)}
//               className="px-4 py-2 absolute top-1 right-38 bg-purple-600 hover:bg-purple-700 rounded-lg shadow cursor-pointer"
//               disabled={saving}
//             >
//               ⏰ Set Timer
//             </button>
//             <button
//               onClick={openAddModal}
//               className="px-4 py-2 absolute top-1 right-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow cursor-pointer"
//               disabled={saving}
//             >
//               ➕ Add User
//             </button>
//           </div>

//         {/* User Detail Modal */}
//         {showUserModal && selectedUser && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
//               <button
//                 onClick={closeUserModal}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
//               >
//                 <FaTimes size={20} />
//               </button>
              
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
//                   {selectedUser.name?.charAt(0)?.toUpperCase() || <FaUser />}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">{selectedUser.name || "N/A"}</h2>
//                   <p className="text-gray-400">{selectedUser.email || "N/A"}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-blue-400 border-b border-gray-700 pb-2">
//                     Basic Information
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Full Name</label>
//                     <p className="text-white">{selectedUser.name || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Email</label>
//                     <p className="text-white">{selectedUser.email || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Contact</label>
//                     <p className="text-white">{selectedUser.contact || "—"}</p>
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-400">Blood Group</label>
//                     <p className="text-white">{selectedUser.bloodGroup || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">User ID</label>
//                     <p className="text-white font-mono text-sm">{selectedUser.uid || selectedUser.id || "—"}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-green-400 border-b border-gray-700 pb-2">
//                     Work Details
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Company</label>
//                     <p className="text-white">{getCompanyName(selectedUser.cid)}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Department</label>
//                     <p className="text-white">{selectedUser.department || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Role</label>
//                     <p className="text-white">{selectedUser.role || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Joining Date</label>
//                     <p className="text-white">{formatDate(selectedUser.joiningDate) || "—"}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Status</label>
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       selectedUser.status === "active" 
//                         ? "bg-green-600 text-white" 
//                         : "bg-gray-600 text-white"
//                     }`}>
//                       {selectedUser.status || "inactive"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-4 md:col-span-2">
//                   <h3 className="text-lg font-semibold text-yellow-400 border-b border-gray-700 pb-2">
//                     Skills & Experience
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Skills with Experience</label>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       {(selectedUser.skills && selectedUser.skills.length > 0) ? (
//                         selectedUser.skills.map((skillItem, index) => {
//                           const skill = typeof skillItem === 'object' ? skillItem.skill : skillItem;
//                           const experience = typeof skillItem === 'object' ? skillItem.experience : 0;
//                           return (
//                             <span 
//                               key={index} 
//                               className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1"
//                               title={`${experience} years experience`}
//                             >
//                               {skill}
//                               {experience > 0 && (
//                                 <span className="text-yellow-300 text-xs">({experience}y)</span>
//                               )}
//                             </span>
//                           );
//                         })
//                       ) : (
//                         <p className="text-gray-400">No skills added</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4 md:col-span-2">
//                   <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
//                     Personal Details
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Address</label>
//                     <p className="text-white whitespace-pre-wrap">{selectedUser.address || "—"}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
//                     Settings
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Screenshot Timer</label>
//                     <p className="text-white font-mono">{formatTimer(selectedUser.timer)}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Password</label>
//                     <p className="text-white">••••••••</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
//                     Timestamps
//                   </h3>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Created At</label>
//                     <p className="text-white text-sm">{formatDate(selectedUser.createdAt)}</p>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-400">Last Updated</label>
//                     <p className="text-white text-sm">{formatDate(selectedUser.updatedAt)}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end gap-3">
//                 <button
//                   onClick={(e) => {
//                     closeUserModal();
//                     startEdit(selectedUser, e);
//                   }}
//                   className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 cursor-pointer"
//                 >
//                   <FaEdit /> Edit User
//                 </button>
//                 <Link
//                   to={`/screenshots/${selectedUser.id}`}
//                   onClick={closeUserModal}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
//                 >
//                   View Screenshots
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         {!showAddModal && !editingUserId && (
//           <div className="flex flex-wrap gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
//               disabled={saving}
//             />
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">All Roles</option>
//               {uniqueRoles.map((r) => (
//                 <option key={r} value={r}>
//                   {r}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={deptFilter}
//               onChange={(e) => setDeptFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">All Departments</option>
//               {uniqueDepartments.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={skillsFilter}
//               onChange={(e) => setSkillsFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={saving}
//             >
//               <option value="">All Skills</option>
//               {uniqueSkills.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* TABLE */}
//         <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//           {filteredUsers.length === 0 ? (
//             <p className="p-4 text-gray-300">No users found.</p>
//           ) : (
//             <div className="max-h-[90vh] overflow-y-auto">
//               <table className="w-full table-fixed border-collapse text-left">
//                 <thead className="bg-gray-700 text-gray-200">
//                   <tr>
//                     <th className="p-3 w-40 truncate whitespace-nowrap">Name</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Email</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Company</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Department</th>
//                     <th className="p-3 w-20 truncate whitespace-nowrap">Role</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Skills</th>
//                     <th className="p-3 w-19 truncate whitespace-nowrap">Status</th>
//                     <th className="p-3 w-25 truncate whitespace-nowrap">Timer</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Joining Date</th>
//                     <th className="p-3 w-30 truncate whitespace-nowrap">Screenshots</th>
//                     <th className="p-3 w-28 truncate whitespace-nowrap">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user, idx) => (
//                     <tr
//                       key={user.id}
//                       className={`${
//                         idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
//                       } hover:bg-gray-700 transition-colors cursor-pointer`}
//                       onClick={() => handleRowClick(user)}
//                     >
//                       <td
//                         className="p-3 flex items-center gap-2 truncate whitespace-nowrap overflow-hidden"
//                         title={user.name || "N/A"}
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
//                           {user.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                         <span className="truncate">{user.name}</span>
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.email || "N/A"}
//                       >
//                         {user.email}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={getCompanyName(user.cid)}
//                       >
//                         {getCompanyName(user.cid)}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.department || "—"}
//                       >
//                         {user.department || "—"}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={user.role || "—"}
//                       >
//                         {user.role || "—"}
//                       </td>

//                       {/* Skills column */}
//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={(user.skills && user.skills.length > 0) ? 
//                           user.skills.map(skillItem => {
//                             const skill = typeof skillItem === 'object' ? skillItem.skill : skillItem;
//                             const exp = typeof skillItem === 'object' ? skillItem.experience : 0;
//                             return exp > 0 ? `${skill} (${exp}y)` : skill;
//                           }).join(", ") : "No skills"}
//                       >
//                         <div className="flex flex-wrap gap-1">
//                           {(user.skills && user.skills.length > 0) ? (
//                             user.skills.slice(0, 2).map((skillItem, index) => {
//                               const skill = typeof skillItem === 'object' ? skillItem.skill : skillItem;
//                               const exp = typeof skillItem === 'object' ? skillItem.experience : 0;
//                               return (
//                                 <span 
//                                   key={index} 
//                                   className="px-1 py-0.5 bg-blue-600 text-white text-xs rounded truncate max-w-20 flex items-center gap-1"
//                                 >
//                                   {skill}
//                                   {exp > 0 && <span className="text-yellow-300">({exp}y)</span>}
//                                 </span>
//                               );
//                             })
//                           ) : (
//                             <span className="text-gray-400 text-xs">—</span>
//                           )}
//                           {user.skills && user.skills.length > 2 && (
//                             <span className="text-gray-400 text-xs">
//                               +{user.skills.length - 2} more
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             user.status === "active"
//                               ? "bg-green-600 text-white"
//                               : "bg-gray-600 text-white"
//                           }`}
//                         >
//                           {user.status || "inactive"}
//                         </span>
//                       </td>

//                       <td
//                         className="p-3 font-mono truncate whitespace-nowrap overflow-hidden"
//                         title={formatTimer(user.timer)}
//                       >
//                         {formatTimer(user.timer)}
//                       </td>

//                       {/* Joining Date column */}
//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title={formatDate(user.joiningDate)}
//                       >
//                         {formatDate(user.joiningDate)}
//                       </td>

//                       <td
//                         className="p-3 truncate whitespace-nowrap overflow-hidden"
//                         title="View Screenshots"
//                       >
//                         <Link
//                           to={`/screenshots/${user.id}`}
//                           className="text-blue-400 hover:underline cursor-pointer"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           View Screenshots
//                         </Link>
//                       </td>

//                       <td className="p-3 flex gap-3">
//                         <button
//                           onClick={(e) => startEdit(user, e)}
//                           className="text-yellow-400 hover:text-yellow-200 cursor-pointer disabled:opacity-50"
//                           disabled={saving}
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={(e) => handleDelete(user.id, e)}
//                           className="text-red-500 hover:text-red-300 cursor-pointer disabled:opacity-50"
//                           disabled={saving}
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AllUsers;



// --------------------------------------------------------------------------------------------------


// AllUsers.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash, FaTimes, FaUser, FaChevronDown } from "react-icons/fa";

// Import components
import Header from "../../components/Header";
import TimerModal from "../../components/TimerModal";
import UserFormModal from "../../components/UserFormModal";
import UserDetailModal from "../../components/UserDetailModal";
import Filters from "../../components/Filters";
import UsersTable from "../../components/UsersTable";
import ActionButtons from "../../components/ActionButtons";
import LoadingOverlay from "../../components/LoadingOverlay";

// ------------------------------------------------------------------
// NOTE: This version restricts visible users / company list to the
// logged-in company when the current user is a Company Admin.
// It expects `localStorage.getItem('user')` to contain an object with
// at least: { cid: "<companyId>", isSiteAdmin: true|false }
// ------------------------------------------------------------------

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Changed from showAddForm
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "", // Added contact field
    role: "",
    department: "",
    cid: "",
    skills: [],
    joiningDate: "", // Added joining date field
    address: "", // Added address field
    bloodGroup: "", // Added blood group field
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  // Skills dropdown state
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const skillsDropdownRef = useRef(null);

  // Experience years for skills
  const [skillExperiences, setSkillExperiences] = useState({});

  // Predefined skills list
  const predefinedSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "HTML/CSS",
    "SQL",
    "Firebase",
    "Git",
    "TypeScript"
  ];

  // Blood group options
  const bloodGroups = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    return predefinedSkills.filter(skill =>
      skill.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [skillSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // read current logged-in user from localStorage (safely)
  const [currentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const isSiteAdmin = !!currentUser?.isSiteAdmin;
  const currentCid = currentUser?.cid || null;

  // Format timer (input expected in milliseconds)
  const formatTimer = (ms) => {
    if (!ms && ms !== 0) return "—";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "—";
    }
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return "";
    }
  };

  // Helper function to get skill names from skill objects
  const getSkillNames = (skills) => {
    if (!skills || !Array.isArray(skills)) return [];
    return skills.map(skill => 
      typeof skill === 'object' ? skill.skill : skill
    );
  };

  // Helper function to check if user has a specific skill
  const userHasSkill = (user, skillToCheck) => {
    if (!user.skills || !Array.isArray(user.skills)) return false;
    return user.skills.some(skill => {
      const skillName = typeof skill === 'object' ? skill.skill : skill;
      return skillName === skillToCheck;
    });
  };

  // Delete user helper (deletes screenshots then the user doc)
  const deleteUserById = async (userId) => {
    try {
      const screenshotsRef = collection(db, "screenshots");
      const screenshotsQuery = query(
        screenshotsRef,
        where("user_id", "==", userId)
      );
      const screenshotsSnapshot = await getDocs(screenshotsQuery);

      if (screenshotsSnapshot.size > 0) {
        const batch = writeBatch(db);
        screenshotsSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
        await batch.commit();
      }

      await deleteDoc(doc(db, "users", userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Load companies and users. If logged-in user is a company admin,
  // only load that company and only load users for that company.
  useEffect(() => {
    let unsubscribeUsers = () => {};
    let unsubscribeCompanies = () => {};

    try {
      unsubscribeCompanies = onSnapshot(
        collection(db, "companies"),
        (companySnapshot) => {
          let companyList = companySnapshot.docs.map((docSnap) => ({
            cid: docSnap.id,
            id: docSnap.id,
            ...docSnap.data(),
          }));

          // If user is Company Admin, show only their company in the select
          if (!isSiteAdmin && currentCid) {
            companyList = companyList.filter((c) => c.cid === currentCid);
          }

          setCompanies(companyList);
          const existingCompanyIds = new Set(companyList.map((c) => c.cid));

          if (unsubscribeUsers) unsubscribeUsers();

          unsubscribeUsers = onSnapshot(collection(db, "users"), async (snapshot) => {
            let userList = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));

            // If Company Admin => restrict users to the same company
            if (!isSiteAdmin && currentCid) {
              userList = userList.filter((u) => u.cid === currentCid);
            } else {
              // Site admin: keep the old safe-deletion logic
              if (companiesLoaded) {
                const usersToDelete = userList.filter(
                  (u) => u.cid && !existingCompanyIds.has(u.cid)
                );

                if (usersToDelete.length > 0) {
                  for (const u of usersToDelete) {
                    await deleteUserById(u.id);
                    console.log(`Deleted user ${u.name || u.email} because company was removed`);
                  }
                }
              } else {
                setCompaniesLoaded(true);
              }

              userList = userList.filter((u) => !u.cid || existingCompanyIds.has(u.cid));
            }

            setUsers(userList);
            setLoading(false);
          });
        }
      );
    } catch (err) {
      console.error("Error initializing data:", err);
      setLoading(false);
    }

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeCompanies) unsubscribeCompanies();
    };
  }, [isSiteAdmin, currentCid, companiesLoaded]);

  const uniqueRoles = useMemo(
    () =>
      Array.from(new Set(users.map((u) => u.role?.trim()).filter(Boolean))).sort(),
    [users]
  );

  const uniqueDepartments = useMemo(
    () =>
      Array.from(new Set(users.map((u) => u.department?.trim()).filter(Boolean))).sort(),
    [users]
  );

  const uniqueSkills = useMemo(
    () =>
      Array.from(
        new Set(
          users.flatMap((u) => getSkillNames(u.skills)).filter(Boolean)
        )
      ).sort(),
    [users]
  );

  const getCompanyTimer = async (cid) => {
    try {
      const companyDoc = await getDoc(doc(db, "companies", cid));
      if (companyDoc.exists()) {
        const companyData = companyDoc.data();
        return companyData.timer || 300000;
      }
      return 300000;
    } catch (err) {
      console.error("Error fetching company timer:", err);
      return 300000;
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skills selection with experience
  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      // Set default experience to 0 years for new skill
      setSkillExperiences(prev => ({
        ...prev,
        [skill]: 0
      }));
    }
    setSkillSearch("");
    setShowSkillsDropdown(false);
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    // Remove experience data for the skill
    setSkillExperiences(prev => {
      const newExperiences = { ...prev };
      delete newExperiences[skillToRemove];
      return newExperiences;
    });
  };

  // Handle experience year change
  const handleExperienceChange = (skill, years) => {
    setSkillExperiences(prev => ({
      ...prev,
      [skill]: parseInt(years) || 0
    }));
  };

  // Handle skills input click
  const handleSkillsInputClick = () => {
    setShowSkillsDropdown(true);
  };

  // Ensure form has default cid for Company Admins
  useEffect(() => {
    if (!isSiteAdmin && currentCid) {
      setFormData((prev) => ({ ...prev, cid: currentCid }));
    }
  }, [isSiteAdmin, currentCid]);

  // Handle row click to show user details
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Close user modal
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Open add user modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Close add user modal
  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const usersCol = collection(db, "users");
      const newDocRef = doc(usersCol);
      const uid = newDocRef.id;

      // if logged-in user is a Company Admin, force the user's cid to currentCid
      const cidToSave = !isSiteAdmin && currentCid ? currentCid : formData.cid;

      const companyTimer = await getCompanyTimer(cidToSave);

      // Convert joining date to Firestore timestamp
      const joiningDateTimestamp = formData.joiningDate ? 
        new Date(formData.joiningDate) : null;

      // Prepare skills with experiences
      const skillsWithExperience = formData.skills.map(skill => ({
        skill,
        experience: skillExperiences[skill] || 0
      }));

      const dataToSave = {
        ...formData,
        cid: cidToSave,
        uid,
        status: "inactive",
        timer: companyTimer,
        createdAt: serverTimestamp(),
        joiningDate: joiningDateTimestamp,
        skills: skillsWithExperience, // Save skills with experience
        address: formData.address,
        bloodGroup: formData.bloodGroup,
      };

      await setDoc(newDocRef, dataToSave);
      resetForm();
      closeAddModal(); // Close modal after successful addition
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user, e) => {
    e.stopPropagation(); // Prevent triggering row click
    setEditingUserId(user.id);
    setOriginalUserData(user);
    
    // Initialize skill experiences from user data
    const initialExperiences = {};
    if (user.skills && Array.isArray(user.skills)) {
      user.skills.forEach(skillItem => {
        if (typeof skillItem === 'object' && skillItem.skill) {
          initialExperiences[skillItem.skill] = skillItem.experience || 0;
        } else {
          initialExperiences[skillItem] = 0;
        }
      });
    }
    setSkillExperiences(initialExperiences);

    // Extract just skill names for form data
    const skillNames = user.skills ? user.skills.map(skillItem => 
      typeof skillItem === 'object' ? skillItem.skill : skillItem
    ) : [];

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      contact: user.contact || "",
      role: user.role || "",
      department: user.department || "",
      cid: user.cid || (isSiteAdmin ? "" : currentCid),
      skills: skillNames,
      joiningDate: formatDateForInput(user.joiningDate) || "",
      address: user.address || "",
      bloodGroup: user.bloodGroup || "",
    });
    setShowAddModal(true); // Open modal for editing
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cidToSave = !isSiteAdmin && currentCid ? currentCid : formData.cid;

      const companyTimer = await getCompanyTimer(cidToSave);

      // Convert joining date to Firestore timestamp
      const joiningDateTimestamp = formData.joiningDate ? 
        new Date(formData.joiningDate) : null;

      // Prepare skills with experiences
      const skillsWithExperience = formData.skills.map(skill => ({
        skill,
        experience: skillExperiences[skill] || 0
      }));

      const dataToUpdate = {
        ...formData,
        cid: cidToSave,
        timer: companyTimer,
        updatedAt: serverTimestamp(),
        joiningDate: joiningDateTimestamp,
        skills: skillsWithExperience, // Save skills with experience
        address: formData.address,
        bloodGroup: formData.bloodGroup,
      };

      await updateDoc(doc(db, "users", editingUserId), dataToUpdate);
      resetForm();
      closeAddModal(); // Close modal after successful update
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteUserScreenshots = async (userId) => {
    try {
      const screenshotsRef = collection(db, "screenshots");
      const screenshotsQuery = query(
        screenshotsRef,
        where("user_id", "==", userId)
      );
      const screenshotsSnapshot = await getDocs(screenshotsQuery);

      if (screenshotsSnapshot.size > 0) {
        const batch = writeBatch(db);
        screenshotsSnapshot.forEach((screenshotDoc) =>
          batch.delete(screenshotDoc.ref)
        );
        await batch.commit();
      }
      return screenshotsSnapshot.size;
    } catch (error) {
      console.error("Error deleting user screenshots:", error);
      throw error;
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent triggering row click
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This will also delete all their screenshots permanently."
      )
    )
      return;

    setSaving(true);
    try {
      const userToDelete = users.find((user) => user.id === id);
      if (!userToDelete) throw new Error("User not found");

      const deletedScreenshotsCount = await deleteUserScreenshots(
        userToDelete.uid
      );
      await deleteDoc(doc(db, "users", id));

      if (deletedScreenshotsCount > 0) {
        alert(
          `✅ User deleted successfully. ${deletedScreenshotsCount} screenshots were also deleted.`
        );
      } else {
        alert("✅ User deleted successfully. No screenshots found to delete.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("❌ Error deleting user: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingUserId(null);
    setOriginalUserData(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      contact: "",
      role: "",
      department: "",
      cid: isSiteAdmin ? "" : currentCid || "",
      skills: [],
      joiningDate: "",
      address: "",
      bloodGroup: "",
    });
    setSkillExperiences({});
    setShowSkillsDropdown(false);
    setSkillSearch("");
  };

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users
      .filter(
        (u) =>
          (u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)) &&
          (roleFilter ? u.role === roleFilter : true) &&
          (deptFilter ? u.department === deptFilter : true) &&
          (skillsFilter ? userHasSkill(u, skillsFilter) : true) &&
          (isSiteAdmin ? true : u.cid === currentCid)
      );
  }, [users, search, roleFilter, deptFilter, skillsFilter, isSiteAdmin, currentCid]);

  const getCompanyName = (cid) => {
    if (!cid) return "N/A";
    const company = companies.find((c) => c.cid === cid || c.id === cid);
    return company?.companyName ?? "N/A";
  };

  const handleSetTimer = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return alert("Please select an admin.");

    const h = parseInt(hours || 0, 10);
    const m = parseInt(minutes || 0, 10);
    const s = parseInt(seconds || 0, 10);
    const totalMs = (h * 3600 + m * 60 + s) * 1000;

    if (totalMs <= 0) return alert("Please enter a valid duration.");

    setSaving(true);
    try {
      const adminUser = users.find((u) => u.id === selectedAdmin);
      if (!adminUser) throw new Error("Admin not found.");

      const companyId = adminUser.cid;

      const batch = writeBatch(db);

      const companyRef = doc(db, "companies", companyId);
      batch.update(companyRef, {
        timer: totalMs,
        timerUpdatedAt: serverTimestamp(),
        timerUpdatedBy: adminUser.name || adminUser.email,
      });

      const usersQuery = query(collection(db, "users"), where("cid", "==", companyId));
      const usersSnapshot = await getDocs(usersQuery);

      usersSnapshot.forEach((userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        batch.update(userRef, { timer: totalMs });
      });

      await batch.commit();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Error setting timer:", err);
      alert("❌ Error setting timer: " + err.message);
    } finally {
      setSaving(false);
      setShowTimerModal(false);
      setSelectedAdmin("");
      setHours("");
      setMinutes("");
      setSeconds("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">
      <LoadingOverlay loading={loading} saving={saving} />

      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <Header />
        
        <ActionButtons 
          setShowTimerModal={setShowTimerModal}
          openAddModal={openAddModal}
          saving={saving}
        />

        <TimerModal
          showTimerModal={showTimerModal}
          setShowTimerModal={setShowTimerModal}
          saving={saving}
          selectedAdmin={selectedAdmin}
          setSelectedAdmin={setSelectedAdmin}
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
          handleSetTimer={handleSetTimer}
          users={users}
          getCompanyName={getCompanyName}
        />

        <UserFormModal
          showAddModal={showAddModal}
          closeAddModal={closeAddModal}
          saving={saving}
          editingUserId={editingUserId}
          formData={formData}
          handleFormChange={handleFormChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isSiteAdmin={isSiteAdmin}
          companies={companies}
          currentCid={currentCid}
          getCompanyName={getCompanyName}
          handleSkillsInputClick={handleSkillsInputClick}
          showSkillsDropdown={showSkillsDropdown}
          setShowSkillsDropdown={setShowSkillsDropdown}
          skillSearch={skillSearch}
          setSkillSearch={setSkillSearch}
          filteredSkills={filteredSkills}
          handleSkillSelect={handleSkillSelect}
          formDataSkills={formData.skills}
          handleRemoveSkill={handleRemoveSkill}
          skillExperiences={skillExperiences}
          handleExperienceChange={handleExperienceChange}
          handleAddUser={handleAddUser}
          saveEdit={saveEdit}
          bloodGroups={bloodGroups}
          skillsDropdownRef={skillsDropdownRef}
        />

        <UserDetailModal
          showUserModal={showUserModal}
          selectedUser={selectedUser}
          closeUserModal={closeUserModal}
          startEdit={startEdit}
          formatDate={formatDate}
          formatTimer={formatTimer}
          getCompanyName={getCompanyName}
        />

        <Filters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          skillsFilter={skillsFilter}
          setSkillsFilter={setSkillsFilter}
          uniqueRoles={uniqueRoles}
          uniqueDepartments={uniqueDepartments}
          uniqueSkills={uniqueSkills}
          saving={saving}
          showAddModal={showAddModal}
          editingUserId={editingUserId}
        />

        <UsersTable
          filteredUsers={filteredUsers}
          handleRowClick={handleRowClick}
          startEdit={startEdit}
          handleDelete={handleDelete}
          saving={saving}
          formatTimer={formatTimer}
          formatDate={formatDate}
          getCompanyName={getCompanyName}
        />
      </main>
    </div>
  );
};

export default AllUsers;