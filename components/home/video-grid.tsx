"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoCard from "./video-card";
import VideoCardSkeleton from "./video-card-skeleton";
import type { Video } from "@/lib/types";

interface VideoGridProps {
  videos?: Video[];
  isLoading: boolean;
}

export default function VideoGrid({ videos, isLoading }: VideoGridProps) {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Container caps at 5 columns (5×21.875rem + 4×1.5rem gaps), centers on large screens,
  // and adds 1rem padding on each side
  const containerClasses = `
    w-full
    px-4
    mx-auto
    max-w-[calc(5*21.875rem+4*1.5rem)]
  `;

  // Auto-fit as many columns as will fit, each between 15rem (240px) and 1fr
  // so they stretch to evenly fill the row with no leftover space
  const gridClasses = `
    grid
    gap-6
    grid-cols-[repeat(auto-fit,_minmax(16rem,auto))]
  `;

  const renderSkeletons = () =>
    Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />);

  const renderCards = () =>
    videos!.map((video) => <VideoCard key={video.id} video={video} />);

  return (
    <div className={containerClasses.trim()}>
      {isLoading ? (
        <div className={gridClasses.trim()}>{renderSkeletons()}</div>
      ) : !videos || videos.length === 0 ? (
        <div
          className={`text-center py-12 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p className="text-lg">No videos found</p>
        </div>
      ) : (
        <div
          className={`${gridClasses.trim()} ${
            videos!.length === 1 && "md:max-w-[40%]"
          }`}
        >
          {renderCards()}
        </div>
      )}
    </div>
  );
}
