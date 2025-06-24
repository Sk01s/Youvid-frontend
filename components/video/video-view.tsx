"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Download, Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Comments from "./comments";
import type { Channel, Video } from "@/lib/types";
import VideoPlayer from "./Video-player";
import { toggleLike, toggleSave } from "@/lib/api/videos/interactions.api";
import {
  toggleSubscription,
  getSubscriptionStatus,
} from "@/lib/api/subscription.api";

interface VideoViewProps {
  video: Video;
  channel: Channel;
}

export default function VideoViewPage({ video, channel }: VideoViewProps) {
  const queryClient = useQueryClient();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [localVideo, setLocalVideo] = useState(video);
  const channelId = channel.id;

  // Query for subscription status
  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription", channelId],
    queryFn: () => getSubscriptionStatus(channelId),
  });
  // Mutation for liking a video
  const likeMutation = useMutation({
    mutationFn: () => toggleLike(localVideo.id),
    onSuccess: (res) => {
      setLocalVideo((video) => ({
        ...video,
        ...res,
        likes: res.isLiked ? video.likes + 1 : video.likes - 1,
      }));
      // Update cache for video detail
      queryClient.setQueryData(["video", localVideo.id], {
        ...localVideo,
        ...res,
        likes: res.isLiked ? localVideo.likes + 1 : localVideo.likes - 1,
      });
    },
  });

  // Mutation for saving a video
  const saveMutation = useMutation({
    mutationFn: () => toggleSave(localVideo.id),
    onSuccess: (res) => {
      setLocalVideo((video) => ({ ...video, ...res }));
      queryClient.setQueryData(["video", localVideo.id], {
        ...localVideo,
        ...res,
      });
    },
  });

  // Mutation for subscribing to a channel
  const subscribeMutation = useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["subscription", channelId],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData<{
        isSubscribed: boolean;
      }>(["subscription", channelId]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["subscription", channelId],
        (old: { isSubscribed: boolean } | undefined) => ({
          isSubscribed: !old?.isSubscribed,
        })
      );

      // Also update the channel subscriber count optimistically
      channel.subscribers = previousStatus?.isSubscribed
        ? channel.subscribers - 1
        : channel.subscribers + 1;

      // Return a context object with the snapshotted value
      return { previousStatus, channel };
    },
    onError: (err, variables, context) => {
      // Roll back the optimistic update
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["subscription", channelId],
          context.previousStatus
        );
      }
    },
    onSettled: () => {
      // Invalidate the query to refetch
      queryClient.invalidateQueries({ queryKey: ["subscription", channelId] });
    },
  });

  // Format published date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hlsUrl = `https://pub-80e9583eb6ea478fab3a1f72f579a6a0.r2.dev/processed/${channel.id}/${video?.id}/master.m3u8`;

  return (
    <div className="flex-grow bg-background text-foreground min-h-screen">
      {/* Main Content */}
      <main className={`flex-1 pt-4 px-6`}>
        {/* Video Player */}
        <div className="w-full aspect-[16/9] bg-black rounded-lg overflow-hidden">
          <VideoPlayer hlsUrl={hlsUrl!} thumbnailUrl={video.thumbnailUrl} />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-xl font-semibold leading-tight">
          {localVideo.title}
        </h1>

        {/* Stats and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
          <div className="text-sm text-gray-500">
            {localVideo.views.toLocaleString()} views •
            {formatDate(localVideo.createdAt)}
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <Heart
                className={`w-5 h-5 mr-1 ${
                  localVideo.isLiked ? "text-red-500 fill-current" : ""
                }`}
              />
              {localVideo.likes}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center">
              <Share2 className="w-5 h-5 mr-1" /> Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              <Download
                className={`w-5 h-5 mr-1 ${
                  localVideo.isSaved ? "text-blue-500 fill-current" : ""
                }`}
              />
              Save
            </Button>
          </div>
        </div>

        {/* Channel Info and Subscribe */}
        <div className="flex items-center justify-between mt-6 border-t pt-4">
          <div className="flex items-center">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium">{channel.name}</p>
              <p className="text-sm text-gray-500">
                {channel.subscribers} subscribers
              </p>
            </div>
          </div>
          <Button
            variant={subscriptionData?.isSubscribed ? "default" : "destructive"}
            onClick={() => subscribeMutation.mutate()}
            disabled={subscribeMutation.isPending}
          >
            {subscriptionData?.isSubscribed ? (
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-1" /> Subscribed
              </div>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {/* Description */}
        <div
          className={`mt-4 text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-md transition-colors duration-300 
            ${
              theme === "dark"
                ? "bg-zinc-800 text-gray-200"
                : "bg-zinc-100 text-gray-800"
            }`}
        >
          {localVideo.description}
        </div>

        {/* Comments */}
        <Comments videoId={video.id} />
      </main>
    </div>
  );
}
