import React from "react";

interface SeekPreviewProps {
  visible: boolean;
  time: number;
  formatTime: (time: number) => string;
}

const SeekPreview: React.FC<SeekPreviewProps> = ({
  visible,
  time,
  formatTime,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-24 left-0 bg-black/80 text-white px-3 py-1 rounded text-sm">
      {formatTime(time)}
    </div>
  );
};

export default SeekPreview;
