// lib/api.ts

import type { Channel, Video, Comment } from "./types";

export const mockChannels: Channel[] = [
  {
    id: "nature-explorer",
    name: "Nature Explorer",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 420000,
    verified: true,
  },
  {
    id: "code-academy",
    name: "Code Academy",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 310000,
    verified: false,
  },
  {
    id: "gaming-central",
    name: "Gaming Central",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 790000,
    verified: true,
  },
  {
    id: "chefs-kitchen",
    name: "Chef's Kitchen",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 150000,
    verified: false,
  },
  {
    id: "space-news",
    name: "Space News",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 500000,
    verified: true,
  },
  {
    id: "fit-life",
    name: "Fit Life",
    avatar: "/placeholder.svg?height=36&width=36",
    subscribers: 270000,
    verified: false,
  },
];

// Videos
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Amazing Nature Documentary - Wildlife in 4K",
    description: "Explore the beauty of nature in stunning 4K resolution",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "15:42",
    views: 1250000,
    publishedAt: "2024-01-15T10:00:00Z",
    channelId: "nature-explorer",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
  {
    id: "2",
    title: "Learn React in 30 Minutes - Complete Tutorial",
    description: "Master React fundamentals in this comprehensive tutorial",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "30:15",
    views: 890000,
    publishedAt: "2024-01-14T14:30:00Z",
    channelId: "code-academy",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
  {
    id: "3",
    title: "Epic Gaming Moments - Best Highlights 2024",
    description: "The most incredible gaming moments from this year",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "12:33",
    views: 2100000,
    publishedAt: "2024-01-13T20:15:00Z",
    channelId: "gaming-central",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
  {
    id: "4",
    title: "Cooking Masterclass - Italian Pasta Secrets",
    description: "Learn authentic Italian pasta techniques from a master chef",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "25:18",
    views: 650000,
    publishedAt: "2024-01-12T16:45:00Z",
    channelId: "chefs-kitchen",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
  {
    id: "5",
    title: "Space Exploration - Mars Mission Updates",
    description: "Latest updates from the Mars exploration mission",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "18:27",
    views: 1800000,
    publishedAt: "2024-01-11T12:00:00Z",
    channelId: "space-news",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
  {
    id: "6",
    title: "Fitness Transformation - 90 Day Journey",
    description: "Follow an incredible 90-day fitness transformation",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "22:45",
    views: 950000,
    publishedAt: "2024-01-10T08:30:00Z",
    channelId: "fit-life",
    isLiked: false,
    isSaved: false,
    isSubscribed: false,
    categoryID: "",
  },
];

export const mockComments: Comment[] = [
  {
    id: "1",
    videoId: "1",
    author: "User One",
    authorAvatar: "",
    text: "Great video!",
    date: "2 days ago",
    likes: 12,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
  },
  {
    id: "2",
    videoId: "1",
    author: "User Two",
    authorAvatar: "",
    text: "Thanks for sharing.",
    date: "1 day ago",
    likes: 5,
    dislikes: 1,
    isLiked: false,
    isDisliked: false,
  },
];
// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchVideos = async (query: string): Promise<Video[]> => {
  await delay(600); // Simulate network delay
  return mockVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const subscribeToChannel = async (channelId: number): Promise<Video> => {
  await delay(200);
  const video = mockVideos.find((v) => v.channelId === channelId);
  if (!video) throw new Error("Channel not found");
  video.isSubscribed = !video.isSubscribed;
  return { ...video };
};

// Comment API functions

export const fetchComments = async (videoId: string): Promise<Comment[]> => {
  await delay(800);
  console.log(videoId);
  return mockComments.filter((comment) => comment.videoId === videoId) || [];
};

export const addComment = async (
  videoId: string,
  text: string
): Promise<Comment> => {
  await delay(500);
  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    videoId,
    author: "Current User",
    authorAvatar: "",
    text,
    date: "Just now",
    likes: 0,
    dislikes: 0,
    isLiked: false,
    isDisliked: false,
  };
  mockComments.push(newComment);
  console.log(mockComments);
  return newComment;
};

export const likeComment = async (commentId: string): Promise<Comment> => {
  await delay(300);
  const comment = mockComments.find((c) => c.id === commentId);
  if (!comment) throw new Error("Comment not found");

  if (comment.isLiked) {
    comment.likes--;
    comment.isLiked = false;
  } else {
    comment.likes++;
    comment.isLiked = true;
    // If previously disliked, undo that
    if (comment.isDisliked) {
      comment.dislikes--;
      comment.isDisliked = false;
    }
  }

  return { ...comment };
};

export const dislikeComment = async (commentId: string): Promise<Comment> => {
  await delay(300);
  const comment = mockComments.find((c) => c.id === commentId);
  if (!comment) throw new Error("Comment not found");

  if (comment.isDisliked) {
    comment.dislikes--;
    comment.isDisliked = false;
  } else {
    comment.dislikes++;
    comment.isDisliked = true;
    // If previously liked, undo that
    if (comment.isLiked) {
      comment.likes--;
      comment.isLiked = false;
    }
  }

  return { ...comment };
};
