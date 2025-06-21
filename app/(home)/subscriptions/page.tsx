"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import VideoGrid from "@/components/home/video-grid";
import { getSubscriptionVideos } from "@/lib/api/videos/videos.api";
import { selectCurrentUser } from "@/lib/features/auth-slice";

export default function HomePage() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const user = useSelector(selectCurrentUser);

  const { data: trendingVideos, isLoading: trendingLoading } = useQuery({
    queryKey: ["subscriptions-videos"],
    queryFn: () => getSubscriptionVideos(),
  });

  return (
    <main
      className={`flex-1  max-h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 transition-all duration-300  h-[100vh]`}
    >
      <section className="mb-12">
        <h2
          className={`text-xl md:text-2xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Subscriptions
        </h2>
        <VideoGrid videos={trendingVideos} isLoading={trendingLoading} />
      </section>
    </main>
  );
}
