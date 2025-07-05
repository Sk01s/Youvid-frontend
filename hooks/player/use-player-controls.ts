import { useCallback } from "react";
import type { VideoPlayerState } from "./use-video-state";
import type { UpdateStateFn } from "./use-video-state";

type PlayerControlsParams = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  state: VideoPlayerState;
  updateState: UpdateStateFn;
  hideControlsAfterDelay: () => void;
};

// Define the PlayerControls type
export type PlayerControls = {
  togglePlay: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  handlePlaybackRateChange: (rate: number) => void;
  toggleSettings: () => void;
  openPlaybackMenu: () => void;
  openQualityMenu: () => void;
};

export default function usePlayerControls({
  videoRef,
  state,
  updateState,
  hideControlsAfterDelay,
}: PlayerControlsParams): PlayerControls {
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (state.playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((e) => console.error("Play error:", e));
    }
    hideControlsAfterDelay();
  }, [state.playing, videoRef, hideControlsAfterDelay]);

  // Handle volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseInt(e.target.value);
      updateState({
        volume: newVolume,
        isMuted: newVolume === 0,
      });

      if (videoRef.current) {
        videoRef.current.volume = newVolume / 100;
      }
    },
    [updateState, videoRef]
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !state.isMuted;
    updateState({ isMuted: newMuted });

    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }

    hideControlsAfterDelay();
  }, [state.isMuted, updateState, videoRef, hideControlsAfterDelay]);

  // Change playback rate
  const handlePlaybackRateChange = useCallback(
    (rate: number) => {
      updateState({
        playbackRate: rate,
        showPlaybackMenu: false,
        showSettings: false,
      });

      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }

      hideControlsAfterDelay();
    },
    [updateState, videoRef, hideControlsAfterDelay]
  );

  // Toggle settings menu
  const toggleSettings = useCallback(() => {
    updateState({
      showSettings: !state.showSettings,
      showQualityMenu: false,
      showPlaybackMenu: false,
    });
  }, [state.showSettings, updateState]);

  // New actions for opening menus
  const openPlaybackMenu = useCallback(() => {
    updateState({
      showPlaybackMenu: true,
      showQualityMenu: false,
      showSettings: false,
    });
  }, [updateState]);

  const openQualityMenu = useCallback(() => {
    updateState({
      showQualityMenu: true,
      showPlaybackMenu: false,
      showSettings: false,
    });
  }, [updateState]);

  return {
    togglePlay,
    handleVolumeChange,
    toggleMute,
    handlePlaybackRateChange,
    toggleSettings,
    openPlaybackMenu,
    openQualityMenu,
  };
}
