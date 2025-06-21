import { useEffect } from "react";

const Modal = ({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative max-h-full overflow-auto">{children}</div>
    </div>
  );
};
export default Modal;
