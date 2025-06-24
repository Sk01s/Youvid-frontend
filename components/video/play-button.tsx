import React from "react";

interface PlayButtonProps {
  visible: boolean;
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ visible, onClick }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center z-20"
    >
      <div className="bg-black/50 rounded-full p-4 cursor-pointer hover:bg-black/70 transition-all">
        <svg
          className="w-12 "
          height="100%"
          version="1.1"
          viewBox="0 0 36 36"
          width="100%"
        >
          <path
            className="fill-white"
            d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"
            id="ytp-id-166"
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default PlayButton;
