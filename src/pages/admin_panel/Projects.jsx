// import React, { useState, useMemo } from "react";
// import Sidebar from "../../components/Sidebar";
// import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

// function Projects() {
//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       name: "E-commerce Website",
//       client: "ABC Ltd.",
//       startDate: "2025-09-01",
//       endDate: "2025-12-30",
//       users: 5,
//       time: "120 hrs",
//     },
//     {
//       id: 2,
//       name: "Mobile App Development",
//       client: "XYZ Pvt.",
//       startDate: "2025-08-15",
//       endDate: "2025-11-20",
//       users: 3,
//       time: "80 hrs",
//     },
//   ]);

//   const [editingProject, setEditingProject] = useState(null);
//   const [editedData, setEditedData] = useState({});

//   // 🔍 Filters
//   const [search, setSearch] = useState("");
//   const [clientFilter, setClientFilter] = useState("");
//   const [userFilter, setUserFilter] = useState("");

//   // Unique values for dropdowns
//   const uniqueClients = useMemo(
//     () => [...new Set(projects.map((p) => p.client))],
//     [projects]
//   );

//   const uniqueUsersCount = useMemo(
//     () => [...new Set(projects.map((p) => p.users))],
//     [projects]
//   );

//   // Filtered projects
//   const filteredProjects = useMemo(() => {
//     const s = search.toLowerCase();
//     return projects.filter((p) => {
//       const matchesSearch =
//         !s ||
//         p.name.toLowerCase().includes(s) ||
//         p.client.toLowerCase().includes(s);

//       const matchesClient = clientFilter ? p.client === clientFilter : true;
//       const matchesUsers = userFilter ? p.users === parseInt(userFilter) : true;

//       return matchesSearch && matchesClient && matchesUsers;
//     });
//   }, [projects, search, clientFilter, userFilter]);

//   // Start editing
//   const handleEdit = (project) => {
//     setEditingProject(project.id);
//     setEditedData(project);
//   };

//   // ✅ Save update with validation
//   const handleSave = (id) => {
//     if (
//       !editedData.name ||
//       !editedData.client ||
//       !editedData.startDate ||
//       !editedData.endDate ||
//       !editedData.users ||
//       !editedData.time
//     ) {
//       alert("⚠️ Please fill all fields before saving.");
//       return;
//     }

//     setProjects(
//       projects.map((p) => (p.id === id ? { ...p, ...editedData } : p))
//     );
//     setEditingProject(null);
//     setEditedData({});
//   };

//   // Cancel editing (also remove empty new row)
//   const handleCancel = (id) => {
//     const project = projects.find((p) => p.id === id);

//     // agar naya project hai (fields khali hain) to row hata do
//     if (
//       !project.name &&
//       !project.client &&
//       !project.startDate &&
//       !project.endDate &&
//       !project.users &&
//       !project.time
//     ) {
//       setProjects(projects.filter((p) => p.id !== id));
//     }

//     setEditingProject(null);
//     setEditedData({});
//   };

//   // Delete project
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       setProjects(projects.filter((p) => p.id !== id));
//     }
//   };

//   // Add new project
//   const handleAddProject = () => {
//     const newProject = {
//       id: Date.now(),
//       name: "",
//       client: "",
//       startDate: "",
//       endDate: "",
//       users: "",
//       time: "",
//     };
//     setProjects([...projects, newProject]);
//     setEditingProject(newProject.id);
//     setEditedData(newProject);
//   };

//   // Check if form is valid
//   const isFormValid =
//     editedData.name &&
//     editedData.client &&
//     editedData.startDate &&
//     editedData.endDate &&
//     editedData.users &&
//     editedData.time;

//   return (
//     <div className="flex min-h-screen bg-[#101828]">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* Header */}
//         <header className="w-full p-4 shadow flex justify-between items-center">
//           <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Projects</h1>
//           <button
//             onClick={handleAddProject}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
//           >
//             <FaPlus /> Add Project
//           </button>
//         </header>

