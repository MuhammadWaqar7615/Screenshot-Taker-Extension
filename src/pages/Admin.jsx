import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  // Initialize users directly from localStorage
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Sync users to localStorage whenever they change (real-time)
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Filter users by search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter(
      (user) => user.email !== selectedUser.email
    );

    setUsers(updatedUsers);
    setSelectedUser(null);
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-4 border-r">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Users</h2>
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 mb-4 text-sm border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-2">
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              className={`p-2 rounded-md cursor-pointer transition ${
                selectedUser?.email === user.email
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* Top Controls */}
        <div className="flex justify-end space-x-3 mb-6">
          <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            See Screenshots
          </button>
          <button
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            disabled={!selectedUser}
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Preview Section */}
        <div className="flex-1 border rounded-lg bg-white shadow p-6 flex items-center justify-center">
          {selectedUser ? (
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedUser.name}
              </h3>
              <p className="text-gray-600">Email: {selectedUser.email}</p>
              <p className="text-gray-600">
                Login Time: {selectedUser.loginTime || "Not logged in yet"}
              </p>
              <p className="text-gray-500 text-sm">
                Password: {selectedUser.userPass}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              Preview User Detail e.g. name, department etc
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
