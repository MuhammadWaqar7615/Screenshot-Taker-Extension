import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUser, FaBuilding, FaIdBadge, FaCircle } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

export default function RolesPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    department: "",
    status: "inactive",
    contact: ""
  });

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Start editing
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedData(user);
  };

  // Save update
  const handleSave = async (id) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { 
        ...editedData, 
        updatedAt: serverTimestamp() 
      });
      setUsers(
        users.map((u) => (u.id === id ? { ...u, ...editedData } : u))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingUser(null);
    setEditedData({});
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setUsers([...users, { id: docRef.id, ...newUser }]);
      setAddingUser(false);
      setNewUser({
        name: "",
        email: "",
        role: "",
        company: "",
        department: "",
        status: "inactive",
        contact: ""
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-500";
      case "inactive": return "text-red-500";
      case "pending": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "user": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#101828] flex">
      {/* Sidebar left */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 "> {/* Adjust based on your sidebar width */}
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-[#101828] p-4 shadow-sm ">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Roles</h1>
          </div>
          <button
            onClick={() => setAddingUser(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
          >
            <FaUser size={16} />
            Add Role
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg mx-6">
          <table className="min-w-full text-sm text-left text-white  bg-[#101828]">
            <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
              <tr>
                <th className="px-6 py-4 ">User</th>
                <th className="px-6 py-4 ">Role</th>
                <th className="px-6 py-4 ">Company</th>
                <th className="px-6 py-4 ">Department</th>
                <th className="px-6 py-4 ">Status</th>
                <th className="px-6 py-4 ">Created At</th>
                <th className="px-6 py-4 ">Actions</th>
              </tr>
            </thead>

            <tbody className=" ">
              {/* Add User Row */}
              {addingUser && (
                <tr className="bg-gray-600">
                  <td className="px-6 py-2 border border-gray-300">
                    <div className="flex items-center gap-3">
                      {/* <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        <FaUser size={16} />
                      </div> */}
                      <img
  src="https://firebasestorage.googleapis.com/v0/b/screenshots-73056.appspot.com/o/company-logos%2F1759340472638_IMG-20250506-WA0209.jpg?alt=media"
  alt="Company Logo"
  className="h-10 w-10 object-contain"
/>

                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </div>
                  </td>
                  
                  <td className="px-6 py-2 border border-gray-300">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option  className=" text-gray-800 bg-gray-200" value="">Select Role</option>
                      <option className=" text-gray-800 bg-gray-200" value="admin">Admin</option>
                      <option className=" text-gray-800 bg-gray-200" value="manager">Manager</option>
                      <option className=" text-gray-800 bg-gray-200" value="user">User</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Company"
                      value={newUser.company}
                      onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </td>
                  
                  <td className="px-6 py-4 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </td>
                  
                  <td className="px-6 py-4 border border-gray-300">
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option className="text-gray-800 bg-gray-200" value="active">Active</option>
                      <option className="text-gray-800 bg-gray-200" value="inactive">Inactive</option>
                      <option className="text-gray-800 bg-gray-200" value="pending">Pending</option>
                    </select>
                  </td>
                  
                  <td className="px-6 py-4 border border-gray-300">
                    <input
                      type="text"
                      placeholder="Contact"
                      value={newUser.contact}
                      onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </td>
                  
                  
                  
                  <td className="px-6 py-4 border border-gray-300">
                    <div className="flex gap-2">
                      <button
                        className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded"
                        onClick={handleAddUser}
                        title="Save"
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        className="text-gray-800 hover:text-gray-900 cursor-pointer p-2 rounded"
                        onClick={() => setAddingUser(false)}
                        title="Cancel"
                      >
                        <FaTimes size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* User Rows */}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 transition">
                  {/* User Column */}
                  <td className="px-6 py-2 ">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser size={16} />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">
                          {editingUser === user.id ? (
                            <input
                              type="text"
                              value={editedData.name || ""}
                              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            user.name || "N/A"
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email || "N/A"}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="px-6 py-4 ">
                    {editingUser === user.id ? (
                      <select
                        value={editedData.role || ""}
                        onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="admin">Admin</option>
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="manager">Manager</option>
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="user">User</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role || "N/A"}
                      </span>
                    )}
                  </td>

                  {/* Company Column */}
                  <td className="px-6 py-4 ">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editedData.company || ""}
                        onChange={(e) => setEditedData({ ...editedData, company: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-200" size={14} />
                        <span>{user.company || "N/A"}</span>
                      </div>
                    )}
                  </td>

                  {/* Department Column */}
                  <td className="px-6 py-4 ">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editedData.department || ""}
                        onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaIdBadge className="text-gray-200" size={14} />
                        <span>{user.department || "N/A"}</span>
                      </div>
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 ">
                    {editingUser === user.id ? (
                      <select
                        value={editedData.status || ""}
                        onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="active">Active</option>
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="inactive">Inactive</option>
                        <option className="text-gray-800 bg-gray-200 cursor-pointer" value="pending">Pending</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaCircle className={getStatusColor(user.status)} size={10} />
                        <span className="capitalize">{user.status || "inactive"}</span>
                      </div>
                    )}
                  </td>

                 

                  {/* Created At Column */}
                  <td className="px-6 py-4 ">
                    {user.createdAt?.toDate
                      ? user.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {editingUser === user.id ? (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800 cursor-pointer p-2 rounded hover:bg-gray-400"
                            onClick={() => handleSave(user.id)}
                            title="Save"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-800 cursor-pointer p-2 rounded hover:bg-gray-400"
                            onClick={handleCancel}
                            title="Cancel"
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded hover:bg-gray-400"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded hover:bg-gray-400"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && !addingUser && (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first user.</p>
            <button
              onClick={() => setAddingUser(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add First User
            </button>
          </div>
        )}
      </div>
    </div>
  );
}