// components/UserFormModal.jsx
import React from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";

const UserFormModal = ({ 
  showAddModal, closeAddModal, saving, editingUserId, formData, handleFormChange, 
  showPassword, setShowPassword, isSiteAdmin, companies, currentCid, getCompanyName,
  handleSkillsInputClick, showSkillsDropdown, setShowSkillsDropdown, skillSearch, setSkillSearch,
  filteredSkills, handleSkillSelect, formDataSkills, handleRemoveSkill, skillExperiences, 
  handleExperienceChange, handleAddUser, saveEdit, bloodGroups, skillsDropdownRef 
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center  z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-5xl h-[80vh] overflow-y-auto relative ">
        <button
          onClick={closeAddModal}
          disabled={saving}
          className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">
          {editingUserId ? "Edit User" : "Add New User"}
        </h2>

        <form
          onSubmit={editingUserId ? saveEdit : handleAddUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleFormChange}
              required
              maxLength={30}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleFormChange}
              maxLength={30}
              required
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleFormChange}
                required
                minLength={6}
                maxLength={30}
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
          </div>

          {/* Contact Field */}
          <div className="flex flex-col">
            <label
              htmlFor="contact"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleFormChange}
              maxLength={15}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          {/* Address Field */}
          <div className="flex flex-col">
            <label
              htmlFor="address"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter user address"
              value={formData.address}
              onChange={handleFormChange}
              rows={3}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50 resize-vertical"
              disabled={saving}
            />
          </div>

          {/* Blood Group Field */}
          <div className="flex flex-col">
            <label
              htmlFor="bloodGroup"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50"
              disabled={saving}
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="role"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Enter user role"
              value={formData.role}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="department"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              placeholder="Enter department"
              value={formData.department}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          {/* Joining Date Field */}
          <div className="flex flex-col">
            <label
              htmlFor="joiningDate"
              className="text-sm text-gray-300 mb-1 font-semibold"
            >
              Joining Date
            </label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleFormChange}
              className="border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              disabled={saving}
            />
          </div>

          {/* Skills dropdown - custom implementation */}
          <div className="md:col-span-2 relative" ref={skillsDropdownRef}>
            <label className="block text-sm text-gray-400 mb-1">Skills with Experience</label>
            
            {/* Selected skills display with experience inputs */}
            <div className="space-y-2 mb-3">
              {formDataSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded">
                  <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded flex items-center gap-1 flex-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-xs hover:text-red-300 cursor-pointer ml-2"
                      disabled={saving}
                    >
                      ×
                    </button>
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 whitespace-nowrap">Experience:</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={skillExperiences[skill] || 0}
                      onChange={(e) => handleExperienceChange(skill, e.target.value)}
                      className="w-16 border border-gray-600 p-1 rounded bg-gray-800 text-white text-sm"
                      disabled={saving}
                    />
                    <span className="text-xs text-gray-400">years</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills input with dropdown */}
            <div className="relative">
              <div
                className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer flex items-center justify-between"
                onClick={handleSkillsInputClick}
              >
                <span className="text-gray-400">
                  {formDataSkills.length > 0 ? `Click to add more skills (${formDataSkills.length} selected)` : "Click to select skills"}
                </span>
                <FaChevronDown className={`text-gray-400 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown menu */}
              {showSkillsDropdown && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded mt-1 z-10 max-h-90 overflow-y-auto">
                  {/* Search input */}
                  <div className="p-2 border-b border-gray-600">
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="w-full p-2 bg-gray-900 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* Skills list */}
                  <div className="max-h-56 overflow-y-auto">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div
                          key={skill}
                          className={`p-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                            formDataSkills.includes(skill) ? 'bg-blue-900' : ''
                          }`}
                          onClick={() => handleSkillSelect(skill)}
                        >
                          <span>{skill}</span>
                          {formDataSkills.includes(skill) && (
                            <span className="text-green-400">✓</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-400  text-center">
                        No skills found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company select */}
          {isSiteAdmin ? (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <select
                name="cid"
                value={formData.cid}
                onChange={handleFormChange}
                required
                className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.cid} value={c.cid}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <select
                name="cid"
                value={formData.cid || currentCid}
                onChange={handleFormChange}
                required
                className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-400 cursor-not-allowed"
                disabled
              >
                <option value={currentCid}>{getCompanyName(currentCid)}</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeAddModal}
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "⏳ Saving..." : editingUserId ? "✅ Save Changes" : "✅ Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;