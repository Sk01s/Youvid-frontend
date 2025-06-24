import React from "react";

const KeyboardHint: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
      <kbd className="bg-gray-800 px-1.5 py-0.5 rounded mr-1">Space</kbd> to
      play
    </div>
  );
};

export default KeyboardHint;
