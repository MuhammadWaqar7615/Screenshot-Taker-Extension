// components/LoadingOverlay.jsx
import React from "react";

const LoadingOverlay = ({ loading, saving }) => {
  if (!loading && !saving) return null;

  return (
    <div className="absolute inset-0 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-blue-600 animate-[spin_2.5s_linear_infinite]"></div>
      </div>
      <p className="mt-4 text-gray-200 text-lg font-semibold">
        {saving ? "Saving..." : "Loading..."}
      </p>
    </div>
  );
};

export default LoadingOverlay;