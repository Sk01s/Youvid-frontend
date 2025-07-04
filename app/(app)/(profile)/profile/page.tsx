"use client";
import { useState, useEffect } from "react";
import {
  getRecommendedVideos,
  getUserVideos,
} from "@/lib/api/videos/videos.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Video } from "@/lib/types";
import { LoadingPage } from "@/components/ui/loading-page";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/features/auth-slice";
import { selectCurrentUser } from "@/lib/features/auth-slice";
import { createChannel, getChannelByUserId } from "@/lib/api/channel.api";
import Modal from "@/components/ui/modal";
import VideoCard from "@/components/home/video-card";

const DashboardPage = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSelector(selectCurrentUser);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [channelError, setChannelError] = useState<string | null>(null);

  const {
    data: videos,
    isLoading: videosLoading,
    isError: videosError,
  } = useQuery<Video[]>({
    queryKey: ["my-videos"],
    queryFn: () => getUserVideos(),
  });

  const {
    data: channels,
    isLoading: channelsLoading,
    isError: channelsError,
  } = useQuery({
    queryKey: ["user-channels", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return getChannelByUserId(user.id);
    },
    enabled: !!user?.id,
  });

  const createChannelMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not available");
      return createChannel(
        parseInt(user.id),
        channelName.trim(),
        avatarUrl.trim() || "https://via.placeholder.com/150"
      );
    },
    onSuccess: () => {
      setShowChannelModal(false);
      queryClient.invalidateQueries({ queryKey: ["user-channels"] });
    },
    onError: (error: any) => {
      setChannelError(
        error.message || error.status?.message || "Failed to create channel"
      );
    },
  });

  useEffect(() => {
    if (channels && channels.length === 0 && user?.id) {
      setShowChannelModal(true);
    }
  }, [channels, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push("/auth");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleCreateChannel = async () => {
    setChannelError(null);
    if (!channelName.trim()) {
      setChannelError("Channel name is required");
      return;
    }
    createChannelMutation.mutate();
  };

  if (videosLoading || channelsLoading) return <LoadingPage />;

  if (videosError || channelsError) {
    return (
      <div
        className={`text-center p-8 ${
          theme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Error loading content
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark"
          ? "bg-zinc-800 text-white"
          : "bg-zinc-100 text-zinc-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Videos</h1>
        <div className="flex space-x-4">
          <Link
            href="/profile/upload"
            className={`p-3 rounded-2xl ${
              theme === "dark"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-200 text-zinc-800"
            }`}
          >
            Upload
          </Link>
          <button
            onClick={handleLogout}
            className={`p-3 rounded-2xl focus:outline-none ${
              theme === "dark"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      {videos?.length === 0 ? (
        <div
          className={`text-center py-12 ${
            theme === "dark" ? "bg-zinc-900" : "bg-zinc-50"
          } rounded-xl`}
        >
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You haven't uploaded any videos yet
          </p>
          <Link
            href="/profile/upload"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Upload First Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {/* Channel Creation Modal */}
      <Modal show={showChannelModal}>
        <div
          className={`p-6 rounded-2xl max-w-md w-full ${
            theme === "dark" ? "bg-zinc-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Create Your Channel</h2>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            You need a channel to upload videos. Please create one to continue.
          </p>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Channel Name*</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-zinc-700 text-white border-zinc-600"
                  : "bg-zinc-100 text-zinc-900 border-zinc-300"
              } border focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Enter channel name"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className={`w-full p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-zinc-700 text-white border-zinc-600"
                  : "bg-zinc-100 text-zinc-900 border-zinc-300"
              } border focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="https://example.com/avatar.jpg"
            />
            <p
              className={`mt-1 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Optional - we'll use a default if empty
            </p>
          </div>

          {channelError && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {channelError}
            </div>
          )}

          <button
            onClick={handleCreateChannel}
            disabled={createChannelMutation.isPending}
            className={`w-full p-4 rounded-2xl font-medium ${
              createChannelMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors`}
          >
            {createChannelMutation.isPending
              ? "Creating Channel..."
              : "Create Channel"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
