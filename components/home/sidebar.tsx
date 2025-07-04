"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Home, Video, Clock, Bookmark, ThumbsUp, X } from "lucide-react";
import { Channel } from "@/lib/types";
import { getChannelsForUserId } from "@/lib/api/channel.api";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const pathname = usePathname();
  const router = useRouter();

  const mainItems: SidebarItem[] = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Video, label: "Subscriptions", path: "/subscriptions" },
    { icon: Clock, label: "History", path: "/history" },
    { icon: Bookmark, label: "Watch later", path: "/saved" },
    { icon: ThumbsUp, label: "Liked videos", path: "/likes" },
  ];

  const {
    data: channels,
    isLoading,
    isError,
  } = useQuery<Channel[], Error>({
    queryKey: ["sub-channels"],
    queryFn: () => getChannelsForUserId(),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <aside
      className={`w-60 transition-colors duration-300 md:max-h-[calc(100vh-4.3rem)] h-full overflow-y-scroll ${
        theme === "dark"
          ? "bg-zinc-950 md:bg-opacity-25 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4 relative">
        {onClose && (
          <Button
            size="icon"
            onClick={onClose}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {mainItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Button
              key={item.label}
              variant={isActive ? "default" : "ghost"}
              onClick={() => router.push(item.path)}
              className={`w-full justify-start mb-2 ${
                isActive
                  ? theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-800 text-white"
                    : "bg-zinc-100 hover:bg-zinc-100 text-black"
                  : theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-900 hover:text-gray-700 hover:bg-zinc-100"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          );
        })}

        <hr
          className={`my-4 ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        />

        <div
          className={`text-sm font-semibold mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Subscriptions
        </div>

        {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
        {isError && (
          <p className="text-sm text-red-500">Failed to load subscriptions.</p>
        )}

        <div className="space-y-2">
          {channels?.map((ch) => (
            <Button
              key={ch.id}
              variant="ghost"
              onClick={() => {
                router.push(`/channel/${ch.id}`);
                onClose?.();
              }}
              className={`w-full justify-start p-2 rounded-md ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-zinc-800"
                  : "text-gray-900 hover:text-gray-700 hover:bg-zinc-100"
              }`}
            >
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-6 h-6 rounded-full mr-3 object-cover"
              />
              <span>{ch.name}</span>
            </Button>
          ))}

          {!isLoading && channels?.length === 0 && (
            <p className="text-sm text-gray-500">No subscriptions yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
