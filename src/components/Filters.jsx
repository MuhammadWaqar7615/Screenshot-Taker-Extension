// components/Filters.jsx
import React from "react";

const Filters = ({ search, setSearch, roleFilter, setRoleFilter, deptFilter, setDeptFilter, skillsFilter, setSkillsFilter, uniqueRoles, uniqueDepartments, uniqueSkills, saving, showAddModal, editingUserId }) => {
  if (showAddModal || editingUserId) return null;

  return (
    <div className="filters flex flex-wrap gap-4 mb-3">
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
      <select
        value={skillsFilter}
        onChange={(e) => setSkillsFilter(e.target.value)}
        className="border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={saving}
      >
        <option value="">All Skills</option>
        {uniqueSkills.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;