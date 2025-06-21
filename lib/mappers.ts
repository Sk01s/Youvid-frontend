// lib/mappers.ts

import { CommentInteraction, Video, VideoInteraction } from "./types";

// Helper function to convert snake_case to camelCase
const toCamel = (str: string) =>
  str.replace(/(_\w)/g, (match) => match[1].toUpperCase());

// Helper to format duration
const formatDuration = (seconds: number | null): string => {
  if (seconds === null || isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
};

// Type conversion map
const TYPE_CONVERSIONS: Record<string, (value: any) => any> = {
  id: (v) => String(v),
  user_id: (v) => String(v),
  channel_id: (v) => String(v),
  video_id: (v) => String(v),
  comment_id: (v) => String(v),
  category_id: (v) => String(v),
  created_at: (v) => v.toString(),
  duration: formatDuration,
};

// Special key handlers
const KEY_ALIASES: Record<string, string> = {
  avatar_url: "avatarUrl",
  thumbnail_key: "thumbnail",
  published_at: "publishedAt",
  category_id: "categoryID",
  channel_id: "channelId",
  video_id: "videoId",
  is_liked: "isLiked",
  is_saved: "isSaved",
  is_subscribed: "isSubscribed",
  is_disliked: "isDisliked",
};

export const mapToFrontend = <T = any>(
  data: Record<string, any>,
  options: {
    customMappers?: Record<string, (value: any) => any>;
    include?: string[];
    exclude?: string[];
  } = {}
): T => {
  const result: Record<string, any> = {};
  const { customMappers = {}, include, exclude } = options;

  for (let [key, value] of Object.entries(data)) {
    // Skip excluded keys
    if (exclude && exclude.includes(key)) {
      continue;
    }

    // Apply transformations
    const mapper = customMappers[key] || TYPE_CONVERSIONS[key];
    if (mapper) {
      try {
        value = mapper(value);
      } catch (error) {}
    }

    // Rename keys
    const newKey = KEY_ALIASES[key] || toCamel(key);
    // Filter included keys if specified
    if (!include || include.includes(key)) {
      result[newKey] = value;
    } else {
    }
  }
  return result as T;
};
// Specialized video mapper with interaction merging
export const mapVideo = (
  videoData: Record<string, any>,
  interaction: Record<string, any>
) => {
  const base = mapToFrontend<Video>(videoData, {
    customMappers: {
      created_at: (v) => v.toISOString(),
      duration: formatDuration,
    },
    exclude: [
      "status",
      "processed_filename",
      "original_filename",
      "error_message",
    ],
  });

  return {
    ...base,
    ...mapToFrontend<VideoInteraction>(interaction),
  };
};

// Specialized comment mapper with author and interactions
export const mapComment = (
  commentData: Record<string, any>,
  authorData: Record<string, any>,
  interaction: Record<string, any>
) => {
  const base = mapToFrontend<Comment>(commentData, {
    customMappers: {
      created_at: (v) => v.toISOString(),
    },
    exclude: ["user_id"],
  });

  const author = mapToFrontend<{
    author: string;
    authorAvatar: string;
  }>(authorData, {
    include: ["username", "avatar_url"],
  });

  return {
    ...base,
    ...author,
    ...mapToFrontend<CommentInteraction>(interaction),
  };
};
