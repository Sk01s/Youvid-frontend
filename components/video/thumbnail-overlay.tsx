import React from "react";

interface ThumbnailOverlayProps {
  visible: boolean;
  thumbnailUrl: string;
}

const ThumbnailOverlay: React.FC<ThumbnailOverlayProps> = ({
  visible,
  thumbnailUrl,
}) => {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${thumbnailUrl})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default ThumbnailOverlay;
