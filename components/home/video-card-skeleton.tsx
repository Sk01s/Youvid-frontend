"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function VideoCardSkeleton() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div
      className={`animate-pulse ${
        theme === "dark" ? "bg-zinc-800" : "bg-white"
      } rounded-lg overflow-hidden shadow-lg`}
    >
      {/* Thumbnail skeleton */}
      <div
        className={`aspect-video ${
          theme === "dark" ? "bg-zinc-700" : "bg-zinc-400"
        }`}
      />

      {/* Content skeleton */}
      <div className="p-4">
        <div className="flex space-x-3">
          <div
            className={`w-9 h-9 rounded-full ${
              theme === "dark" ? "bg-zinc-700" : "bg-zinc-400"
            }`}
          />
          <div className="flex-1 space-y-2">
            <div
              className={`h-4 rounded ${
                theme === "dark" ? "bg-zinc-700" : "bg-zinc-400"
              }`}
            />
            <div
              className={`h-3 w-3/4 rounded ${
                theme === "dark" ? "bg-zinc-700" : "bg-zinc-400"
              }`}
            />
            <div
              className={`h-3 w-1/2 rounded ${
                theme === "dark" ? "bg-zinc-700" : "bg-zinc-400"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
