// components/ActionButtons.jsx
import React from "react";

const ActionButtons = ({ setShowTimerModal, openAddModal, saving }) => {
  return (
    <div className="flex relative gap-3">
      <button
        onClick={() => setShowTimerModal(true)}
        className="px-4 py-2 absolute top-1 right-38 bg-purple-600 hover:bg-purple-700 rounded-lg shadow cursor-pointer"
        disabled={saving}
      >
        ⏰ Set Timer
      </button>
      <button
        onClick={openAddModal}
        className="px-4 py-2 absolute top-1 right-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow cursor-pointer"
        disabled={saving}
      >
        ➕ Add User
      </button>
    </div>
  );
};

export default ActionButtons;