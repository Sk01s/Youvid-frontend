import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

interface CenterPlayButtonProps {
  playing: boolean;
  showControls: boolean;
  togglePlay: () => void;
}

const CenterPlayButton: React.FC<CenterPlayButtonProps> = ({
  playing,
  showControls,
  togglePlay,
}) => {
  const [isOverButton, setIsOverButton] = useState(false);

  return (
    <button
      onClick={togglePlay}
      className={`absolute inset-0 flex items-center justify-center z-[9] transition-opacity duration-300 ${
        // Only show when:
        // 1. Video is paused OR
        // 2. User is hovering over it specifically OR
        // 3. Controls are visible
        !playing || isOverButton || showControls
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
      onMouseEnter={() => setIsOverButton(true)}
      onMouseLeave={() => setIsOverButton(false)}
      aria-label={playing ? "Pause" : "Play"}
    >
      <div className="bg-black/50 rounded-full p-4 cursor-pointer hover:bg-black/70 transition-all">
        {playing ? (
          <Pause className="w-12 h-12 text-white" strokeWidth={1.5} />
        ) : (
          <Play className="w-12 h-12 text-white" strokeWidth={1.5} />
        )}
      </div>
    </button>
  );
};

export default CenterPlayButton;
