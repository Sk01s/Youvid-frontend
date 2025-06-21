// components/ui/loading-page.tsx
import { RootState } from "@/lib/store";
import { LoadingSpinner } from "./loading-spinner";
import { useSelector } from "react-redux";

export const LoadingPage = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  return (
    <div
      className={` fixed inset-0 flex items-center justify-center  z-50 ${
        theme === "dark" ? "bg-zinc-900 " : "bg-white "
      }`}
    >
      <LoadingSpinner className="h-16 w-16" />
    </div>
  );
};
