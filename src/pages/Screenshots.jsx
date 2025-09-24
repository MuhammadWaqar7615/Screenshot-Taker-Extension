// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";


// const Screenshots = () => {
//   const navigate = useNavigate()
//   const [items, setItems] = useState([
//     { id: 1, title: "Screenshot date/time", department: "image" },
//     { id: 2, title: "Screenshot date/time", department: "image" },
//     { id: 3, title: "Screenshot date/time", department: "image" },
//   ]);
//   const [search, setSearch] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);

//   // modal states
//   const [modalType, setModalType] = useState(null); // "name" | "password" | null
//   const [tempValue, setTempValue] = useState("");

//   const filteredItems = items.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   // handle update for localStorage user
//   const handleUpdate = () => {
//     if (!modalType) return;

//     // get users and current user
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const currentUser = JSON.parse(localStorage.getItem("user"));

//     if (!currentUser) {
//       alert("No user is logged in!");
//       return;
//     }

//     // update in users array
//     const updatedUsers = users.map((u) =>
//       u.email === currentUser.email
//         ? {
//           ...u,
//           name: modalType === "name" ? tempValue : u.name,
//           userPass: modalType === "password" ? tempValue : u.userPass,
//         }
//         : u
//     );

//     // update in single logged-in user
//     const updatedCurrentUser = updatedUsers.find(
//       (u) => u.email === currentUser.email
//     );

//     localStorage.setItem("users", JSON.stringify(updatedUsers));
//     localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

//     alert(`${modalType === "name" ? "Name" : "Password"} updated successfully!`);

//     setModalType(null);
//     setTempValue("");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       {/* <aside className="w-1/4 bg-white shadow-md p-4 border-r">
//         <h2 className="text-lg font-semibold text-gray-800 mb-3">Images</h2>
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full px-3 py-2 mb-4 text-sm border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <ul className="space-y-2">
//           {filteredItems.map((item) => (
//             <li
//               key={item.id}
//               className={`p-2 rounded-md cursor-pointer transition ${
//                 selectedItem?.id === item.id
//                   ? "bg-blue-100 text-blue-600 font-medium"
//                   : "hover:bg-gray-100"
//               }`}
//               onClick={() => setSelectedItem(item)}
//             >
//               {item.title}
//             </li>
//           ))}
//         </ul>
//       </aside> */}

//       <aside className="w-[18%] bg-gray-800 shadow-lg p-4 border-r border-gray-700 min-h-screen flex flex-col">
//         <h2 className="text-xl font-bold text-gray-100 mb-6">Images</h2>

//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full px-3 py-2 mb-4 text-sm border rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <ul className="flex-1 space-y-2">
//           {filteredItems.map((item) => (
//             <li
//               key={item.id}
//               className={`p-3 rounded-lg cursor-pointer transition-colors text-gray-200 hover:bg-gray-700 hover:text-white ${selectedItem?.id === item.id
//                 ? "bg-blue-600 text-white font-semibold"
//                 : ""
//                 }`}
//               onClick={() => setSelectedItem(item)}
//             >
//               {item.title}
//             </li>
//           ))}
//         </ul>
//       </aside>


//       {/* Main Content */}

//       <main className="flex-1 p-6 overflow-auto bg-gray-900 text-gray-100">
//         {/* Top Controls */}
//         <div className="flex justify-between space-x-3 mb-6">
//           <span>
//             <h1 className="font-bold text-2xl">Username</h1>
//           </span>

//           <span>
//             <button
//               className="px-4 py-2 text-sm rounded-lg shadow bg-blue-600 hover:bg-blue-700 transition-colors"
//               onClick={() => {
//                 setModalType("name");
//                 setTempValue("");
//               }}
//             >
//               Edit Name
//             </button>
//             <button
//               className="px-4 py-2 text-sm rounded-lg shadow bg-yellow-500 hover:bg-yellow-600 transition-colors"
//               onClick={() => {
//                 setModalType("password");
//                 setTempValue("");
//               }}
//             >
//               Edit Password
//             </button>
//             <button
//               className="px-4 py-2 text-sm rounded-lg shadow bg-red-600 hover:bg-red-700 transition-colors"
//               onClick={() => {
//                 navigate("/");
//                 alert("Logged out!");
//               }}
//             >
//               Logout
//             </button>
//           </span>
//         </div>

