// components/UserDetailModal.jsx
import React from "react";
import { FaTimes, FaEdit, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserDetailModal = ({ showUserModal, selectedUser, closeUserModal, startEdit, formatDate, formatTimer, getCompanyName }) => {
  if (!showUserModal || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={closeUserModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
            {selectedUser.name?.charAt(0)?.toUpperCase() || <FaUser />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedUser.name || "N/A"}</h2>
            <p className="text-gray-400">{selectedUser.email || "N/A"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 border-b border-gray-700 pb-2">
              Basic Information
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <p className="text-white">{selectedUser.name || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white">{selectedUser.email || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Contact</label>
              <p className="text-white">{selectedUser.contact || "—"}</p>
            </div>

            <div>
              <label className="text-sm text-gray-400">Blood Group</label>
              <p className="text-white">{selectedUser.bloodGroup || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">User ID</label>
              <p className="text-white font-mono text-sm">{selectedUser.uid || selectedUser.id || "—"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 border-b border-gray-700 pb-2">
              Work Details
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Company</label>
              <p className="text-white">{getCompanyName(selectedUser.cid)}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Department</label>
              <p className="text-white">{selectedUser.department || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Role</label>
              <p className="text-white">{selectedUser.role || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Joining Date</label>
              <p className="text-white">{formatDate(selectedUser.joiningDate) || "—"}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedUser.status === "active" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-600 text-white"
              }`}>
                {selectedUser.status || "inactive"}
              </span>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-gray-700 pb-2">
              Skills & Experience
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Skills with Experience</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(selectedUser.skills && selectedUser.skills.length > 0) ? (
                  selectedUser.skills.map((skillItem, index) => {
                    const skill = typeof skillItem === 'object' ? skillItem.skill : skillItem;
                    const experience = typeof skillItem === 'object' ? skillItem.experience : 0;
                    return (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1"
                        title={`${experience} years experience`}
                      >
                        {skill}
                        {experience > 0 && (
                          <span className="text-yellow-300 text-xs">({experience}y)</span>
                        )}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No skills added</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
              Personal Details
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Address</label>
              <p className="text-white whitespace-pre-wrap">{selectedUser.address || "—"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
              Settings
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Screenshot Timer</label>
              <p className="text-white font-mono">{formatTimer(selectedUser.timer)}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Password</label>
              <p className="text-white">••••••••</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400 border-b border-gray-700 pb-2">
              Timestamps
            </h3>
            
            <div>
              <label className="text-sm text-gray-400">Created At</label>
              <p className="text-white text-sm">{formatDate(selectedUser.createdAt)}</p>
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Last Updated</label>
              <p className="text-white text-sm">{formatDate(selectedUser.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={(e) => {
              closeUserModal();
              startEdit(selectedUser, e);
            }}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <FaEdit /> Edit User
          </button>
          <Link
            to={`/screenshots/${selectedUser.id}`}
            onClick={closeUserModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
          >
            View Screenshots
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;