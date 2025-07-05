import { useCallback } from "react";
import type { VideoPlayerState } from "./use-video-state";
import type { UpdateStateFn } from "./use-video-state";

type SeekHandlersParams = {
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  durationRef: React.MutableRefObject<number>;
  state: VideoPlayerState;
  updateState: UpdateStateFn;
  hideControlsAfterDelay: () => void;
};

export default function useSeekHandlers({
  progressBarRef,
  videoRef,
  durationRef,
  state,
  updateState,
  hideControlsAfterDelay,
}: SeekHandlersParams) {
  // Handle progress bar click
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.isSeeking) return;
      if (!progressBarRef.current || !videoRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * state.duration;

      updateState({ currentTime: newTime });
      videoRef.current.currentTime = newTime;

      hideControlsAfterDelay();
    },
    [
      state.duration,
      state.isSeeking,
      updateState,
      videoRef,
      progressBarRef,
      hideControlsAfterDelay,
    ]
  );

  // Handle progress bar hover for preview
  const handleProgressHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || state.isSeeking) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const previewTime = percent * state.duration;

      updateState({
        seekPreviewTime: previewTime,
        seekPreviewVisible: true,
      });
    },
    [state.duration, state.isSeeking, updateState, progressBarRef]
  );

  // Hide seek preview
  const hideSeekPreview = useCallback(() => {
    if (!state.isSeeking) {
      updateState({ seekPreviewVisible: false });
    }
  }, [state.isSeeking, updateState]);

  // Dragging handlers
  const handleSeekMove = useCallback(
    (e: MouseEvent) => {
      if (!progressBarRef.current || !videoRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.min(
        Math.max((e.clientX - rect.left) / rect.width, 0),
        1
      );
      const newTime = percent * durationRef.current;

      updateState({
        currentTime: newTime,
        seekPreviewTime: newTime,
        seekPreviewVisible: true,
      });
      videoRef.current.currentTime = newTime;
    },
    [progressBarRef, videoRef, durationRef, updateState]
  );

  const handleSeekEnd = useCallback(() => {
    updateState({
      isSeeking: false,
      seekPreviewVisible: false,
    });
    document.removeEventListener("mousemove", handleSeekMove);
    document.removeEventListener("mouseup", handleSeekEnd);
    hideControlsAfterDelay();
  }, [handleSeekMove, hideControlsAfterDelay, updateState]);

  const handleSeekStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      updateState({ isSeeking: true, showControls: true });
      document.addEventListener("mousemove", handleSeekMove);
      document.addEventListener("mouseup", handleSeekEnd);
    },
    [handleSeekEnd, handleSeekMove, updateState]
  );

  return {
    handleProgressClick,
    handleProgressHover,
    hideSeekPreview,
    handleSeekStart,
  };
}
