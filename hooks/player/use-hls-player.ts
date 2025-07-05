import { useEffect, useRef } from "react";
import Hls from "hls.js";
import type { VideoPlayerState } from "./use-video-state";

type HlsPlayerParams = {
  hlsUrl: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  updateState: (update: Partial<VideoPlayerState>) => void;
  durationRef: React.MutableRefObject<number>;
};

export default function useHlsPlayer({
  hlsUrl,
  videoRef,
  updateState,
  durationRef,
}: HlsPlayerParams) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

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
        updateState({
          videoLoaded: true,
          duration: video.duration,
        });

        durationRef.current = video.duration;

        const levels = data.levels.map((level: any, index: number) => ({
          id: index,
          label: level.name || `${level.height}p`,
          resolution: `${level.width}x${level.height}`,
          height: level.height,
        }));

        // Sort by quality (highest first)
        levels.sort((a: any, b: any) => b.height - a.height);

        updateState({
          qualities: levels,
          selectedQuality: hls.currentLevel,
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        updateState({ selectedQuality: data.level });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        updateState({
          videoLoaded: true,
          duration: video.duration,
        });
        durationRef.current = video.duration;
      });
    }

    // Video event handlers
    const handleTimeUpdate = () => {
      updateState({ currentTime: video.currentTime });
    };

    const handleDurationChange = () => {
      updateState({ duration: video.duration });
      durationRef.current = video.duration;
    };

    const handlePlay = () => {
      updateState({ playing: true });
    };

    const handlePause = () => {
      updateState({ playing: false });
    };

    const handleLoadedMetadata = () => {
      updateState({ duration: video.duration });
      durationRef.current = video.duration;
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);

      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [hlsUrl, updateState, videoRef, durationRef]);

  return {
    hlsRef,
    setQuality: (levelId: number) => {
      if (hlsRef.current) {
        hlsRef.current.currentLevel = levelId;
        updateState({
          selectedQuality: levelId,
          showQualityMenu: false,
          showSettings: false,
        });
      }
    },
  };
}
