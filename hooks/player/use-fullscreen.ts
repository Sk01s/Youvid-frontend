import { useCallback, useEffect } from "react";
import type { VideoPlayerState } from "./use-video-state";
import type { UpdateStateFn } from "./use-video-state";

export default function useFullscreen({
  playerRef,
  updateState,
  hideControlsAfterDelay,
}: {
  playerRef: React.RefObject<HTMLDivElement | null>;
  updateState: UpdateStateFn;
  hideControlsAfterDelay: () => void;
}) {
  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
      updateState({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      updateState({ isFullscreen: false });
    }

    hideControlsAfterDelay();
  }, [playerRef, updateState, hideControlsAfterDelay]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateState({
        isFullscreen: !!document.fullscreenElement,
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [updateState]);

  return { toggleFullscreen };
}
