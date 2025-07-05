import { useRef, useEffect, useCallback } from "react";
import type { UpdateStateFn } from "./use-video-state";

export default function useControlsVisibility({
  state,
  updateState,
}: {
  state: {
    playing: boolean;
    isSeeking: boolean;
  };
  updateState: UpdateStateFn;
}) {
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const hideControlsImmediately = useCallback(() => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = null;
    }
    updateState({ showControls: false });
  }, [updateState]);

  // Hide controls after delay
  const hideControlsAfterDelay = useCallback(() => {
    if (state.isSeeking) return;

    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }

    updateState({ showControls: true });
    controlsTimeout.current = setTimeout(() => {
      if (state.playing) {
        updateState({ showControls: false });
      }
    }, 5000);
  }, [state.playing, state.isSeeking, updateState]);

  // Auto-hide controls when playing
  useEffect(() => {
    if (state.playing) {
      hideControlsAfterDelay();
    } else {
      updateState({ showControls: true });
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [state.playing, hideControlsAfterDelay, updateState]);

  return {
    hideControlsAfterDelay,
    hideControlsImmediately,
  };
}
