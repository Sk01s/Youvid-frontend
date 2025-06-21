"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import type { Channel, Video } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Play, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const theme = useSelector((state: RootState) => state.theme.mode);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link
      href={`/video/${video.id}`}
      className={`group cursor-pointer transition-transform duration-300 hover:scale-105  rounded-lg overflow-hidden `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnailUrl || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <Image
              src={video.channelAvatar || "/placeholder.svg"}
              alt={video?.channelName ?? ""}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-sm line-clamp-2 mb-1 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {video.title}
            </h3>
            <p
              className={`text-sm mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {video?.channelName ?? ""}
            </p>
            <div
              className={`flex items-center space-x-2 text-xs ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>{formatViews(video.views)} views</span>
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
