import React from "react";
import {
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import { QualityLevel } from "@/hooks/player/use-video-player";

interface ControlButtonsProps {
  playing: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isFullscreen: boolean;
  qualities: QualityLevel[];
  selectedQuality: number | null;
  formatTime: (time: number) => string;
  togglePlay: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  openPlaybackMenu: () => void;
  toggleSettings: () => void;
  toggleFullscreen: () => void;
  openQualityMenu: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  playing,
  volume,
  isMuted,
  currentTime,
  duration,
  playbackRate,
  isFullscreen,
  qualities,
  selectedQuality,
  formatTime,
  togglePlay,
  handleVolumeChange,
  toggleMute,
  openPlaybackMenu,
  toggleSettings,
  toggleFullscreen,
  openQualityMenu,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="text-white focus:outline-none"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Volume */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="text-white"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={20} />
          ) : volume < 50 ? (
            <Volume1 size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 accent-white cursor-pointer"
        />
      </div>

      {/* Time display */}
      <div className="text-white text-sm font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>

    <div className="flex items-center space-x-3">
      {/* Settings */}
      <button
        onClick={toggleSettings}
        className="text-white p-1 rounded hover:bg-white/10"
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="text-white"
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
    </div>
  </div>
);

export default ControlButtons;
