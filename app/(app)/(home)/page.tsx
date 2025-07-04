"use client";

import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoGrid from "@/components/home/video-grid";
import { getRecommendedVideos } from "@/lib/api/videos/videos.api";
import { Video } from "@/lib/types";

export default function HomePage() {
  const {
    data: recommendedVideos,
    isLoading: recommendedLoading,
  }: UseQueryResult<Video[], unknown> = useQuery({
    queryKey: ["recommended-videos"],
    // wrap in a zero-arg fn so React‑Query can call it
    queryFn: () => getRecommendedVideos(1, 20),
  });

  return (
    <main
      className={`flex-1 h-[calc(100vh-4rem)]  overflow-y-auto p-4 md:p-6 transition-all duration-300 `}
    >
      {/* recommended Videos Section */}
      <section className="mb-12">
        <VideoGrid videos={recommendedVideos} isLoading={recommendedLoading} />
      </section>
    </main>
  );
}
