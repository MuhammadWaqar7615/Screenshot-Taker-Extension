import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, setDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot, getDocs, getDoc, query, where, writeBatch} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const [originalUserData, setOriginalUserData] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  // Delete user helper
  const deleteUserById = async (userId) => {
    try {
      const screenshotsRef = collection(db, "screenshots");
      const screenshotsQuery = query(screenshotsRef, where("user_id", "==", userId));
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

  // Load companies and users
  useEffect(() => {
    let unsubscribe = () => { };
    const init = async () => {
      try {
        // Fetch companies
        const companySnapshot = await getDocs(collection(db, "companies"));
        const companyList = companySnapshot.docs.map((docSnap) => ({
          cid: docSnap.id,
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCompanies(companyList);
        const existingCompanyIds = new Set(companyList.map((c) => c.cid));

        // Listen to users
        unsubscribe = onSnapshot(collection(db, "users"), async (snapshot) => {
          const userList = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

          // Delete users whose company is missing
          const usersToDelete = userList.filter((u) => u.cid && !existingCompanyIds.has(u.cid));
          if (usersToDelete.length > 0) {
            for (const u of usersToDelete) {
              await deleteUserById(u.id);
              console.log(`Deleted user ${u.name || u.email} because company was removed`);
            }
          }

          // Update users state
          setUsers(userList.filter((u) => !u.cid || existingCompanyIds.has(u.cid)));
          setLoading(false);
        });
      } catch (err) {
        console.error("Error initializing data:", err);
        setLoading(false);
      }
    };

    init();
    return () => unsubscribe();
  }, []);

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const usersCol = collection(db, "users");
      const newDocRef = doc(usersCol);
      const uid = newDocRef.id;

      const companyTimer = await getCompanyTimer(formData.cid);

      const dataToSave = {
        ...formData,
        uid,
        status: "inactive",
        timer: companyTimer,
        createdAt: serverTimestamp(),
      };

      await setDoc(newDocRef, dataToSave);
      resetForm();
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setOriginalUserData(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      contact: user.contact || "",
      role: user.role || "",
      department: user.department || "",
      cid: user.cid || "",
    });
    setShowAddForm(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const companyTimer = await getCompanyTimer(formData.cid);

      const dataToUpdate = {
        ...formData,
        timer: companyTimer,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, "users", editingUserId), dataToUpdate);
      resetForm();
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteUserScreenshots = async (userId) => {
    try {
      const screenshotsRef = collection(db, "screenshots");
      const screenshotsQuery = query(screenshotsRef, where("user_id", "==", userId));
      const screenshotsSnapshot = await getDocs(screenshotsQuery);

      if (screenshotsSnapshot.size > 0) {
        const batch = writeBatch(db);
        screenshotsSnapshot.forEach((screenshotDoc) => batch.delete(screenshotDoc.ref));
        await batch.commit();
      }
      return screenshotsSnapshot.size;
    } catch (error) {
      console.error("Error deleting user screenshots:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete all their screenshots permanently.")) return;

    setSaving(true);
    try {
      const userToDelete = users.find(user => user.id === id);
      if (!userToDelete) throw new Error("User not found");

      const deletedScreenshotsCount = await deleteUserScreenshots(userToDelete.uid);
      await deleteDoc(doc(db, "users", id));

      if (deletedScreenshotsCount > 0) {
        alert(`✅ User deleted successfully. ${deletedScreenshotsCount} screenshots were also deleted.`);
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

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)) &&
        (roleFilter ? u.role === roleFilter : true) &&
        (deptFilter ? u.department === deptFilter : true)
    );
  }, [users, search, roleFilter, deptFilter]);

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
        timerUpdatedBy: adminUser.name || adminUser.email
      });

      const usersQuery = query(
        collection(db, "users"),
        where("cid", "==", companyId)
      );
      const usersSnapshot = await getDocs(usersQuery);

      usersSnapshot.forEach((userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        batch.update(userRef, { timer: totalMs });
      });

      await batch.commit();
      await new Promise(resolve => setTimeout(resolve, 1000));

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
        {/* ...Rest of your JSX remains exactly the same... */}
        {/* Add user form, filters, table, timer modal etc. */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">All Users</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTimerModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow cursor-pointer"
              disabled={saving}
            >
              ⏰ Set Timer
            </button>
            <button
              onClick={() => {
                if (showAddForm || editingUserId) resetForm();
                else setShowAddForm(true);
              }}
              className={`px-4 py-2 rounded-lg shadow transition-colors cursor-pointer ${(showAddForm || editingUserId)
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
              disabled={saving}
            >
              {(showAddForm || editingUserId) ? "Cancel" : "➕ Add User"}
            </button>
          </div>
        </div>

        {showTimerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative">
              <button
                onClick={() => !saving && setShowTimerModal(false)}
                disabled={saving}
                className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4">Set Company Timer</h2>
              <p className="text-sm text-gray-400 mb-4">
                This will set the timer for ALL users (including admin) in the selected admin's company.
              </p>
              <form onSubmit={handleSetTimer} className="space-y-4">
                <select
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                  className="w-full border border-gray-600 rounded p-2 bg-gray-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={saving}
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
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
                    min="0"
                    disabled={saving}
                  />
                  <input
                    type="number"
                    placeholder="MM"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
                    min="0"
                    max="59"
                    disabled={saving}
                  />
                  <input
                    type="number"
                    placeholder="SS"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-1/3 border border-gray-600 rounded p-2 bg-gray-900 text-white disabled:opacity-50"
                    min="0"
                    max="59"
                    disabled={saving}
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "⏳ Setting Timer..." : "✅ Set Timer for ALL Users"}
                </button>
              </form>
            </div>
          </div>
        )}

        {!showAddForm && !editingUserId && (
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
              disabled={saving}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
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
              className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
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
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleFormChange}
                required
                className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 w-full disabled:opacity-50"
                disabled={saving}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-2 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                disabled={saving}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />

            <select
              name="cid"
              value={formData.cid}
              onChange={handleFormChange}
              required
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.cid} value={c.cid}>
                  {c.companyName}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={saving}
              className="col-span-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "⏳ Saving..." : (editingUserId ? "✅ Save Changes" : "✅ Save User")}
            </button>
          </form>
        )}

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
                    <th className="p-3">Timer (seconds)</th>
                    <th className="p-3">Screenshots</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
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
                          className={`px-2 py-1 rounded-full text-xs ${user.status === "active"
                              ? "bg-green-600 text-white"
                              : "bg-gray-600 text-white"
                            }`}
                        >
                          {user.status || "inactive"}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        {user.timer ? Math.round(user.timer / 1000) : "—"}s
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/screenshots/${user.id}`}
                          className="text-blue-400 hover:underline cursor-pointer"
                        >
                          View Screenshots
                        </Link>
                      </td>
                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-yellow-400 hover:text-yellow-200 cursor-pointer disabled:opacity-50"
                          disabled={saving}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-300 cursor-pointer disabled:opacity-50"
                          disabled={saving}
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