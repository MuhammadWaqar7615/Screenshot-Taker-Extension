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
// } from "firebase/firestore";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true); // global loader for fetching
//   const [saving, setSaving] = useState(false); // global loader for saving
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contact: "",
//     role: "",
//     department: "",
//     cid: "", // new field for company
//   });
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [deptFilter, setDeptFilter] = useState("");

//   // Real-time listener for users
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
//       const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setUsers(list);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch companies (one-time load)
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "companies"));
//         const list = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCompanies(list);
//       } catch (err) {
//         console.error("Error fetching companies:", err);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Unique roles and departments
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

//   // Handle form input changes
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Generate Firebase-style UID
//   const generateUID = () => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let uid = "";
//     for (let i = 0; i < 28; i++) {
//       uid += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return uid;
//   };

//   // Add new user
//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const uid = generateUID();
//       await setDoc(doc(db, "users", uid), {
//         ...formData,
//         uid,
//         status: "inactive",
//         createdAt: serverTimestamp(),
//       });
//       resetForm();
//     } catch (err) {
//       console.error("Error adding user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Start editing a user
//   const startEdit = (user) => {
//     setEditingUserId(user.id);
//     setFormData({ ...user });
//     setShowAddForm(false);
//   };

//   // Save edited user
//   const saveEdit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await updateDoc(doc(db, "users", editingUserId), formData);
//       resetForm();
//     } catch (err) {
//       console.error("Error updating user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       setSaving(true);
//       await deleteDoc(doc(db, "users", id));
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setEditingUserId(null);
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

//   // Filter users
//   const filteredUsers = users.filter(
//     (u) =>
//       (u.name?.toLowerCase().includes(search.toLowerCase()) ||
//         u.email?.toLowerCase().includes(search.toLowerCase())) &&
//       (roleFilter ? u.role === roleFilter : true) &&
//       (deptFilter ? u.department === deptFilter : true)
//   );

//   // Get company name from cid
//   const getCompanyName = (cid) => {
//     const company = companies.find((c) => c.cid === cid);
//     return company ? company.companyName : "N/A";
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">
//       {/* Global Loader Overlay */}
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
//         {/* Header */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
//           <h1 className="text-3xl font-bold text-white">All Users</h1>
//           <button
//             onClick={() => {
//               if (showAddForm) {
//                 resetForm(); // Cancel clears + closes
//               } else {
//                 setShowAddForm(true); // Add User opens
//               }
//             }}
//             className={`px-4 py-2 rounded-lg shadow transition-colors ${showAddForm
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-blue-600 hover:bg-blue-700"
//               }`}
//           >
//             {showAddForm ? "Cancel" : "➕ Add User"}
//           </button>
//         </div>

//         {/* Filters */}
//         {!showAddForm && !editingUserId && (
//           <div className="flex flex-wrap gap-4 mb-6">
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
//             />
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
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
//               className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
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

//         {/* Add/Edit Form */}
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
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleFormChange}
//               required
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//             />
//             {!editingUserId && (
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleFormChange}
//                 required
//                 className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//               />
//             )}
//             <input
//               type="text"
//               name="contact"
//               placeholder="Contact"
//               value={formData.contact}
//               onChange={handleFormChange}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               name="role"
//               placeholder="Role"
//               value={formData.role}
//               onChange={handleFormChange}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               name="department"
//               placeholder="Department"
//               value={formData.department}
//               onChange={handleFormChange}
//               className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//             />

//             {/* Company dropdown */}
//             {editingUserId ? (
//               <input
//                 type="text"
//                 value={getCompanyName(formData.cid)}
//                 readOnly
//                 className="border border-gray-600 p-2 rounded bg-gray-900 text-gray-400 cursor-not-allowed"
//               />
//             ) : (
//               <select
//                 name="cid"
//                 value={formData.cid}
//                 onChange={handleFormChange}
//                 required
//                 className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="">Select Company</option>
//                 {companies.map((c) => (
//                   <option key={c.cid} value={c.cid}>
//                     {c.companyName}
//                   </option>
//                 ))}
//               </select>
//             )}

//             <button
//               type="submit"
//               className="col-span-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               {editingUserId ? "✅ Save Changes" : "✅ Save User"}
//             </button>
//           </form>
//         )}

//         {/* Users Table */}
//         {!showAddForm && !editingUserId && (
//           <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
//             {filteredUsers.length === 0 ? (
//               <p className="p-4 text-gray-300">No users found.</p>
//             ) : (
//               <table className="min-w-full text-left border-collapse">
//                 <thead className="bg-gray-700 text-gray-200">
//                   <tr>
//                     <th className="p-3">Name</th>
//                     <th className="p-3">Email</th>
//                     <th className="p-3">Company</th>
//                     <th className="p-3">Department</th>
//                     <th className="p-3">Role</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Screenshots</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user, idx) => (
//                     <tr
//                       key={user.id}
//                       className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
//                         } hover:bg-gray-700 transition-colors`}
//                     >
//                       <td className="p-3 flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
//                           {user.name?.charAt(0) || "U"}
//                         </div>
//                         {user.name}
//                       </td>
//                       <td className="p-3">{user.email}</td>
//                       <td className="p-3">{getCompanyName(user.cid)}</td>
//                       <td className="p-3">{user.department}</td>
//                       <td className="p-3">{user.role}</td>
//                       <td className="p-3">
//                         <span
//                           className={`px-2 py-1 rounded-full ${user.status === "active"
//                               ? "bg-green-500 text-white text-sm"
//                               : "bg-red-500 text-white text-sm"
//                             }`}
//                         >
//                           {user.status}
//                         </span>
//                       </td>

