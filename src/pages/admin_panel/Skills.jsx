// skill

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

export default function Skills() {
  // UI state
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [search, setSearch] = useState("");
  const [proficiencyFilter, setProficiencyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Read logged-in user / company from localStorage
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

  // Helper to safely read fields
  const getField = (obj, keys) => {
    if (!obj) return null;
    for (const k of keys) {
      const v = obj[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return v;
    }
    return null;
  };

  // Date formatting helper
  const formatDateVal = (val) => {
    if (!val && val !== 0) return "-";
    try {
      if (typeof val === "string") {
        if (/^\d{4}-\d{2}-\d{2}/.test(val) || val.includes("T")) {
          const date = new Date(val);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
        return val;
      }
      if (val?.toDate)
        return val.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      if (val?.seconds)
        return new Date(val.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      return String(val);
    } catch {
      return String(val);
    }
  };

  // Subscribe to Firestore
  useEffect(() => {
    try {
      setLoading(true);
      const colRef = collection(db, "skills");
      const unsub = onSnapshot(
        colRef,
        (snapshot) => {
          const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!isSiteAdmin && companyId) {
            const filtered = all.filter((s) =>
              ["cid", "companyId", "company_id", "company", "userCid"].some(
                (k) => s[k] === companyId
              )
            );
            setSkills(filtered);
          } else {
            setSkills(all);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Skills subscription error:", err);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn("Firestore not available, fallback demo data.", err);
      setSkills([
        {
          id: 1,
          skillId: "SK001",
          userId: "USR001",
          skillName: "React.js",
          experienceYears: 3,
          proficiencyLevel: "Expert",
          createdAt: "2024-01-15",
        },
      ]);
      setLoading(false);
    }
  }, [companyId, isSiteAdmin]);

  // Unique proficiency levels
  const uniqueProficiencyLevels = useMemo(() => {
    const arr = skills
      .map((s) =>
        getField(s, ["proficiencyLevel", "proficiency_level", "level"])
      )
      .filter((x) => x && String(x).trim() !== "");
    return [...new Set(arr)];
  }, [skills]);

  // Filtered skills
  const filteredSkills = useMemo(() => {
    const s = (search || "").toLowerCase();
    return skills.filter((skill) => {
      const skillName = String(
        getField(skill, ["skillName", "skill_name", "name"])
      ).toLowerCase();
      const userName = String(
        getField(skill, ["userName", "user_name", "user"])
      ).toLowerCase();
      const skillId = String(
        getField(skill, ["skillId", "skill_id", "id"])
      ).toLowerCase();
      const userId = String(getField(skill, ["userId", "user_id"]) || "").toLowerCase();

      const matchesSearch =
        !s ||
        skillName.includes(s) ||
        userName.includes(s) ||
        skillId.includes(s) ||
        userId.includes(s);

      const matchesProficiency = proficiencyFilter
        ? String(
            getField(skill, [
              "proficiencyLevel",
              "proficiency_level",
              "level",
            ]) || ""
          ).toLowerCase() === proficiencyFilter.toLowerCase()
        : true;

      return matchesSearch && matchesProficiency;
    });
  }, [skills, search, proficiencyFilter]);

  // Edit handlers
  const handleEdit = (skill) => {
    setEditingSkill(skill.id);
    setEditedData({ ...skill });
  };

  const handleSave = async (id) => {
    if (
      !editedData.skillName ||
      !editedData.userId ||
      !editedData.experienceYears ||
      !editedData.proficiencyLevel
    ) {
      alert("⚠️ Please fill all required fields before saving.");
      return;
    }

    try {
      setSaving(true);
      if (db && typeof id === "string") {
        const docRef = doc(db, "skills", id);
        const { id: _unused, ...rest } = editedData;
        await updateDoc(docRef, rest);
      } else {
        setSkills(skills.map((s) => (s.id === id ? { ...s, ...editedData } : s)));
      }
      setEditingSkill(null);
      setEditedData({});
    } catch (err) {
      console.error("Error saving skill:", err);
      alert("Error saving skill. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setEditedData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      setSaving(true);
      if (db && typeof id === "string") {
        await deleteDoc(doc(db, "skills", id));
      } else {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting skill:", err);
      alert("Error deleting skill.");
    } finally {
      setSaving(false);
    }
  };

  // Add skill
  const handleAddSkill = async () => {
    const base = {
      skillId: `SK${Date.now().toString().slice(-4)}`,
      userId: "",
      skillName: "",
      experienceYears: "",
      proficiencyLevel: "",
      createdAt: new Date().toISOString().split("T")[0],
      cid: isSiteAdmin ? "" : companyId,
    };

    try {
      setSaving(true);
      if (db) {
        const ref = await addDoc(collection(db, "skills"), base);
        setEditingSkill(ref.id);
        setEditedData(base);
      } else {
        const tmp = { ...base, id: Date.now() };
        setSkills([...skills, tmp]);
        setEditingSkill(tmp.id);
        setEditedData(tmp);
      }
    } catch (err) {
      console.error("Error adding skill:", err);
      alert("Error adding skill.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid =
    editedData.skillName &&
    editedData.userId &&
    editedData.experienceYears &&
    editedData.proficiencyLevel;

  return (
    <div className="flex min-h-screen bg-[#101828] relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

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

      {/* Main Content */}
      <div className="flex-1">
        <header className="w-full p-4 shadow flex justify-between items-center">
          <h1 className="text-2xl ml-4 mt-2 font-bold text-white">Skills</h1>
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer mr-4 mt-2"
          >
            <FaPlus /> Add Skill
          </button>
        </header>

        {/* Filters */}
        <div className="p-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by skill, user, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white"
          />
          <select
            value={proficiencyFilter}
            onChange={(e) => setProficiencyFilter(e.target.value)}
            className="border border-gray-600 px-3 py-2 rounded bg-gray-800 text-white cursor-pointer"
          >
            <option value="">All Proficiency Levels</option>
            {uniqueProficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-100 bg-[#101828]">
              <thead className="bg-gray-700 text-sm uppercase font-semibold text-gray-200">
                <tr>
                  <th className="px-6 py-4">Skill ID</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Skill Name</th>
                  <th className="px-6 py-4">Experience (Years)</th>
                  <th className="px-6 py-4">Proficiency Level</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill.id}
                    className={`transition border-gray-600 cursor-pointer ${
                      editingSkill === skill.id
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {/* Skill ID */}
                    <td className="px-6 py-3 text-gray-100">
                      {editingSkill === skill.id ? (
                        <input
                          type="text"
                          placeholder="Skill ID"
                          value={editedData.skillId || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              skillId: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full text-white bg-gray-800"
                        />
                      ) : (
                        String(getField(skill, ["skillId", "skill_id", "id"]) ||
                          "-")
                      )}
                    </td>

                    {/* User ID */}
                    <td className="px-6 py-3 text-gray-100">
                      {editingSkill === skill.id ? (
                        <input
                          type="text"
                          placeholder="User ID"
                          value={editedData.userId || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              userId: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full text-white bg-gray-800"
                        />
                      ) : (
                        String(getField(skill, ["userId", "user_id"]) || "-")
                      )}
                    </td>

                    {/* Skill Name */}
                    <td className="px-6 py-3 text-gray-100">
                      {editingSkill === skill.id ? (
                        <input
                          type="text"
                          placeholder="Skill Name"
                          value={editedData.skillName || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              skillName: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full text-white bg-gray-800"
                        />
                      ) : (
                        String(
                          getField(skill, [
                            "skillName",
                            "skill_name",
                            "name",
                            "title",
                          ]) || "-"
                        )
                      )}
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-3 text-gray-100">
                      {editingSkill === skill.id ? (
                        <input
                          type="number"
                          placeholder="Experience Years"
                          value={editedData.experienceYears || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              experienceYears: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full text-white bg-gray-800"
                          min="0"
                          max="50"
                          step="0.5"
                        />
                      ) : (
                        String(
                          getField(skill, [
                            "experienceYears",
                            "experience_years",
                            "experience",
                          ]) || "-"
                        )
                      )}
                    </td>

                    {/* Proficiency */}
                    <td className="px-6 py-3 text-gray-100">
                      {editingSkill === skill.id ? (
                        <select
                          value={editedData.proficiencyLevel || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              proficiencyLevel: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full text-white bg-gray-800"
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      ) : (
                        String(
                          getField(skill, [
                            "proficiencyLevel",
                            "proficiency_level",
                            "level",
                          ]) || "-"
                        )
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-3 text-gray-100">
                      {formatDateVal(
                        getField(skill, ["createdAt", "created_at", "created"])
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 flex gap-3">
                      {editingSkill === skill.id ? (
                        <>
                          <button
                            onClick={() => handleSave(skill.id)}
                            disabled={!isFormValid}
                            className={`${
                              !isFormValid
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-green-400 hover:text-green-200 cursor-pointer"
                            }`}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleCancel(skill.id)}
                            className="text-red-400 hover:text-red-200 cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-yellow-400 hover:text-yellow-200 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-500 hover:text-red-300 cursor-pointer"
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

            {filteredSkills.length === 0 && (
              <p className="p-4 text-gray-300">No skills found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}