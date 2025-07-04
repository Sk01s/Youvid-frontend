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
  verifying: boolean;
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
export interface QualityLevel {
  id: number;
  label: string;
  resolution?: string;
  height: number;
}

export interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  showControls: boolean;
  isFullscreen: boolean;
  showSettings: boolean;
  showQualityMenu: boolean;
  showPlaybackMenu: boolean;
  isHovered: boolean;
  seekPreviewTime: number;
  seekPreviewVisible: boolean;
  videoLoaded: boolean;
  qualities: QualityLevel[];
  selectedQuality: number | null;
  isSeeking: boolean;
}

export interface VideoPlayerActions {
  togglePlay: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleProgressHover: (e: React.MouseEvent<HTMLDivElement>) => void;
  hideSeekPreview: () => void;
  toggleFullscreen: () => void;
  toggleSettings: () => void;
  handleQualityChange: (levelId: number) => void;
  handlePlaybackRateChange: (rate: number) => void;
  handleSeekStart: (e: React.MouseEvent) => void;
  formatTime: (seconds: number) => string;
  setIsHovered: (value: boolean) => void;
  hideControlsAfterDelay: () => void;
  hideControlsImmediately: () => void;
  openPlaybackMenu: () => void;
  openQualityMenu: () => void;
}
