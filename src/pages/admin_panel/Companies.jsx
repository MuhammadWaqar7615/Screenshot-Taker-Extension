import React, { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc, // ✅ Add this one here
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import Sidebar from "../../components/Sidebar";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyOwner: "",
    logoFile: null,
    logoPreview: "",
    logoType: "",
    logoSize: 0,
  });

  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const colRef = collection(db, "companies");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCompanies(list);
        setLoading(false);
      },
      (err) => {
        console.error("companies onSnapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filteredCompanies = useMemo(() => {
    const s = (search || "").trim().toLowerCase();
    if (!s) return companies;
    return companies.filter(
      (c) =>
        (c.companyName || "").toLowerCase().includes(s) ||
        (c.companyOwner || "").toLowerCase().includes(s)
    );
  }, [companies, search]);

  const isLogoUrl = (val) =>
    typeof val === "string" &&
    (val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("data:image/"));

  const formatCreatedAt = (ts) => {
    try {
      if (!ts) return "N/A";
      if (ts?.toDate) return ts.toDate().toLocaleString();
      return new Date(ts).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const base64 = await fileToBase64(file);
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: base64,
        logoType: file.type,
        logoSize: file.size,
      }));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removeLogo = () => {
    if (formData.logoPreview) URL.revokeObjectURL(formData.logoPreview);
    setFormData((prev) => ({
      ...prev,
      logoFile: null,
      logoPreview: "",
      logoType: "",
      logoSize: 0,
    }));
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({
      companyName: "",
      companyDescription: "",
      companyOwner: "",
      logoFile: null,
      logoPreview: "",
      logoType: "",
      logoSize: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.companyName || "",
      companyDescription: company.companyDescription || "",
      companyOwner: company.companyOwner || "",
      logoFile: null,
      logoPreview: company.logoName || "",
      logoType: company.logoType || "",
      logoSize: company.logoSize || 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({
      companyName: "",
      companyDescription: "",
      companyOwner: "",
      logoFile: null,
      logoPreview: "",
      logoType: "",
      logoSize: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.companyName?.trim() ||
      !formData.companyDescription?.trim() ||
      !formData.companyOwner?.trim() ||
      !formData.logoPreview
    ) {
      alert("All fields are required, including the logo.");
      return false;
    }
    return true;
  };

const handleAddCompany = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    setSaving(true);

    // Create a new document reference with an auto-generated ID
    const newDocRef = doc(collection(db, "companies"));

    const payload = {
      cid: newDocRef.id, // ✅ assign document ID here
      companyName: formData.companyName.trim(),
      companyDescription: formData.companyDescription.trim(),
      companyOwner: formData.companyOwner.trim(),
      logoName: formData.logoPreview,
      logoType: formData.logoType,
      logoSize: formData.logoSize,
      createdAt: serverTimestamp(),
    };

    // Write document (single operation)
    await setDoc(newDocRef, payload);

    // Update UI
    setCompanies((prev) => [...prev, { id: newDocRef.id, ...payload }]);
    closeModal();
  } catch (err) {
    console.error("Add company error:", err);
    alert("Error adding company: " + (err.message || err));
  } finally {
    setSaving(false);
  }
};


  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!editingCompany) return;
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = {
        companyName: formData.companyName.trim(),
        companyDescription: formData.companyDescription.trim(),
        companyOwner: formData.companyOwner.trim(),
        logoName: formData.logoPreview,
        logoType: formData.logoType,
        logoSize: formData.logoSize,
      };
      await updateDoc(doc(db, "companies", editingCompany.id), payload);
      setCompanies((prev) =>
        prev.map((c) => (c.id === editingCompany.id ? { ...c, ...payload } : c))
      );
      closeModal();
    } catch (err) {
      console.error("Update company error:", err);
      alert("Error updating company: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      setSaving(true);
      await deleteDoc(doc(db, "companies", id));
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete company error:", err);
      alert("Error deleting company: " + (err.message || err));
    } finally {
      setSaving(false);
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
          <p className="mt-4 text-gray-200 text-lg font-semibold">{saving ? "Saving..." : "Loading..."}</p>
        </div>
      )}

      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">Companies</h1>
          <div className="flex gap-3">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
              disabled={saving || loading}
            >
              ➕ Add Company
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-700 rounded px-3 py-2 w-64 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
            disabled={saving || loading}
          />
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
          {filteredCompanies.length === 0 ? (
            <p className="p-4 text-gray-300">
              {companies.length === 0 ? "No companies found." : "No companies match your search."}
            </p>
          ) : (
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="p-3">Logo</th>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, idx) => (
                  <tr
                    key={company.id}
                    className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700 transition-colors`}
                  >
                    <td className="p-3">
                      {isLogoUrl(company.logoName) ? (
                        <img
                          src={company.logoName}
                          alt={company.companyName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                          style={{ imageRendering: "auto" }} // optimized display
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                          {company.companyName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{company.companyName || "N/A"}</td>
                    <td className="p-3 max-w-xs truncate">{company.companyDescription || "—"}</td>
                    <td className="p-3">{company.companyOwner || "—"}</td>
                    <td className="p-3 font-mono text-sm">{formatCreatedAt(company.createdAt)}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => openEditModal(company)}
                        className="text-yellow-400 hover:text-yellow-200 transition-colors p-1 rounded"
                        disabled={saving}
                        title="Edit company"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-500 hover:text-red-300 transition-colors p-1 rounded"
                        disabled={saving}
                        title="Delete company"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {/* The modal code remains unchanged except validation now requires all fields */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative border border-gray-700">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-700"
                disabled={saving}
              >
                <IoClose size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-6 text-white">
                {editingCompany ? "Edit Company" : "Add Company"}
              </h2>

              <form
                onSubmit={editingCompany ? handleUpdateCompany : handleAddCompany}
                className="space-y-4"
              >
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={saving}
                  />
                </div>

                {/* Company Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    placeholder="Company description (optional)"
                    required
                    rows={3}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    disabled={saving}
                  />
                </div>

                {/* Company Owner */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Owner *
                  </label>
                  <input
                    name="companyOwner"
                    value={formData.companyOwner}
                    onChange={handleChange}
                    placeholder="Owner name (optional)"
                    required
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={saving}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                  />
                  <div className="flex items-center gap-4">
                    {formData.logoPreview ? (
                      <div className="relative">
                        <img
                          src={formData.logoPreview}
                          alt="Logo preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          disabled={saving}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">?</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                      disabled={saving}
                    >
                      <FaUpload size={14} />
                      {formData.logoPreview ? "Change Logo" : "Upload Logo"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    disabled={saving}
                  >
                    {editingCompany ? "Update Company" : "Add Company"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
