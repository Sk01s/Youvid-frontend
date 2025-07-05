// pages/subscriptions.tsx
"use client";

import VideoSection from "@/components/home/video-section";
import { getSubscriptionVideos } from "@/lib/api/videos/videos.api";

export default function SubscriptionsPage() {
  return (
    <main className="flex-1  max-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300  h-[100vh]">
      <VideoSection
        title="Subscriptions"
        queryKey={["subscriptions-videos"]}
        fetcher={getSubscriptionVideos}
      />
    </main>
  );
}
