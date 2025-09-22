
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
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingCompany, setAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    logo: "",
    companyName: "",
    owner: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    domain: "",
  });

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const querySnapshot = await getDocs(collection(db, "companies"));
      const companyList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompanies(companyList);
    };
    fetchCompanies();
  }, []);

  // Start editing
  const handleEdit = (company) => {
    setEditingCompany(company.id);
    setEditedData(company);
  };

  // Save update
  const handleSave = async (id) => {
    const companyRef = doc(db, "companies", id);
    await updateDoc(companyRef, { ...editedData, updatedAt: serverTimestamp() });
    setCompanies(
      companies.map((c) => (c.id === id ? { ...c, ...editedData } : c))
    );
    setEditingCompany(null);
  };

  // Delete company
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "companies", id));
    setCompanies(companies.filter((c) => c.id !== id));
  };

  // Add new company
  const handleAddCompany = async () => {
    const docRef = await addDoc(collection(db, "companies"), {
      ...newCompany,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setCompanies([...companies, { id: docRef.id, ...newCompany }]);
    setAddingCompany(false);
    setNewCompany({
      logo: "",
      companyName: "",
      owner: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "",
      domain: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar left */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 bg-white p-4 shadow">
          <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
          <button
            onClick={() => setAddingCompany(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Add Company
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow rounded-lg mr-4 ml-4">
          <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300  bg-white">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3 border border-gray-300">Logo</th>
                <th className="px-4 py-3 border border-gray-300">Company Name</th>
                <th className="px-4 py-3 border border-gray-300">Owner</th>
                <th className="px-4 py-3 border border-gray-300">Email</th>
                <th className="px-4 py-3 border border-gray-300">Phone</th>
                <th className="px-4 py-3 border border-gray-300">Address</th>
                <th className="px-4 py-3 border border-gray-300">State</th>
                <th className="px-4 py-3 border border-gray-300">Country</th>
                <th className="px-4 py-3 border border-gray-300">Domain</th>
                <th className="px-4 py-3 border border-gray-300">Created At</th>
                <th className="px-4 py-3 border border-gray-300">Updated At</th>
                <th className="px-4 py-3 border border-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* Add Company Row */}
              {addingCompany && (
                <tr className="bg-green-50">
                  <td className="px-4 py-3 text-center border border-gray-300">
                    <input
                      type="file"
                      className="cursor-pointer"
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          logo: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />
                    {newCompany.logo ? (
                      <img
                        src={newCompany.logo}
                        alt="logo"
                        className="w-12 h-12 mx-auto mt-2 rounded-full object-cover"
                      />
                    ) : newCompany.companyName ? (
                      <div className="w-12 h-12 mx-auto mt-2 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {newCompany.companyName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-12 h-12 mx-auto mt-2 rounded-full bg-gray-300"></div>
                    )}
                  </td>
                  {[
                    "companyName",
                    "owner",
                    "email",
                    "phone",
                    "address",
                    "state",
                    "country",
                    "domain",
                  ].map((field) => (
                    <td key={field} className="px-4 py-3 border border-gray-300">
                      <input
                        type="text"
                        placeholder={field}
                        value={newCompany[field]}
                        onChange={(e) =>
                          setNewCompany({ ...newCompany, [field]: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 border border-gray-300">N/A</td>
                  <td className="px-4 py-3 border border-gray-300">N/A</td>
                  <td className="px-4 py-3 flex gap-3 border border-gray-300">
                    <button
                      className="text-green-600 hover:text-green-800 cursor-pointer"
                      onClick={handleAddCompany}
                    >
                      <FaCheck size={20} />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 cursor-pointer"
                      onClick={() => setAddingCompany(false)}
                    >
                      <FaTimes size={20} />
                    </button>
                  </td>
                </tr>
              )}

              {/* Company Rows */}
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition">
                  <td className="px-2 border border-gray-200 text-center">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt="logo"
                        className="w-12 h-12 mx-auto rounded-full object-cover"
                      />
                    ) : company.companyName ? (
                      <div className="w-12 h-12 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {company.companyName.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-300"></div>
                    )}
                  </td>

                  {[
                    "companyName",
                    "owner",
                    "email",
                    "phone",
                    "address",
                    "state",
                    "country",
                    "domain",
                  ].map((field) => (
                    <td key={field} className="px-4 py-6 border border-gray-200">
                      {editingCompany === company.id ? (
                        <input
                          type="text"
                          value={editedData[field] || ""}
                          onChange={(e) =>
                            setEditedData({ ...editedData, [field]: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        company[field] || "N/A"
                      )}
                    </td>
                  ))}

                  <td className="px-4 py-3 border border-gray-200">
                    {company.createdAt?.toDate
                      ? company.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {company.updatedAt?.toDate
                      ? company.updatedAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 flex gap-3 border border-gray-200">
                    {editingCompany === company.id ? (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSave(company.id)}
                      >
                        <FaCheck size={20} />
                      </button>
                    ) : (
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => handleEdit(company)}
                      >
                        <FaEdit size={20} />
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(company.id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
















