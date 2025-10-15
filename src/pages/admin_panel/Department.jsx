// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/Sidebar";

// // Firestore
// import {
//   db,
// } from "../../config/firebase.js";
// import {
//   collection,
//   doc,
//   setDoc,
//   serverTimestamp,
//   updateDoc,
//   deleteDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
// } from "firebase/firestore";

// const DepartmentsPage = ({ companyId: propCompanyId = null }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [editingDid, setEditingDid] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [editDesc, setEditDesc] = useState("");
//   const [actionOpen, setActionOpen] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formLoading, setFormLoading] = useState(false);
//   const [newDeptName, setNewDeptName] = useState("");
//   const [newDeptDesc, setNewDeptDesc] = useState("");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

//   const resolvedCompanyId =
//     propCompanyId || localStorage.getItem("companyId") || null;

//   // Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         setLoading(true);
//         const colRef = collection(db, "departments");
//         const q = resolvedCompanyId
//           ? query(
//               colRef,
//               where("company_id", "==", resolvedCompanyId),
//               orderBy("created_at")
//             )
//           : query(colRef, orderBy("created_at"));

//         const snap = await getDocs(q);
//         const items = snap.docs.map((d) => {
//           const data = d.data() || {};
//           return {
//             did: d.id,
//             ...data,
//             created_at_local: data.created_at
//               ? new Date(data.created_at.seconds * 1000).toLocaleString()
//               : null,
//           };
//         });
//         setDepartments(items);
//       } catch (err) {
//         console.error("Failed to fetch departments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDepartments();
//   }, [propCompanyId, resolvedCompanyId]);

//   // Start editing row inline
//   const handleEdit = (dept) => {
//     setEditingDid(dept.did);
//     setEditName(dept.name || "");
//     setEditDesc(dept.description || "");
//     setActionOpen(null);
//   };

//   // Cancel editing
//   const handleCancelEdit = () => {
//     setEditingDid(null);
//     setEditName("");
//     setEditDesc("");
//     setActionOpen(null);
//   };

//   // Save editing
//   const handleSave = async (did) => {
//     if (!editName.trim()) {
//       alert("Department name is required");
//       return;
//     }
    
//     try {
//       setFormLoading(true);
//       const docRef = doc(db, "departments", did);
//       await updateDoc(docRef, {
//         name: editName,
//         description: editDesc,
//         updated_at: serverTimestamp(),
//       });

//       setDepartments((prev) =>
//         prev.map((d) =>
//           d.did === did
//             ? {
//                 ...d,
//                 name: editName,
//                 description: editDesc,
//                 updated_at_local: new Date().toLocaleString(),
//               }
//             : d
//         )
//       );

//       setEditingDid(null);
//       setActionOpen(null);
//     } catch (err) {
//       console.error("Failed to update department:", err);
//       alert("Update failed!");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Delete a department
//   const handleDelete = async (did) => {
//     try {
//       setFormLoading(true);
//       await deleteDoc(doc(db, "departments", did));
//       setDepartments((prev) => prev.filter((d) => d.did !== did));
//       if (editingDid === did) handleCancelEdit();
//       setShowDeleteConfirm(null);
//     } catch (err) {
//       console.error("Failed to delete department:", err);
//       alert("Delete failed!");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   // Add new department
//   const handleAddDepartment = async (e) => {
//     e.preventDefault();
//     if (!newDeptName.trim()) {
//       alert("Department name is required");
//       return;
//     }
    
//     try {
//       setFormLoading(true);
//       const newDeptRef = doc(collection(db, "departments"));
//       await setDoc(newDeptRef, {
//         name: newDeptName,
//         description: newDeptDesc,
//         company_id: resolvedCompanyId,
//         created_at: serverTimestamp(),
//       });

//       // Add to local state
//       const newDept = {
//         did: newDeptRef.id,
//         name: newDeptName,
//         description: newDeptDesc,
//         company_id: resolvedCompanyId,
//         created_at_local: new Date().toLocaleString(),
//       };
      
