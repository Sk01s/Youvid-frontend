// pages/history.tsx
"use client";

import VideoSection from "@/components/home/VideoSection";
import { getChannelVideos } from "@/lib/api/videos/videos.api";
import { useParams } from "next/navigation";

export default function ChannelPage() {
  const { channelId } = useParams();

  return (
    <main className="flex-1  max-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300  h-[100vh]">
      <VideoSection
        title="Channel videos"
        queryKey={["Channel-videos", Number(channelId?.toString())]}
        fetcher={() => getChannelVideos(Number(channelId?.toString()))}
      />
    </main>
  );
}
