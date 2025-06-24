import React, { ReactNode } from "react";

interface ControlsOverlayProps {
  children: ReactNode;
  visible: boolean;
}

const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  children,
  visible,
}) => {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default ControlsOverlay;
