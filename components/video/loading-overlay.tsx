import React from "react";

const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl">Loading video stream...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