//                       {/* Screenshots column */}
//                       <td className="p-3">
//                         <Link
//                           to={`/screenshots/${user.uid || user.id}`}
//                           className="text-blue-400 hover:underline"
//                         >
//                           View Screenshots
//                         </Link>
//                       </td>
//                       {console.log("uid", user.uid)}

//                       <td className="p-3 flex gap-2">
//                         <button
//                           onClick={() => startEdit(user)}
//                           className="text-blue-400 hover:text-blue-600 transition-colors"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           className="text-red-400 hover:text-red-600 transition-colors"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AllUsers;







import React, { useState, useEffect, useMemo } from "react";
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
  query,
  where,
} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "",
    department: "",
    cid: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  // Timer modal state
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  // Real-time listener for users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch companies (one-time load)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const list = querySnapshot.docs.map((docSnap) => ({
          cid: docSnap.id,
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCompanies(list);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Unique roles and departments
  const uniqueRoles = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.role?.trim()).filter(Boolean))
      ).sort(),
    [users]
  );

  const uniqueDepartments = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.department?.trim()).filter(Boolean))
      ).sort(),
    [users]
  );

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const usersCol = collection(db, "users");
      const newDocRef = doc(usersCol);
      const uid = newDocRef.id;

      const dataToSave = {
        ...formData,
        uid,
        status: "inactive",
        createdAt: serverTimestamp(),
      };

      if (formData.role?.toLowerCase() === "admin") {
        dataToSave.timer = 300000; // default 5 minutes
      }

      delete dataToSave.password;

      await setDoc(newDocRef, dataToSave);
      resetForm();
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Start editing a user
  const startEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({ ...user, password: "" });
    setShowAddForm(false);
  };

  // Save edited user
  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToUpdate = { ...formData };
      delete dataToUpdate.password;

      if (formData.role?.toLowerCase() === "admin") {
        dataToUpdate.timer = 300000;
      } else {
        dataToUpdate.timer = null;
      }

      await updateDoc(doc(db, "users", editingUserId), {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });

      resetForm();
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingUserId(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      contact: "",
      role: "",
      department: "",
      cid: "",
    });
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s)) &&
        (roleFilter ? u.role === roleFilter : true) &&
        (deptFilter ? u.department === deptFilter : true)
    );
  }, [users, search, roleFilter, deptFilter]);

  // Get company name
  const getCompanyName = (cid) => {
    if (!cid) return "N/A";
    const company = companies.find((c) => c.cid === cid || c.id === cid);
    return company?.companyName ?? "N/A";
  };

  // Handle Set Timer submit
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
      const companyUsers = users.filter((u) => u.cid === companyId);

      for (const u of companyUsers) {
        await updateDoc(doc(db, "users", u.id), { timer: totalMs });
      }

      setShowTimerModal(false);
      setSelectedAdmin("");
      setHours("");
      setMinutes("");
      setSeconds("");
    } catch (err) {
      console.error("Error setting timer:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">
      {/* Loader */}
      {(loading || saving) && (
        <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
          </div>
          <p className="mt-4 text-gray-200 text-lg font-semibold">
            {saving ? "Saving..." : "Loading..."}
          </p>
        </div>
      )}

      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">All Users</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTimerModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow"
            >
              ⏰ Set Timer
            </button>
            <button
              onClick={() => {
                if (showAddForm) resetForm();
                else setShowAddForm(true);
              }}
              className={`px-4 py-2 rounded-lg shadow transition-colors ${
                showAddForm
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {showAddForm ? "Cancel" : "➕ Add User"}
            </button>
          </div>
        </div>

        {/* Timer Modal */}
        {showTimerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <button
                onClick={() => setShowTimerModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4">Set Timer</h2>
              <form onSubmit={handleSetTimer} className="space-y-4">
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full border border-gray-600 rounded p-2 bg-gray-900 text-white"
                  required
                >
                  <option value="">Select Admin</option>
                  {users
                    .filter((u) => u.role?.toLowerCase() === "admin")
                    .map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({getCompanyName(admin.cid)})
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="HH"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="MM"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white"
                    min="0"
                    max="59"
                  />
                  <input
                    type="number"
                    placeholder="SS"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white"
                    min="0"
                    max="59"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg shadow"
                >
                  ✅ Save Timer
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        {!showAddForm && !editingUserId && (
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingUserId) && (
          <form
            onSubmit={editingUserId ? saveEdit : handleAddUser}
            className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
            />
            {!editingUserId && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleFormChange}
                required
                className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
              />
            )}
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
            />

            {editingUserId ? (
              <input
                type="text"
                value={getCompanyName(formData.cid)}
                readOnly
                className="border border-gray-600 p-2 rounded bg-gray-900 text-gray-400 cursor-not-allowed"
              />
            ) : (
              <select
                name="cid"
                value={formData.cid}
                onChange={handleFormChange}
                required
                className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.cid} value={c.cid}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              className="col-span-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingUserId ? "✅ Save Changes" : "✅ Save User"}
            </button>
          </form>
        )}

        {/* Users Table */}
        {!showAddForm && !editingUserId && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <p className="p-4 text-gray-300">No users found.</p>
            ) : (
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Screenshots</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                      } hover:bg-gray-700 transition-colors`}
                    >
                      <td className="p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        {user.name}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{getCompanyName(user.cid)}</td>
                      <td className="p-3">{user.department || "—"}</td>
                      <td className="p-3">{user.role || "—"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "active"
                              ? "bg-green-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {user.status || "inactive"}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/screenshots/${user.id}`}
                          className="text-blue-400 hover:underline"
                        >
                          View Screenshots
                        </Link>
                      </td>
                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-yellow-400 hover:text-yellow-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllUsers;

