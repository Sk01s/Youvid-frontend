import { useRef } from "react";
import useCanvasRenderer from "./use-canvas-renderer";
import useControlsVisibility from "./use-controls-visibility";
import useFullscreen from "./use-fullscreen";
import useHlsPlayer from "./use-hls-player";
import useKeyboardShortcuts from "./use-keyboard-shortcuts";
import usePlayerControls from "./use-player-controls";
import useSeekHandlers from "./use-seek-handlers";
import useVideoState, { VideoPlayerState } from "./use-video-state";

export interface QualityLevel {
  id: number;
  label: string;
  resolution?: string;
  height: number;
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

const useVideoPlayer = (
  hlsUrl: string,
  thumbnailUrl: string
): [
  VideoPlayerState,
  VideoPlayerActions,
  React.RefObject<HTMLDivElement | null>,
  React.RefObject<HTMLCanvasElement | null>,
  React.RefObject<HTMLVideoElement | null>,
  React.RefObject<HTMLDivElement | null>
] => {
  // Refs
  const playerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef(0);

  // State management
  const { state, updateState, formatTime } = useVideoState();

  // HLS player setup
  const { setQuality } = useHlsPlayer({
    hlsUrl,
    videoRef,
    updateState,
    durationRef,
  });

  // Canvas rendering
  useCanvasRenderer({ canvasRef, videoRef });

  // Controls visibility
  const { hideControlsAfterDelay, hideControlsImmediately } =
    useControlsVisibility({ state, updateState });

  // Player controls
  const controls = usePlayerControls({
    videoRef,
    state,
    updateState,
    hideControlsAfterDelay,
  });

  // Fullscreen handling
  const { toggleFullscreen } = useFullscreen({
    playerRef,
    updateState,
    hideControlsAfterDelay,
  });

  // Seek handlers
  const seekHandlers = useSeekHandlers({
    progressBarRef,
    videoRef,
    durationRef,
    state,
    updateState,
    hideControlsAfterDelay,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    state,
    controls,
    hideControlsAfterDelay,
    videoRef,
  });

  // Exposed actions
  const actions: VideoPlayerActions = {
    ...controls,
    ...seekHandlers,
    toggleFullscreen,
    toggleSettings: controls.toggleSettings,
    handleQualityChange: setQuality,
    handlePlaybackRateChange: controls.handlePlaybackRateChange,
    formatTime,
    setIsHovered: (value) => updateState({ isHovered: value }),
    hideControlsAfterDelay,
    hideControlsImmediately,
    openPlaybackMenu: controls.openPlaybackMenu,
    openQualityMenu: controls.openQualityMenu,
  };

  return [state, actions, playerRef, canvasRef, videoRef, progressBarRef];
};

export default useVideoPlayer;
