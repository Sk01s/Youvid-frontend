import React from "react";

interface ProgressBarProps {
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  currentTime: number;
  duration: number;
  isHovered: boolean;
  showControls: boolean;
  isSeeking: boolean;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleProgressHover: (e: React.MouseEvent<HTMLDivElement>) => void;
  hideSeekPreview: () => void;
  handleSeekStart: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressBarRef,
  currentTime,
  duration,
  isHovered,
  showControls,
  isSeeking,
  handleProgressClick,
  handleProgressHover,
  hideSeekPreview,
  handleSeekStart,
}) => (
  <div
    ref={progressBarRef}
    className="h-1.5 w-full bg-gray-600 mb-4 group-hover:mb-4 cursor-pointer relative"
    onClick={handleProgressClick}
    onMouseMove={handleProgressHover}
    onMouseLeave={hideSeekPreview}
  >
    <div
      className="h-full bg-red-600 relative z-10"
      style={{ width: `${(currentTime / duration) * 100}%` }}
    >
      <div
        className="absolute w-4 h-4 bg-red-600 rounded-full -top-[4.5px] -right-2 transform translate-x-0 cursor-pointer"
        style={{
          opacity: isHovered || showControls || isSeeking ? 1 : 0,
        }}
        onMouseDown={handleSeekStart}
      />
    </div>

    {/* Buffered progress (simulated) */}
    <div
      className="absolute top-0 h-full bg-gray-500"
      style={{
        width: `${Math.min((currentTime / duration) * 100 + 20, 100)}%`,
      }}
    />
  </div>
);

export default ProgressBar;
