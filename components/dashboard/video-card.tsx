"use client";
import { Video } from "@/lib/types";
import Link from "next/link";
import { FiEye, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

const VideoCard = ({ video }: { video: Video }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl overflow-hidden border hover:shadow-lg transition-shadow
      ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"
      }`}
    >
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-1 rounded">
          {video.duration}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">
          <Link
            href={`/video/${video.id}`}
            className={`hover:text-red-600 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {video.title}
          </Link>
        </h3>

        <div
          className={`flex justify-between text-sm ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          <div className="flex items-center">
            <FiEye className="mr-1" />
            <span>{video.views.toLocaleString()} views</span>
          </div>

          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
