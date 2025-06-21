// components/ui/skeleton-card.tsx
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

export const SkeletonCard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white"
      )}
    >
      <div
        className={cn(
          "animate-pulse rounded-md mb-4",
          theme === "dark" ? "bg-gray-700" : "bg-gray-200",
          "h-40 w-full"
        )}
      />
      <div className="space-y-2">
        <div
          className={cn(
            "animate-pulse rounded-md",
            theme === "dark" ? "bg-gray-700" : "bg-gray-200",
            "h-6 w-3/4"
          )}
        />
        <div
          className={cn(
            "animate-pulse rounded-md",
            theme === "dark" ? "bg-gray-700" : "bg-gray-200",
            "h-4 w-full"
          )}
        />
        <div
          className={cn(
            "animate-pulse rounded-md",
            theme === "dark" ? "bg-gray-700" : "bg-gray-200",
            "h-4 w-2/3"
          )}
        />
      </div>
    </div>
  );
};