//       setDepartments(prev => [...prev, newDept]);
//       setNewDeptName("");
//       setNewDeptDesc("");
//       setShowForm(false);
//     } catch (err) {
//       console.error("Failed to add department:", err);
//       alert("Failed to add department!");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 min-h-screen overflow-hidden">
//         <header className="bg-white shadow-sm border-b">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
//             <button
//               className={`px-4 py-2 rounded-md font-medium ${
//                 showForm 
//                   ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//               onClick={() => setShowForm((s) => !s)}
//               disabled={formLoading}
//             >
//               {showForm ? (
//                 <span className="flex items-center">
//                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Close
//                 </span>
//               ) : (
//                 <span className="flex items-center">
//                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Add Department
//                 </span>
//               )}
//             </button>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Add Department Form */}
//           {showForm && (
//             <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Department</h2>
//               <form onSubmit={handleAddDepartment}>
//                 <div className="grid grid-cols-1 gap-4 mb-4">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                       Department Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       value={newDeptName}
//                       onChange={(e) => setNewDeptName(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter department name"
//                       disabled={formLoading}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <textarea
//                       id="description"
//                       value={newDeptDesc}
//                       onChange={(e) => setNewDeptDesc(e.target.value)}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Enter department description"
//                       disabled={formLoading}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     disabled={formLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     disabled={formLoading}
//                   >
//                     {formLoading ? "Adding..." : "Add Department"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Departments List */}
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-900">Departments</h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 A list of all departments in your company.
//               </p>
//             </div>
            