//         {/* Preview Section */}
//         <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center">
//           {selectedItem ? (
//             <div className="text-center">
//               <h3 className="text-2xl font-bold text-white">{selectedItem.title}</h3>
//               <p className="text-gray-300 mt-2">
//                 Department: {selectedItem.department}
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 Password: {selectedItem.password}
//               </p>
//             </div>
//           ) : (
//             <p className="text-gray-400 italic">
//               Preview images
//             </p>
//           )}
//         </div>
//       </main>

//       {/* Modal */}
//       {modalType && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96 text-gray-100">
//             <h2 className="text-lg font-semibold mb-4 text-white">
//               Edit {modalType === "name" ? "Name" : "Password"}
//             </h2>
//             <input
//               type={modalType === "password" ? "password" : "text"}
//               className="w-full px-3 py-2 mb-4 rounded bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
//               value={tempValue}
//               onChange={(e) => setTempValue(e.target.value)}
//             />
//             <div className="flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
//                 onClick={() => setModalType(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
//                 onClick={handleUpdate}
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Screenshots;


//------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Screenshots = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // now Firestore-driven
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // modal states
  const [modalType, setModalType] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "screenshots"),
      where("user_uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          title:
            raw.createdAt?.toDate().toLocaleString() || "Screenshot",
          department: "image",
          url: raw.url || "",
        };
      });
      setItems(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // handle update for localStorage user (kept as-is)
  const handleUpdate = () => {
    if (!modalType) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("No user is logged in!");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.email === currentUser.email
        ? {
            ...u,
            name: modalType === "name" ? tempValue : u.name,
            userPass:
              modalType === "password" ? tempValue : u.userPass,
          }
        : u
    );

    const updatedCurrentUser = updatedUsers.find(
      (u) => u.email === currentUser.email
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "user",
      JSON.stringify(updatedCurrentUser)
    );

    alert(
      `${
        modalType === "name" ? "Name" : "Password"
      } updated successfully!`
    );

    setModalType(null);
    setTempValue("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-[18%] bg-gray-800 shadow-lg p-4 border-r border-gray-700 min-h-screen flex flex-col">
        <h2 className="text-xl font-bold text-gray-100 mb-6">Images</h2>

        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 mb-4 text-sm border rounded-md bg-gray-900 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="flex-1 space-y-2">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors text-gray-200 hover:bg-gray-700 hover:text-white ${
                selectedItem?.id === item.id
                  ? "bg-blue-600 text-white font-semibold"
                  : ""
              }`}
              onClick={() => setSelectedItem(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-900 text-gray-100">
        {/* Top Controls */}
        <div className="flex justify-between space-x-3 mb-6">
          <span>
            <h1 className="font-bold text-2xl">Username</h1>
          </span>

          <span>
            <button
              className="px-4 py-2 text-sm rounded-lg shadow bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => {
                setModalType("name");
                setTempValue("");
              }}
            >
              Edit Name
            </button>
            <button
              className="px-4 py-2 text-sm rounded-lg shadow bg-yellow-500 hover:bg-yellow-600 transition-colors"
              onClick={() => {
                setModalType("password");
                setTempValue("");
              }}
            >
              Edit Password
            </button>
            <button
              className="px-4 py-2 text-sm rounded-lg shadow bg-red-600 hover:bg-red-700 transition-colors"
              onClick={() => {
                navigate("/");
                alert("Logged out!");
              }}
            >
              Logout
            </button>
          </span>
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-center">
          {selectedItem ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">
                {selectedItem.title}
              </h3>
              <p className="text-gray-300 mt-2">
                Department: {selectedItem.department}
              </p>
              {selectedItem.url && (
                <img
                  src={selectedItem.url}
                  alt="screenshot"
                  className="mt-4 max-h-96 mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">Preview images</p>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96 text-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Edit {modalType === "name" ? "Name" : "Password"}
            </h2>
            <input
              type={modalType === "password" ? "password" : "text"}
              className="w-full px-3 py-2 mb-4 rounded bg-gray-900 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
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

export default Screenshots;
