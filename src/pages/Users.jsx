import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Users = () => {
    const navigate = useNavigate()
  const [items, setItems] = useState([
    { id: 1, title: "Sunset", department: "Nature", password: "1234" },
    { id: 2, title: "Laptop", department: "Tech", password: "abcd" },
    { id: 3, title: "Mountains", department: "Travel", password: "xyz" },
  ]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // modal states
  const [modalType, setModalType] = useState(null); // "name" | "password" | null
  const [tempValue, setTempValue] = useState("");

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // handle update for localStorage user
  const handleUpdate = () => {
    if (!modalType) return;

    // get users and current user
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("No user is logged in!");
      return;
    }

    // update in users array
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email
        ? {
            ...u,
            name: modalType === "name" ? tempValue : u.name,
            userPass: modalType === "password" ? tempValue : u.userPass,
          }
        : u
    );

    // update in single logged-in user
    const updatedCurrentUser = updatedUsers.find(
      (u) => u.email === currentUser.email
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

    alert(`${modalType === "name" ? "Name" : "Password"} updated successfully!`);

    setModalType(null);
    setTempValue("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md p-4 border-r">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Images</h2>
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 mb-4 text-sm border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className={`p-2 rounded-md cursor-pointer transition ${
                selectedItem?.id === item.id
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* Top Controls */}
        <div className="flex justify-end space-x-3 mb-6">
          <button
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setModalType("name");
              setTempValue("");
            }}
          >
            Edit Name
          </button>
          <button
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            onClick={() => {
              setModalType("password");
              setTempValue("");
            }}
          >
            Edit Password
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => {
            navigate('/')
              alert("Logged out!");
            }}
          >
            Logout
          </button>
        </div>

        {/* Preview Section */}
        <div className="flex-1 border rounded-lg bg-white shadow p-6 flex items-center justify-center">
          {selectedItem ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedItem.title}
              </h3>
              <p className="text-gray-600 mt-2">
                Department: {selectedItem.department}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Password: {selectedItem.password}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              Preview User Detail e.g. name, department etc
            </p>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Edit {modalType === "name" ? "Name" : "Password"}
            </h2>
            <input
              type={modalType === "password" ? "password" : "text"}
              className="w-full px-3 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
