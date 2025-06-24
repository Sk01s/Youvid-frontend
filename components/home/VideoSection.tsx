// components/VideoSection.tsx
"use client";

import { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoGrid from "@/components/home/video-grid";
import { useVideos } from "@/hooks/useVideos";

interface VideoSectionProps {
  title: string;
  queryKey: string;
  fetcher: () => Promise<any[]>; // or Promise<Video[]>
}

const VideoSection: FC<VideoSectionProps> = ({ title, queryKey, fetcher }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const { videos, isLoading, isError } = useVideos(queryKey, fetcher);

  return (
    <section>
      <h2
        className={`text-xl md:text-2xl font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h2>

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load {title.toLowerCase()}.
        </p>
      )}

      <VideoGrid videos={videos} isLoading={isLoading} />
    </section>
  );
};

export default VideoSection;