//         {/* 🔍 Filters */}
//         <div className="p-6 flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Search by project or client..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
//           />
//           <select
//             value={clientFilter}
//             onChange={(e) => setClientFilter(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
//           >
//             <option value="">All Clients</option>
//             {uniqueClients.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//           <select
//             value={userFilter}
//             onChange={(e) => setUserFilter(e.target.value)}
//             className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
//           >
//             <option value="">All Users</option>
//             {uniqueUsersCount.map((u) => (
//               <option key={u} value={u}>
//                 {u}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Page Content */}
//         <div className="p-6">
//           <div className="overflow-x-auto shadow rounded-lg">
//             <table className="min-w-full text-sm text-left text-white bg-[#101828]">
//               <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
//                 <tr>
//                   <th className="px-6 py-4">Project Name</th>
//                   <th className="px-6 py-4">Client Name</th>
//                   <th className="px-6 py-4">Starting Date</th>
//                   <th className="px-6 py-4">Expected End Date</th>
//                   <th className="px-6 py-4">Users</th>
//                   <th className="px-6 py-4">Minutes/Hrs</th>
//                   <th className="px-6 py-4">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredProjects.map((project) => (
//                   <tr
//                     key={project.id}
//                     className={`transition border-gray-600 ${
//                       editingProject === project.id
//                         ? "bg-gray-700"
//                         : "hover:bg-gray-700"
//                     }`}
//                   >
//                     {/* Project Name */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Project Name"
//                           value={editedData.name || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               name: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.name
//                       )}
//                     </td>

//                     {/* Client Name */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Client Name"
//                           value={editedData.client || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               client: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.client
//                       )}
//                     </td>

//                     {/* Start Date */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.startDate || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               startDate: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         project.startDate
//                       )}
//                     </td>

//                     {/* End Date */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="date"
//                           value={editedData.endDate || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               endDate: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-gray-400 bg-gray-800"
//                         />
//                       ) : (
//                         project.endDate
//                       )}
//                     </td>

//                     {/* Users */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="number"
//                           placeholder="Users"
//                           value={editedData.users || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               users: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.users
//                       )}
//                     </td>

//                     {/* Time */}
//                     <td className="px-6 py-3">
//                       {editingProject === project.id ? (
//                         <input
//                           type="text"
//                           placeholder="Time"
//                           value={editedData.time || ""}
//                           onChange={(e) =>
//                             setEditedData({
//                               ...editedData,
//                               time: e.target.value,
//                             })
//                           }
//                           className="border rounded px-2 py-1 w-full text-white bg-gray-800"
//                         />
//                       ) : (
//                         project.time
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-3 flex gap-3">
//                       {editingProject === project.id ? (
//                         <>
//                           <button
//                             onClick={() => handleSave(project.id)}
//                             disabled={!isFormValid}
//                             className={`${
//                               !isFormValid
//                                 ? "text-gray-500 cursor-not-allowed"
//                                 : "text-green-400 hover:text-green-200 cursor-pointer"
//                             }`}
//                           >
//                             <FaCheck />
//                           </button>
//                           <button
//                             onClick={() => handleCancel(project.id)}
//                             className="text-red-400 hover:text-red-200 cursor-pointer"
//                           >
//                             <FaTimes />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEdit(project)}
//                             className="text-yellow-400 hover:text-yellow-200 cursor-pointer"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(project.id)}
//                             className="text-red-500 hover:text-red-300 cursor-pointer"
//                           >
//                             <FaTrash />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredProjects.length === 0 && (
//               <p className="p-4 text-gray-300">No projects found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Projects;



//========================================================================================================


//projects


