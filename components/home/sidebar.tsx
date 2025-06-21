"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Home, Video, Clock, Bookmark, ThumbsUp, X } from "lucide-react";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const pathname = usePathname();
  const router = useRouter();

  const mainItems: SidebarItem[] = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Video, label: "Subscriptions", path: "/subscriptions" },
    { icon: Clock, label: "History", path: "/history" },
    { icon: Bookmark, label: "Watch later", path: "/later" },
    { icon: ThumbsUp, label: "Liked videos", path: "/likes" },
  ];

  return (
    <aside
      className={`w-60 transition-colors duration-300 md:max-h-[calc(100vh-4.3rem)] h-full overflow-y-scroll ${
        theme === "dark"
          ? "bg-zinc-950 md:bg-opacity-25 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4 relative">
        {/* Mobile Close Button */}
        {onClose && (
          <Button
            size="icon"
            onClick={onClose}
            className="md:hidden absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {/* Main Navigation Items */}
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

        {/* Divider */}
        <hr
          className={`my-4 ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        />

        {/* Subscriptions Section */}
        <div
          className={`text-sm font-semibold mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Subscriptions
        </div>
        <div className="space-y-2">
          {["Channel 1", "Channel 2", "Channel 3"].map((channel, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded-md ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full mr-3 ${
                  theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"
                }`}
              />
              <span
                className={theme === "dark" ? "text-gray-300" : "text-gray-900"}
              >
                {channel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
