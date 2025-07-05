import { useEffect } from "react";
import type { PlayerControls } from "./use-player-controls";
import type { VideoPlayerState } from "./use-video-state";

type KeyboardShortcutsParams = {
  state: VideoPlayerState;
  controls: PlayerControls;
  hideControlsAfterDelay: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function useKeyboardShortcuts({
  state,
  controls,
  hideControlsAfterDelay,
  videoRef,
}: KeyboardShortcutsParams) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
        case "k":
          controls.togglePlay();
          e.preventDefault();
          break;
        case "f":
          controls.togglePlay();
          e.preventDefault();
          break;
        case "m":
          controls.toggleMute();
          e.preventDefault();
          break;
        case "ArrowLeft":
          const newTimeLeft = Math.max(state.currentTime - 5, 0);
          videoRef.current.currentTime = newTimeLeft;
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowRight":
          const newTimeRight = Math.min(state.currentTime + 5, state.duration);
          videoRef.current.currentTime = newTimeRight;
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowUp":
          const newVolumeUp = Math.min(state.volume + 5, 100);
          videoRef.current.volume = newVolumeUp / 100;
          hideControlsAfterDelay();
          e.preventDefault();
          break;
        case "ArrowDown":
          const newVolumeDown = Math.max(state.volume - 5, 0);
          videoRef.current.volume = newVolumeDown / 100;
          hideControlsAfterDelay();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, controls, hideControlsAfterDelay, videoRef]);
}
