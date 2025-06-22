// lib/types.ts
export interface VideoInteraction {
  isLiked: boolean;
  isSaved: boolean;
}
export interface Video extends VideoInteraction {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
  channelName: string;
  channelAvatar: string;
  channelId: number;
  categoryId: string;
  hlsUrl?: string;
}
export interface Category {
  id: string;
  name: string;
}
export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  verified: boolean;
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
export interface ApiError {
  status: number;
  message: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: ApiError | null;
}
export interface CommentInteraction {
  isLiked: boolean;
  isDisliked: boolean;
}
export interface Comment extends CommentInteraction {
  id: string;
  videoId: string;
  username: string;
  avatarUrl: string;
  text: string;
  createdAt: string;
  likes: number;
  dislikes: number;
}
