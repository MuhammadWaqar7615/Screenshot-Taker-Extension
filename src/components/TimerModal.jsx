// components/TimerModal.jsx
import React from "react";

const TimerModal = ({ showTimerModal, setShowTimerModal, saving, selectedAdmin, setSelectedAdmin, hours, setHours, minutes, setMinutes, seconds, setSeconds, handleSetTimer, users, getCompanyName }) => {
  if (!showTimerModal) return null;

  return (
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
  );
};

export default TimerModal;