import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { db } from "../../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", startDate: "", endDate: "", role: "" });

  // ✅ New states for loader
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const localUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
  const localCompany =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("company") || "null")
      : null;

  const companyId =
    localCompany?.id || localUser?.cid || localUser?.companyId || null;
  const isSiteAdmin = localUser?.isSiteAdmin;

  const getField = (obj, keys) => {
    if (!obj) return null;
    for (const k of keys) {
      const v = obj[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return null;
  };

  const formatDateVal = (val) => {
    if (!val && val !== 0) return "-";
    try {
      if (typeof val === "string") {
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
        if (val.includes("T")) return val.slice(0, 10);
        return val;
      }
      if (val?.toDate) return val.toDate().toISOString().slice(0, 10);
      if (val?.seconds)
        return new Date(val.seconds * 1000).toISOString().slice(0, 10);
      return String(val);
    } catch {
      return String(val);
    }
  };

  // ✅ Load projects with loader
  useEffect(() => {
    setLoading(true);
    try {
      const colRef = collection(db, "projects");
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!isSiteAdmin && companyId) {
            const filtered = all.filter((p) =>
              ["cid", "companyId", "company_id", "company", "clientCid"].some(
                (k) => p[k] === companyId
              )
            );
            setProjects(filtered);
          } else {
            setProjects(all);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Projects subscription error:", err);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn("Firestore not available:", err);
      setProjects([
        {
          id: 1,
          name: "E-commerce Website",
          client: "ABC Ltd.",
          startDate: "2025-09-01",
          endDate: "2025-12-30",
          users: [
            {
              id: 101,
              name: "Hassan",
              startDate: "2025-09-05",
              endDate: "2025-12-01",
              role: "Developer",
            },
          ],
          groupLeader: "Ali",
          cid: "demo-company-1",
        },
      ]);
      setLoading(false);
    }
  }, [companyId, isSiteAdmin]);

  const uniqueClients = useMemo(() => {
    const arr = projects
      .map((p) =>
        getField(p, [
          "client",
          "clientName",
          "client_name",
          "companyName",
          "company_name",
        ])
      )
      .filter((x) => x && String(x).trim() !== "");
    return [...new Set(arr)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const s = (search || "").toLowerCase();
    return projects.filter((p) => {
      const name = String(
        getField(p, ["name", "projectName", "project_name", "title"]) || ""
      ).toLowerCase();
      const client = String(
        getField(p, [
          "client",
          "clientName",
          "companyName",
          "company_name",
        ]) || ""
      ).toLowerCase();
      const matchesSearch = !s || name.includes(s) || client.includes(s);
      const matchesClient = clientFilter
        ? client === clientFilter.toLowerCase()
        : true;
      return matchesSearch && matchesClient;
    });
  }, [projects, search, clientFilter]);

  const handleEdit = (project) => {
    setEditingProject(project.id);
    setEditedData({ ...project });
  };

  const handleSave = async (id) => {
    if (
      !editedData.name ||
      !editedData.client ||
      !editedData.startDate ||
      !editedData.endDate ||
      !editedData.groupLeader
    ) {
      alert("⚠️ Please fill all fields before saving.");
      return;
    }

    setSaving(true);
    try {
      if (db && typeof id === "string") {
        const docRef = doc(db, "projects", id);
        const { id: _unused, ...rest } = editedData;
        await updateDoc(docRef, rest);
      } else {
        setProjects(
          projects.map((p) =>
            p.id === id ? { ...p, ...editedData, users: p.users } : p
          )
        );
      }
      setEditingProject(null);
      setEditedData({});
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Error saving project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setSaving(true);
    try {
      if (db && typeof id === "string") {
        await deleteDoc(doc(db, "projects", id));
      } else {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async () => {
    setSaving(true);
    const base = {
      name: "",
      client: "",
      startDate: "",
      endDate: "",
      users: [],
      groupLeader: "",
      cid: isSiteAdmin ? "" : companyId,
      companyName: localCompany?.name || "",
    };

    try {
      if (db) {
        const ref = await addDoc(collection(db, "projects"), base);
        setEditingProject(ref.id);
        setEditedData(base);
      } else {
        const tmp = { ...base, id: Date.now() };
        setProjects([...projects, tmp]);
        setEditingProject(tmp.id);
        setEditedData(tmp);
      }
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Error adding project.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid =
    editedData.name &&
    editedData.client &&
    editedData.startDate &&
    editedData.endDate &&
    editedData.groupLeader;

  return (
    <div className="flex min-h-screen bg-[#101828] relative">
      <Sidebar />
      <div className="flex-1">
        <header className="w-full p-4 shadow flex justify-between items-center">
          <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Projects</h1>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
          >
            <FaPlus /> Add Project
          </button>
        </header>

        <div className="p-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by project or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
          />

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
          >
            <option value="">All Clients</option>
            {uniqueClients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-100 bg-[#101828]">
              <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">End</th>
                  <th className="px-6 py-4">Users</th>
                  <th className="px-6 py-4">Group Leader</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={`border-gray-600 cursor-pointer ${
                      editingProject === project.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={editedData.name || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              name: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-white"
                        />
                      ) : (
                        project.name
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          value={editedData.client || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              client: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-white"
                        />
                      ) : (
                        project.client
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="date"
                          value={editedData.startDate || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              startDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-gray-300"
                        />
                      ) : (
                        formatDateVal(project.startDate)
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingProject === project.id ? (
                        <input
                          type="date"
                          value={editedData.endDate || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              endDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full bg-gray-800 text-gray-300"
                        />
                      ) : (
                        formatDateVal(project.endDate)
                      )}
                    </td>

                    <td className="px-6 py-3">{project.users?.length || 0}</td>
                    <td className="px-6 py-3">{project.groupLeader}</td>

                    <td className="px-6 py-3 flex gap-3">
                      {editingProject === project.id ? (
                        <>
                          <button
                            onClick={() => handleSave(project.id)}
                            disabled={!isFormValid}
                            className={`${
                              !isFormValid
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-green-400 hover:text-green-200"
                            }`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(null);
                              setEditedData({});
                            }}
                            className="text-red-400 hover:text-red-200"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-yellow-400 hover:text-yellow-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-500 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjects.length === 0 && (
              <p className="p-4 text-gray-300">No projects found.</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Global Loader */}
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
    </div>
  );
}