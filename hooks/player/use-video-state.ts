import { useCallback, useState } from "react";
import type { QualityLevel } from "@/hooks/player/use-video-player";

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

export type UpdateStateFn = (update: Partial<VideoPlayerState>) => void;

export const initialState: VideoPlayerState = {
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  playbackRate: 1.0,
  showControls: true,
  isFullscreen: false,
  showSettings: false,
  showQualityMenu: false,
  showPlaybackMenu: false,
  isHovered: false,
  seekPreviewTime: 0,
  seekPreviewVisible: false,
  videoLoaded: false,
  qualities: [],
  selectedQuality: null,
  isSeeking: false,
};

export default function useVideoState(initial = initialState) {
  const [state, setState] = useState<VideoPlayerState>(initial);

  // Stabilize updateState with useCallback
  const updateState = useCallback((update: Partial<VideoPlayerState>) => {
    setState((prev) => ({ ...prev, ...update }));
  }, []); // Empty dependency array makes this stable

  // Stabilize formatTime
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  return {
    state,
    setState,
    updateState,
    formatTime,
  };
}