//             {loading ? (
//               <div className="p-12 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                 <p className="mt-2 text-gray-500">Loading departments...</p>
//               </div>
//             ) : departments.length === 0 ? (
//               <div className="p-12 text-center">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
//                 <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
//                 <div className="mt-6">
//                   <button
//                     type="button"
//                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     onClick={() => setShowForm(true)}
//                   >
//                     <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     New Department
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {departments.map((dept) => (
//                       <tr key={dept.did} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {editingDid === dept.did ? (
//                             <input
//                               value={editName}
//                               onChange={(e) => setEditName(e.target.value)}
//                               className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                               placeholder="Department name"
//                             />
//                           ) : (
//                             <div className="text-sm font-medium text-gray-900">{dept.name}</div>
//                           )}
//                         </td>

//                         <td className="px-6 py-4">
//                           {editingDid === dept.did ? (
//                             <input
//                               value={editDesc}
//                               onChange={(e) => setEditDesc(e.target.value)}
//                               className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                               placeholder="Department description"
//                             />
//                           ) : (
//                             <div className="text-sm text-gray-500">{dept.description || "—"}</div>
//                           )}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {dept.created_at_local ?? "—"}
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           {editingDid === dept.did ? (
//                             <div className="flex items-center justify-end space-x-2">
//                               <button
//                                 onClick={() => handleSave(dept.did)}
//                                 disabled={formLoading}
//                                 className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
//                               >
//                                 {formLoading ? "Saving..." : "Save"}
//                               </button>
//                               <button
//                                 onClick={handleCancelEdit}
//                                 disabled={formLoading}
//                                 className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-end space-x-2">
//                               <button
//                                 onClick={() => handleEdit(dept)}
//                                 className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => setShowDeleteConfirm(dept.did)}
//                                 className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Department</h3>
//               <p className="text-gray-500 mb-4">
//                 Are you sure you want to delete this department? This action cannot be undone.
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   disabled={formLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(showDeleteConfirm)}
//                   disabled={formLoading}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   {formLoading ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DepartmentsPage;



//=================================================================================================


//Department

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import Sidebar from "../../components/Sidebar";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheck,
  FaTimes,
  FaBuilding,
  FaUserTie,
  FaCrown,
} from "react-icons/fa";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingDept, setAddingDept] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    hod: "",
    companyName: "",
    cid: "",
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
  const companyId = loggedInUser?.cid;
  const userRole = loggedInUser?.role;

  const isSiteAdmin = userRole === "Site Admin" || loggedInUser?.isSiteAdmin;
  const isCompanyAdmin = userRole === "Company Admin" || userRole === "admin";

  // ✅ Current company name
  const getCurrentCompanyName = () => {
    if (isSiteAdmin) return "Site Admin";
    const companyData = JSON.parse(localStorage.getItem("company") || "{}");
    return companyData?.name || loggedInUser?.companyName || "My Company";
  };

  const currentCompanyName = getCurrentCompanyName();
  const currentCompanyId = isSiteAdmin ? null : companyId;

  // ✅ Global departments
  const globalDepartments = [
    { id: "global-1", name: "Human Resources", hod: "HR Director", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-2", name: "Finance", hod: "Finance Head", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-3", name: "IT", hod: "IT Manager", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-4", name: "Marketing", hod: "Marketing Head", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-5", name: "Sales", hod: "Sales Director", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-6", name: "Operations", hod: "Operations Manager", permanent: true, createdAt: new Date("2023-01-01") },
    { id: "global-7", name: "Administration", hod: "Admin Head", permanent: true, createdAt: new Date("2023-01-01") },
  ];

  // ✅ Fetch companies for Site Admin
  useEffect(() => {
    const fetchCompanies = async () => {
      if (isSiteAdmin) {
        try {
          const companiesRef = collection(db, "companies");
          const snapshot = await getDocs(companiesRef);
          const companyList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCompanies(companyList);
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      }
    };
    fetchCompanies();
  }, [isSiteAdmin]);

  // ✅ Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        let deptList = [];
        const deptRef = collection(db, "departments");

        if (isSiteAdmin) {
          const snapshot = await getDocs(deptRef);
          deptList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else if (currentCompanyId) {
          const q = query(deptRef, where("cid", "==", currentCompanyId));
          const snapshot = await getDocs(q);
          deptList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setDepartments(deptList);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, [currentCompanyId, isSiteAdmin]);

  // ✅ Handle company selection
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
    setNewDept({
      ...newDept,
      cid: selectedCompanyId,
      companyName: selectedCompany
        ? selectedCompany.name || selectedCompany.companyName || "Unnamed Company"
        : "",
    });
  };

  // ✅ Add new department
  const handleAddDept = async () => {
    if (newDept.name.trim() === "" || newDept.hod.trim() === "") {
      alert("Please fill department name and HOD!");
      return;
    }

    let finalCompanyId, finalCompanyName;
    if (isSiteAdmin) {
      if (!newDept.cid || !newDept.companyName) {
        alert("Please select a company!");
        return;
      }
      finalCompanyId = newDept.cid;
      finalCompanyName = newDept.companyName;
    } else {
      finalCompanyId = currentCompanyId;
      finalCompanyName = currentCompanyName;
    }

    try {
      setSaving(true);
      const departmentData = {
        name: newDept.name.trim(),
        hod: newDept.hod.trim(),
        companyName: finalCompanyName,
        cid: finalCompanyId,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "departments"), departmentData);
      const newDepartment = {
        id: docRef.id,
        ...departmentData,
        createdAt: new Date(),
      };

      setDepartments([...departments, newDepartment]);
      setAddingDept(false);
      setNewDept({ name: "", hod: "", companyName: "", cid: "" });
    } catch (error) {
      console.error("Error adding department:", error);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete department
  const handleDelete = async (id, permanent) => {
    if (permanent) return alert("Global departments cannot be deleted.");
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        setSaving(true);
        await deleteDoc(doc(db, "departments", id));
        setDepartments(departments.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting department:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  // ✅ Edit department
  const handleEdit = (dept) => {
    if (dept.permanent) return;
    setEditingId(dept.id);
    setEditedData({ name: dept.name, hod: dept.hod });
  };

  const handleSave = async (id) => {
    try {
      setSaving(true);
      const deptRef = doc(db, "departments", id);
      await updateDoc(deptRef, {
        name: editedData.name,
        hod: editedData.hod,
        updatedAt: serverTimestamp(),
      });
      setDepartments(
        departments.map((d) => (d.id === id ? { ...d, ...editedData } : d))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleCancelAdd = () => {
    setAddingDept(false);
    setNewDept({ name: "", hod: "", companyName: "", cid: "" });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.toDate) return date.toDate().toLocaleDateString();
    if (date instanceof Date) return date.toLocaleDateString();
    return "N/A";
  };

  const allDepartments = [...globalDepartments, ...departments];
  const totalDepartments = allDepartments.length;
  const userAddedDepartments = departments.length;

  return (
    <div className="min-h-screen bg-[#101828] flex relative">
      <Sidebar />

      {/* ✅ Loader Overlay */}
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

      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              Departments
              {isSiteAdmin && (
                <span className="flex items-center gap-1 text-sm bg-purple-600 px-2 py-1 rounded-md ml-2">
                  <FaCrown size={12} /> Site Admin
                </span>
              )}
              {isCompanyAdmin && !isSiteAdmin && (
                <span className="flex items-center gap-1 text-sm bg-green-600 px-2 py-1 rounded-md ml-2">
                  <FaUserTie size={12} /> Company Admin
                </span>
              )}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {isSiteAdmin
                ? `Viewing ALL departments (${totalDepartments} total: ${userAddedDepartments} user-added + ${globalDepartments.length} global)`
                : `Viewing company departments (${userAddedDepartments} total)`}
            </p>
          </div>
          <button
            onClick={() => setAddingDept(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus size={16} /> Add Department
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg mx-6">
          <table className="min-w-full text-sm text-left text-white bg-[#101828]">
            <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                {isSiteAdmin && <th className="px-6 py-4">Company Name</th>}
                <th className="px-6 py-4">HOD</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Add New */}
              {addingDept && (
                <tr className="bg-gray-600">
                  <td className="px-6 py-3 border border-gray-700">
                    <input
                      type="text"
                      placeholder="Department Name"
                      value={newDept.name}
                      onChange={(e) =>
                        setNewDept({ ...newDept, name: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
                    />
                  </td>

                  {isSiteAdmin && (
                    <td className="px-6 py-3 border border-gray-700">
                      <select
                        value={newDept.cid}
                        onChange={handleCompanyChange}
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.length > 0 ? (
                          companies.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name || c.companyName || "Unnamed Company"}
                            </option>
                          ))
                        ) : (
                          <option disabled>No companies available</option>
                        )}
                      </select>
                    </td>
                  )}

                  <td className="px-6 py-3 border border-gray-700">
                    <input
                      type="text"
                      placeholder="Head of Department"
                      value={newDept.hod}
                      onChange={(e) =>
                        setNewDept({ ...newDept, hod: e.target.value })
                      }
                      className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
                    />
                  </td>

                  <td className="px-6 py-3 border border-gray-700 text-gray-400">
                    Auto-generated
                  </td>

                  <td className="px-6 py-3 border border-gray-700">
                    <div className="flex gap-2">
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={handleAddDept}
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleCancelAdd}
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Department Rows */}
              {!loading &&
                allDepartments.map((dept) => (
                  <tr
                    key={dept.id}
                    className={`hover:bg-gray-700 transition ${
                      dept.permanent ? "bg-gray-800" : ""
                    }`}
                  >
                    <td className="px-6 py-3 font-medium">
                      {editingId === dept.id ? (
                        <input
                          type="text"
                          value={editedData.name || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
                        />
                      ) : (
                        dept.name
                      )}
                    </td>

                    {isSiteAdmin && (
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-blue-400" size={14} />
                          <span>
                            {dept.companyName || "N/A"}
                            {dept.permanent && " (Global)"}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-3">
                      {editingId === dept.id ? (
                        <input
                          type="text"
                          value={editedData.hod || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              hod: e.target.value,
                            })
                          }
                          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-blue-400" size={14} />
                          <span>{dept.hod || "N/A"}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-3 text-gray-300">
                      {formatDate(dept.createdAt)}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {editingId === dept.id ? (
                          <>
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleSave(dept.id)}
                            >
                              <FaCheck size={16} />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={handleCancel}
                            >
                              <FaTimes size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            {!dept.permanent && (
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => handleEdit(dept)}
                              >
                                <FaEdit size={16} />
                              </button>
                            )}
                            {!dept.permanent && (
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDelete(dept.id, dept.permanent)
                                }
                              >
                                <FaTrash size={16} />
                              </button>
                            )}
                            {dept.permanent && (
                              <span className="text-gray-400 italic text-xs">
                                Global
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Departments;