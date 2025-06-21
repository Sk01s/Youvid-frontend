"use client";

import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoGrid from "@/components/home/video-grid";
import {
  getTrendingVideos,
  getRecommendedVideos,
  ApiResponse,
} from "@/lib/api/videos/videos.api";
import { Video } from "@/lib/types";

export default function HomePage() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // specify generics: <data, error>
  const {
    data: trendingVideos,
    isLoading: trendingLoading,
  }: UseQueryResult<Video[], unknown> = useQuery({
    queryKey: ["trending-videos"],
    // wrap in a zero-arg fn so React‑Query can call it
    queryFn: () => getTrendingVideos(1, 20),
  });

  const {
    data: recommendedVideos,
    isLoading: recommendedLoading,
  }: UseQueryResult<Video[], unknown> = useQuery({
    queryKey: ["recommended-videos"],
    queryFn: () => getRecommendedVideos(1, 20),
  });

  return (
    <main
      className={`flex-1 max-h-[calc(100vh-4.rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300 `}
    >
      {/* Trending Videos Section */}
      <section className="mb-12">
        <h2
          className={`text-xl md:text-2xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Trending Now
        </h2>
        <VideoGrid videos={trendingVideos} isLoading={trendingLoading} />
      </section>

      {/* Recommended Videos Section */}
      <section>
        <h2
          className={`text-xl md:text-2xl font-bold mb-4  ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Recommended for You
        </h2>
        <VideoGrid videos={recommendedVideos} isLoading={recommendedLoading} />
      </section>
    </main>
  );
}
