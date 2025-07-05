import React from "react";
import { QualityLevel } from "@/hooks/player/use-video-player";

interface SettingsMenuProps {
  showSettings: boolean;
  showQualityMenu: boolean;
  showPlaybackMenu: boolean;
  qualities: QualityLevel[];
  selectedQuality: number | null;
  playbackRate: number;
  handleQualityChange: (id: number) => void;
  handlePlaybackRateChange: (rate: number) => void;
  openQualityMenu: () => void;
  openPlaybackMenu: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  showSettings,
  showQualityMenu,
  showPlaybackMenu,
  qualities,
  selectedQuality,
  playbackRate,
  handleQualityChange,
  handlePlaybackRateChange,
  openQualityMenu,
  openPlaybackMenu,
}) => {
  const playbackRates = [
    { label: "0.25x", value: 0.25 },
    { label: "0.5x", value: 0.5 },
    { label: "Normal", value: 1.0 },
    { label: "1.25x", value: 1.25 },
    { label: "1.5x", value: 1.5 },
    { label: "2x", value: 2.0 },
  ];

  return (
    <>
      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded shadow-lg z-20 overflow-hidden">
          {qualities.length > 0 && (
            <button
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
              onClick={openQualityMenu}
            >
              <div className="flex justify-between items-center">
                <span>Quality</span>
                <span className="text-gray-400">
                  {selectedQuality !== null &&
                    qualities.find((quality) => quality.id === selectedQuality)
                      ?.label}
                </span>
              </div>
            </button>
          )}

          <button
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
            onClick={openPlaybackMenu}
          >
            <div className="flex justify-between items-center">
              <span>Playback speed</span>
              <span className="text-gray-400">{playbackRate}x</span>
            </div>
          </button>

          <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">
            Subtitles/CC
          </button>
        </div>
      )}

      {showQualityMenu && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            Quality
          </div>
          {qualities.map((quality: QualityLevel) => (
            <button
              key={quality.id}
              className={`block w-full text-left px-4 py-2 text-sm ${
                quality.id === selectedQuality
                  ? "bg-red-600 text-white"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => handleQualityChange(quality.id)}
            >
              {quality.label} {quality.resolution && `(${quality.resolution})`}
            </button>
          ))}
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              -1 === selectedQuality
                ? "bg-red-600 text-white"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => handleQualityChange(-1)}
          >
            Auto
          </button>
        </div>
      )}

      {showPlaybackMenu && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 rounded shadow-lg z-20 overflow-hidden">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            Playback speed
          </div>
          {playbackRates.map((rate) => (
            <button
              key={rate.value}
              className={`block w-full text-left px-4 py-2 text-sm ${
                rate.value === playbackRate
                  ? "bg-red-600 text-white"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => handlePlaybackRateChange(rate.value)}
            >
              {rate.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default SettingsMenu;
