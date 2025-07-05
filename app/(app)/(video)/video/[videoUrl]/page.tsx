"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

import VideoGrid from "@/components/home/video-grid";
import VideoViewPage from "@/components/video/video-view";
import { getRecommendedVideos, getVideo } from "@/lib/api/videos/videos.api";
import Header from "@/components/home/header";
import { LoadingPage } from "@/components/ui/loading-page";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Channel, Video } from "@/lib/types";
import { RootState } from "@/lib/store";
import { getChannelById } from "@/lib/api/channel.api";

export default function VideoDetail() {
  const { videoUrl } = useParams();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const {
    data: video,
    isLoading: loadingVideo,
    error: videoError,
  } = useQuery<Video, Error>({
    queryKey: ["video", videoUrl],
    queryFn: () => getVideo(parseInt(videoUrl?.toString() ?? "") ?? -1),
    enabled: Boolean(videoUrl),
  });
  const {
    data: channel,
    isLoading: loadingChannel,
    error: channelError,
  } = useQuery<Channel, Error>({
    queryKey: ["channel", video?.channelId],
    queryFn: () => getChannelById(video?.channelId ?? -1),
    enabled: Boolean(video?.channelId),
  });
  const {
    data: recommended,
    isLoading: loadingRec,
    error: recError,
  } = useQuery<Video[], Error>({
    queryKey: ["recommended"],
    queryFn: () => getRecommendedVideos(1, 6).then((value) => value.data),
  });

  if (loadingVideo || loadingChannel) return <LoadingPage />;
  if (videoError) return <div>Error: {videoError.message}</div>;
  if (channelError) return <div>Error: {channelError.message}</div>;

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-zinc-900 text-gray-200"
          : "bg-zinc-100 text-gray-800"
      }`}
    >
      <Header />
      <div className="flex flex-col md:flex-row md:px-[10vw]">
        <VideoViewPage video={video!} channel={channel!} />

        {/* Recommended Videos */}
        <section className="px-6 mt-8">
          <h2 className="text-lg font-medium mb-4">Recommended</h2>
          {loadingRec ? (
            <LoadingSpinner />
          ) : recError ? (
            <div>Error: {recError.message}</div>
          ) : (
            <VideoGrid videos={recommended!} isLoading={false} />
          )}
        </section>
      </div>
    </div>
  );
}
