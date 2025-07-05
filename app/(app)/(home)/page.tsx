"use client";

import { getRecommendedVideos } from "@/lib/api/videos/videos.api";
import VideoSection from "@/components/home/video-section";

export default function HomePage() {
  return (
    <main className="flex-1  max-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300  h-[100vh]">
      <VideoSection
        queryKey={["subscriptions-videos"]}
        fetcher={getRecommendedVideos}
      />
    </main>
  );
}
