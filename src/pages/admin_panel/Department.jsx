import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

// Firestore
import {
  db,
} from "../../config/firebase.js";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const DepartmentsPage = ({ companyId: propCompanyId = null }) => {
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [editingUid, setEditingUid] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [actionOpen, setActionOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const resolvedCompanyId =
    propCompanyId || localStorage.getItem("companyId") || null;

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const colRef = collection(db, "departments");
        const q = resolvedCompanyId
          ? query(
              colRef,
              where("company_id", "==", resolvedCompanyId),
              orderBy("created_at")
            )
          : query(colRef, orderBy("created_at"));

        const snap = await getDocs(q);
        const items = snap.docs.map((d) => {
          const data = d.data() || {};
          return {
            uid: d.id,
            ...data,
            created_at_local: data.created_at
              ? new Date(data.created_at.seconds * 1000).toLocaleString()
              : null,
          };
        });
        setDepartments(items);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [propCompanyId, resolvedCompanyId]);

  // Start editing row inline
  const handleEdit = (dept) => {
    setEditingUid(dept.uid);
    setEditName(dept.name || "");
    setEditDesc(dept.description || "");
    setActionOpen(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUid(null);
    setEditName("");
    setEditDesc("");
    setActionOpen(null);
  };

  // Save editing
  const handleSave = async (uid) => {
    if (!editName.trim()) {
      alert("Department name is required");
      return;
    }
    
    try {
      setFormLoading(true);
      const docRef = doc(db, "departments", uid);
      await updateDoc(docRef, {
        name: editName,
        description: editDesc,
        updated_at: serverTimestamp(),
      });

      setDepartments((prev) =>
        prev.map((d) =>
          d.uid === uid
            ? {
                ...d,
                name: editName,
                description: editDesc,
                updated_at_local: new Date().toLocaleString(),
              }
            : d
        )
      );

      setEditingUid(null);
      setActionOpen(null);
    } catch (err) {
      console.error("Failed to update department:", err);
      alert("Update failed!");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete a department
  const handleDelete = async (uid) => {
    try {
      setFormLoading(true);
      await deleteDoc(doc(db, "departments", uid));
      setDepartments((prev) => prev.filter((d) => d.uid !== uid));
      if (editingUid === uid) handleCancelEdit();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete department:", err);
      alert("Delete failed!");
    } finally {
      setFormLoading(false);
    }
  };

  // Add new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      alert("Department name is required");
      return;
    }
    
    try {
      setFormLoading(true);
      const newDeptRef = doc(collection(db, "departments"));
      await setDoc(newDeptRef, {
        name: newDeptName,
        description: newDeptDesc,
        company_id: resolvedCompanyId,
        created_at: serverTimestamp(),
      });

      // Add to local state
      const newDept = {
        uid: newDeptRef.id,
        name: newDeptName,
        description: newDeptDesc,
        company_id: resolvedCompanyId,
        created_at_local: new Date().toLocaleString(),
      };
      
      setDepartments(prev => [...prev, newDept]);
      setNewDeptName("");
      setNewDeptDesc("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add department:", err);
      alert("Failed to add department!");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-h-screen overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                showForm 
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={() => setShowForm((s) => !s)}
              disabled={formLoading}
            >
              {showForm ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Department
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add Department Form */}
          {showForm && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Department</h2>
              <form onSubmit={handleAddDepartment}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department name"
                      disabled={formLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newDeptDesc}
                      onChange={(e) => setNewDeptDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter department description"
                      disabled={formLoading}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={formLoading}
                  >
                    {formLoading ? "Adding..." : "Add Department"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Departments</h2>
              <p className="mt-1 text-sm text-gray-500">
                A list of all departments in your company.
              </p>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Loading departments...</p>
              </div>
            ) : departments.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No departments</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowForm(true)}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Department
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((dept) => (
                      <tr key={dept.uid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUid === dept.uid ? (
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Department name"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {editingUid === dept.uid ? (
                            <input
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="w-full border border-gray-300 px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Department description"
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{dept.description || "—"}</div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dept.created_at_local ?? "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingUid === dept.uid ? (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleSave(dept.uid)}
                                disabled={formLoading}
                                className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                              >
                                {formLoading ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={formLoading}
                                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(dept)}
                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(dept.uid)}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Department</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete this department? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={formLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {formLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;