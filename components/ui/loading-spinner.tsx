// components/ui/loading-spinner.tsx
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        theme === "dark" ? "text-gray-300" : "text-gray-700",
        "h-5 w-5",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
