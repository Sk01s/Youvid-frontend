import { useState, useRef, useEffect, useCallback, RefObject } from "react";
import Hls from "hls.js";

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

const useVideoPlayer = (
  hlsUrl: string,
  thumbnailUrl: string
): [
  VideoPlayerState,
  VideoPlayerActions,
  RefObject<HTMLDivElement | null>,
  RefObject<HTMLCanvasElement | null>,
  RefObject<HTMLVideoElement | null>,
  RefObject<HTMLDivElement | null>
] => {
  // Player states
  const [state, setState] = useState<VideoPlayerState>({
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
  });

  // Refs
  const playerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number>(0);
  const hlsRef = useRef<Hls | null>(null);
  const durationRef = useRef(0);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (state.playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((e) => console.error("Play error:", e));
    }
    hideControlsAfterDelay();
  }, [state.playing]);

  // Handle volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseInt(e.target.value);
      setState((prev) => ({
        ...prev,
        volume: newVolume,
        isMuted: newVolume === 0,
      }));

      if (videoRef.current) {
        videoRef.current.volume = newVolume / 100;
      }
    },
    []
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !state.isMuted;
    setState((prev) => ({ ...prev, isMuted: newMuted }));

    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }

    hideControlsAfterDelay();
  }, [state.isMuted]);

  // Handle progress bar click
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.isSeeking) return;
      if (!progressBarRef.current || !videoRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * state.duration;

      setState((prev) => ({ ...prev, currentTime: newTime }));
      videoRef.current.currentTime = newTime;

      hideControlsAfterDelay();
    },
    [state.duration, state.isSeeking]
  );

  // Handle progress bar hover for preview
  const handleProgressHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || state.isSeeking) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const previewTime = percent * state.duration;

      setState((prev) => ({
        ...prev,
        seekPreviewTime: previewTime,
        seekPreviewVisible: true,
      }));
    },
    [state.duration, state.isSeeking]
  );

  // Hide seek preview
  const hideSeekPreview = useCallback(() => {
    if (!state.isSeeking) {
      setState((prev) => ({ ...prev, seekPreviewVisible: false }));
    }
  }, [state.isSeeking]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
      setState((prev) => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: false }));
    }

    hideControlsAfterDelay();
  }, []);

  // Toggle settings menu
  const toggleSettings = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showSettings: !prev.showSettings,
      showQualityMenu: false,
      showPlaybackMenu: false,
    }));
  }, []);

  // Change quality
  const handleQualityChange = useCallback((levelId: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelId;
      setState((prev) => ({ ...prev, selectedQuality: levelId }));
    }
    setState((prev) => ({
      ...prev,
      showQualityMenu: false,
      showSettings: false,
    }));
    hideControlsAfterDelay();
  }, []);

  // Change playback rate
  const handlePlaybackRateChange = useCallback((rate: number) => {
    setState((prev) => ({
      ...prev,
      playbackRate: rate,
      showPlaybackMenu: false,
      showSettings: false,
    }));

    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }

    hideControlsAfterDelay();
  }, []);
  const hideControlsImmediately = useCallback(() => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = null;
    }
    setState((prev) => ({ ...prev, showControls: false }));
  }, []);

  // Hide controls after delay
  const hideControlsAfterDelay = useCallback(() => {
    if (state.isSeeking) return;

    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }

    setState((prev) => ({ ...prev, showControls: true }));
    controlsTimeout.current = setTimeout(() => {
      if (state.playing) {
        setState((prev) => ({ ...prev, showControls: false }));
      }
    }, 5000); // Changed to 5 seconds
  }, [state.playing, state.isSeeking]);

  // Dragging handlers
  const handleSeekMove = useCallback((e: MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );
    const newTime = percent * durationRef.current;

    setState((prev) => ({
      ...prev,
      currentTime: newTime,
      seekPreviewTime: newTime,
      seekPreviewVisible: true,
    }));
    videoRef.current.currentTime = newTime;
  }, []);

  const handleSeekEnd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSeeking: false,
      seekPreviewVisible: false,
    }));
    document.removeEventListener("mousemove", handleSeekMove);
    document.removeEventListener("mouseup", handleSeekEnd);
    hideControlsAfterDelay();
  }, [handleSeekMove, hideControlsAfterDelay]);

  const handleSeekStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isSeeking: true, showControls: true }));
      document.addEventListener("mousemove", handleSeekMove);
      document.addEventListener("mouseup", handleSeekEnd);
    },
    [handleSeekEnd, handleSeekMove]
  );

  // New actions for opening menus
  const openPlaybackMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showPlaybackMenu: true,
      showQualityMenu: false,
      showSettings: false,
    }));
  }, []);

  const openQualityMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showQualityMenu: true,
      showPlaybackMenu: false,
      showSettings: false,
    }));
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
        case "k":
          togglePlay();
          e.preventDefault();
          break;
        case "f":
          toggleFullscreen();
          e.preventDefault();
          break;
        case "m":
          toggleMute();
          e.preventDefault();
          break;
        case "ArrowLeft":
          setState((prev) => {
            const newTime = Math.max(prev.currentTime - 5, 0);
            videoRef.current!.currentTime = newTime;
            return { ...prev, currentTime: newTime };
          });
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowRight":
          setState((prev) => {
            const newTime = Math.min(prev.currentTime + 5, state.duration);
            videoRef.current!.currentTime = newTime;
            return { ...prev, currentTime: newTime };
          });
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowUp":
          setState((prev) => {
            const newVolume = Math.min(prev.volume + 5, 100);
            videoRef.current!.volume = newVolume / 100;
            return { ...prev, volume: newVolume };
          });
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowDown":
          setState((prev) => {
            const newVolume = Math.max(prev.volume - 5, 0);
            videoRef.current!.volume = newVolume / 100;
            return { ...prev, volume: newVolume };
          });
          hideControlsAfterDelay();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hideControlsAfterDelay,
    state.duration,
    toggleFullscreen,
    toggleMute,
    togglePlay,
  ]);

  // Setup HLS and canvas rendering
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !hlsUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true,
      });

      hlsRef.current = hls;

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      // Get available quality levels
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setState((prev) => ({
          ...prev,
          videoLoaded: true,
          duration: video.duration,
        }));
        durationRef.current = video.duration;

        const levels = data.levels.map((level: any, index: number) => ({
          id: index,
          label: level.name || `${level.height}p`,
          resolution: `${level.width}x${level.height}`,
          height: level.height,
        }));

        // Sort by quality (highest first)
        levels.sort((a: any, b: any) => b.height - a.height);

        setState((prev) => ({
          ...prev,
          qualities: levels,
          selectedQuality: hls.currentLevel,
        }));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setState((prev) => ({ ...prev, selectedQuality: data.level }));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        setState((prev) => ({
          ...prev,
          videoLoaded: true,
          duration: video.duration,
        }));
        durationRef.current = video.duration;
      });
    }

    // Set canvas size to match video dimensions
    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Animation loop for rendering video to canvas
    const renderFrame = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    // Start rendering
    renderFrame();

    // Video event handlers
    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: video.currentTime }));
    };

    const handleDurationChange = () => {
      setState((prev) => ({ ...prev, duration: video.duration }));
      durationRef.current = video.duration;
    };

    const handlePlay = () => {
      setState((prev) => ({ ...prev, playing: true }));
    };

    const handlePause = () => {
      setState((prev) => ({ ...prev, playing: false }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: video.duration }));
      durationRef.current = video.duration;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", setCanvasSize);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);

      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [hlsUrl]);

  // Auto-hide controls when playing
  useEffect(() => {
    if (state.playing) {
      hideControlsAfterDelay();
    } else {
      setState((prev) => ({ ...prev, showControls: true }));
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [state.playing, hideControlsAfterDelay]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Clean up drag listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleSeekMove);
      document.removeEventListener("mouseup", handleSeekEnd);
    };
  }, [handleSeekEnd, handleSeekMove]);

  // Exposed actions
  const actions: VideoPlayerActions = {
    togglePlay,
    handleVolumeChange,
    toggleMute,
    handleProgressClick,
    handleProgressHover,
    hideSeekPreview,
    toggleFullscreen,
    toggleSettings,
    handleQualityChange,
    handlePlaybackRateChange,
    handleSeekStart,
    formatTime,
    setIsHovered: (value) =>
      setState((prev) => ({ ...prev, isHovered: value })),
    hideControlsAfterDelay,
    hideControlsImmediately,
    openPlaybackMenu,
    openQualityMenu,
  };

  return [state, actions, playerRef, canvasRef, videoRef, progressBarRef];
};

export default useVideoPlayer;
