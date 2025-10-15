//tasks

import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: "",
    assignedTo: "",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    startDate: "",
    dueDate: "",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  // Current logged-in user
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
  const currentUid = currentUser?.uid || currentUser?.id || null;

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "—";
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleString();
      return new Date(timestamp).toLocaleString();
    } catch {
      return "—";
    }
  };

  // Load users and projects first
  useEffect(() => {
    let unsubUsers = () => {};
    let unsubProjects = () => {};

    try {
      // Load users
      unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredUsers = isSiteAdmin
          ? allUsers
          : allUsers.filter((u) => u.cid === currentCid);
        setUsers(filteredUsers);
      });

      // Load projects
      unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
        const projList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projList);
      });
    } catch (err) {
      console.error("Error loading users/projects:", err);
    }

    return () => {
      unsubUsers();
      unsubProjects();
    };
  }, [isSiteAdmin, currentCid]);

  // Load tasks after users are loaded
  useEffect(() => {
    if (users.length === 0) return;

    let unsubTasks = () => {};

    try {
      if (!isSiteAdmin && currentCid) {
        // For company admin: only load tasks for users in their company
        const companyUserIds = users.map(u => u.id);
        
        unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
          let taskList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter tasks where assignedTo user is in companyUserIds
          taskList = taskList.filter((task) => 
            companyUserIds.includes(task.assignedTo)
          );

          setTasks(taskList);
          setLoading(false);
        });
      } else {
        // For site admin: load all tasks
        unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
          const taskList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(taskList);
          setLoading(false);
        });
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
      setLoading(false);
    }

    return () => {
      unsubTasks();
    };
  }, [isSiteAdmin, currentCid, users]); // Only depend on users

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.status?.trim()).filter(Boolean))).sort(),
    [tasks]
  );

  const uniquePriorities = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.priority?.trim()).filter(Boolean))).sort(),
    [tasks]
  );

  const uniqueProjects = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.projectId?.trim()).filter(Boolean))).sort(),
    [tasks]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newRef = doc(collection(db, "tasks"));
      const data = {
        ...formData,
        id: newRef.id,
        assignedBy: currentUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(newRef, data);
      resetForm();
    } catch (err) {
      console.error("Add Task Error:", err);
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      projectId: task.projectId || "",
      assignedTo: task.assignedTo || "",
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
    });
    setShowAddForm(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "tasks", editingTaskId), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      resetForm();
    } catch (err) {
      console.error("Update Task Error:", err);
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this task?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setShowAddForm(false);
    setFormData({
      projectId: "",
      assignedTo: "",
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      startDate: "",
      dueDate: "",
    });
  };

  const getUserName = (uid) => users.find((u) => u.id === uid)?.name || "N/A";
  const getProjectName = (pid) => projects.find((p) => p.id === pid)?.name || "N/A";

  const getPriorityColor = (p) =>
    p === "high" ? "bg-red-600" : p === "medium" ? "bg-yellow-600" : "bg-green-600";

  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case "completed":
        return "bg-green-600";
      case "in progress":
        return "bg-blue-600";
      case "pending":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredTasks = useMemo(() => {
    const s = search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s)) &&
        (statusFilter ? t.status === statusFilter : true) &&
        (priorityFilter ? t.priority === priorityFilter : true) &&
        (projectFilter ? t.projectId === projectFilter : true)
    );
  }, [tasks, search, statusFilter, priorityFilter, projectFilter]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 relative">

      {/* 🔹 New Stylish Loader 🔹 */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Tasks</h1>
          <button
            onClick={() => (showAddForm || editingTaskId ? resetForm() : setShowAddForm(true))}
            className={`px-4 py-2 rounded-lg shadow ${
              showAddForm || editingTaskId ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {showAddForm || editingTaskId ? "Cancel" : "➕ Add Task"}
          </button>
        </div>

        {/* Filters */}
        {!showAddForm && !editingTaskId && (
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">All Priorities</option>
              {uniquePriorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">All Projects</option>
              {uniqueProjects.map((p) => (
                <option key={p}>{getProjectName(p)}</option>
              ))}
            </select>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingTaskId) && (
          <form
            onSubmit={editingTaskId ? saveEdit : handleAddTask}
            className="bg-gray-800 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Select Project</label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleFormChange}
                required
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleFormChange}
                required
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-gray-300 mb-1">Task Title</label>
              <input
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormChange}
                className="bg-gray-900 border border-gray-600 p-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="col-span-full bg-green-600 py-2 rounded hover:bg-green-700"
              disabled={saving}
            >
              {editingTaskId ? "Save Changes" : "Save Task"}
            </button>
          </form>
        )}

        {/* Task Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {filteredTasks.length === 0 ? (
            <p className="p-4 text-gray-400">No tasks found.</p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-700 text-gray-200 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Task Title</th>
                    <th className="p-3 text-left">Project</th>
                    <th className="p-3 text-left">Assigned To</th>
                    <th className="p-3 text-left">Priority</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Start Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Updated At</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`${i % 2 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700`}
                    >
                      <td className="p-3 font-medium">{t.title}</td>
                      <td className="p-3">{getProjectName(t.projectId)}</td>
                      <td className="p-3">{getUserName(t.assignedTo)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full text-white ${getPriorityColor(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(
                            t.status
                          )}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3">{formatDate(t.startDate)}</td>
                      <td className="p-3">{formatDate(t.dueDate)}</td>
                      <td className="p-3 text-sm text-gray-300">{formatDateTime(t.createdAt)}</td>
                      <td className="p-3 text-sm text-gray-300">{formatDateTime(t.updatedAt)}</td>
                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => startEdit(t)}
                          className="text-yellow-400 hover:text-yellow-200"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-500 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;