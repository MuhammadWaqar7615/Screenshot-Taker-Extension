// components/UsersTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const UsersTable = ({
  filteredUsers,
  handleRowClick,
  startEdit,
  handleDelete,
  saving,
  formatTimer,
  formatDate,
  getCompanyName,
}) => {
  if (filteredUsers.length === 0) {
    return <p className="p-4 text-gray-400 italic text-center">No users found.</p>;
  }

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
      {/* Horizontal scroll for small screens */}
      <div className="overflow-x-auto">
        {/* Vertical scroll limited to viewport height */}
        <div className="max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
          <table className="min-w-full table-fixed border-collapse text-left text-sm">
            {/* Sticky Header */}
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 sticky top-0 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Company",
                  "Department",
                  "Role",
                  "Skills",
                  "Status",
                  "Timer",
                  "Joining Date",
                  "Screenshots",
                  "Actions",
                ].map((heading, index) => (
                  <th
                    key={index}
                    className={`p-3 font-semibold border-b border-gray-600 ${
                      index === 0 ? "rounded-tl-xl" : ""
                    } ${index === 10 ? "rounded-tr-xl" : ""}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`transition-all duration-150 ${
                    idx % 2 === 0 ? "bg-gray-800" : "bg-gray-850"
                  } hover:bg-gray-700/80 hover:shadow-md cursor-pointer`}
                  onClick={() => handleRowClick(user)}
                >
                  {/* Name */}
                  <td
                    className="p-3 flex items-center gap-2 overflow-hidden truncate whitespace-nowrap"
                    title={user.name || "N/A"}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-inner">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span className="truncate max-w-[150px] text-gray-100 font-medium">
                      {user.name}
                    </span>
                  </td>

                  {/* Email */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[200px] text-gray-300"
                    title={user.email || "N/A"}
                  >
                    {user.email}
                  </td>

                  {/* Company */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[180px] text-gray-300"
                    title={getCompanyName(user.cid)}
                  >
                    {getCompanyName(user.cid)}
                  </td>

                  {/* Department */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[150px] text-gray-300"
                    title={user.department || "—"}
                  >
                    {user.department || "—"}
                  </td>

                  {/* Role */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[120px] text-gray-300"
                    title={user.role || "—"}
                  >
                    {user.role || "—"}
                  </td>

                  {/* Skills */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[200px]"
                    title={
                      user.skills && user.skills.length > 0
                        ? user.skills
                            .map((skillItem) => {
                              const skill =
                                typeof skillItem === "object"
                                  ? skillItem.skill
                                  : skillItem;
                              const exp =
                                typeof skillItem === "object"
                                  ? skillItem.experience
                                  : 0;
                              return exp > 0 ? `${skill} (${exp}y)` : skill;
                            })
                            .join(", ")
                        : "No skills"
                    }
                  >
                    <div className="flex flex-wrap gap-1">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.slice(0, 2).map((skillItem, i) => {
                          const skill =
                            typeof skillItem === "object"
                              ? skillItem.skill
                              : skillItem;
                          const exp =
                            typeof skillItem === "object"
                              ? skillItem.experience
                              : 0;
                          return (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-blue-600/90 text-white text-xs rounded-full truncate max-w-[100px] flex items-center gap-1 shadow-sm"
                            >
                              {skill}
                              {exp > 0 && (
                                <span className="text-yellow-300">
                                  ({exp}y)
                                </span>
                              )}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                      {user.skills && user.skills.length > 2 && (
                        <span className="text-gray-400 text-xs">
                          +{user.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {user.status || "inactive"}
                    </span>
                  </td>

                  {/* Timer */}
                  <td
                    className="p-3 font-mono overflow-hidden truncate whitespace-nowrap max-w-[100px] text-gray-300"
                    title={formatTimer(user.timer)}
                  >
                    {formatTimer(user.timer)}
                  </td>

                  {/* Joining Date */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[130px] text-gray-300"
                    title={formatDate(user.joiningDate)}
                  >
                    {formatDate(user.joiningDate)}
                  </td>

                  {/* Screenshots */}
                  <td
                    className="p-3 overflow-hidden truncate whitespace-nowrap max-w-[150px]"
                    title="View Screenshots"
                  >
                    <Link
                      to={`/screenshots/${user.id}`}
                      className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Screenshots
                    </Link>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-3 items-center">
                    <button
                      onClick={(e) => startEdit(user, e)}
                      className="text-yellow-400 hover:text-yellow-200 cursor-pointer disabled:opacity-50 transition-colors"
                      disabled={saving}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(user.id, e)}
                      className="text-red-500 hover:text-red-300 cursor-pointer disabled:opacity-50 transition-colors"
                      disabled={saving}
                      title="Delete"
                    >
                      <FaTrash />
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
};

export default UsersTable;
