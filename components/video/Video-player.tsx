"use client";
import React, { useState } from "react";
import useVideoPlayer from "@/hooks/player/use-video-player";
import LoadingOverlay from "./loading-overlay";
import ThumbnailOverlay from "./thumbnail-overlay";
import SeekPreview from "./seek-preview";
import ControlsOverlay from "./controls-overlay";
import ProgressBar from "./progress-bar";
import ControlButtons from "./control-buttons";
import SettingsMenu from "./settings-menu";
import CenterPlayButton from "./center-play-button";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  hlsUrl: string;
  thumbnailUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ hlsUrl, thumbnailUrl }) => {
  const [state, actions, playerRef, canvasRef, videoRef, progressBarRef] =
    useVideoPlayer(hlsUrl, thumbnailUrl);

  const {
    playing,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    showControls,
    isFullscreen,
    showSettings,
    showQualityMenu,
    showPlaybackMenu,
    isHovered,
    seekPreviewTime,
    seekPreviewVisible,
    videoLoaded,
    qualities,
    selectedQuality,
    isSeeking,
  } = state;

  const {
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
    setIsHovered,
    hideControlsAfterDelay,
    hideControlsImmediately,
    openPlaybackMenu,
    openQualityMenu,
  } = actions;

  // Track if mouse is over play button specifically
  const [isOverPlayButton, setIsOverPlayButton] = useState(false);

  return (
    <div
      ref={playerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => {
        setIsHovered(true);
        hideControlsAfterDelay(); // Show controls on enter
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        hideControlsImmediately(); // Hide immediately on leave
      }}
      onMouseMove={hideControlsAfterDelay} // Reset timer on move
    >
      {/* Video container with canvas */}
      <div className="relative w-full aspect-video">
        {/* Hidden video element */}
        <video
          ref={videoRef}
          className="hidden"
          preload="auto"
          crossOrigin="anonymous"
        />

        {/* Canvas for rendering video */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain bg-black"
        />

        <LoadingOverlay visible={!videoLoaded} />
        <ThumbnailOverlay
          visible={!playing && videoLoaded}
          thumbnailUrl={thumbnailUrl}
        />

        {/* Play/Pause button in center */}

        <CenterPlayButton
          playing={playing}
          showControls={showControls}
          togglePlay={togglePlay}
        />

        <SeekPreview
          visible={seekPreviewVisible}
          time={seekPreviewTime}
          formatTime={formatTime}
        />
      </div>

      <ControlsOverlay
        visible={showControls || !playing || isHovered || isSeeking}
      >
        <ProgressBar
          progressBarRef={progressBarRef}
          currentTime={currentTime}
          duration={duration}
          isHovered={isHovered}
          showControls={showControls}
          isSeeking={isSeeking}
          handleProgressClick={handleProgressClick}
          handleProgressHover={handleProgressHover}
          hideSeekPreview={hideSeekPreview}
          handleSeekStart={handleSeekStart}
        />

        <ControlButtons
          playing={playing}
          volume={volume}
          isMuted={isMuted}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          qualities={qualities}
          selectedQuality={selectedQuality}
          formatTime={formatTime}
          togglePlay={togglePlay}
          handleVolumeChange={handleVolumeChange}
          toggleMute={toggleMute}
          openPlaybackMenu={openPlaybackMenu}
          toggleSettings={toggleSettings}
          toggleFullscreen={toggleFullscreen}
          openQualityMenu={openQualityMenu}
        />

        <SettingsMenu
          showSettings={showSettings}
          showQualityMenu={showQualityMenu}
          showPlaybackMenu={showPlaybackMenu}
          qualities={qualities}
          selectedQuality={selectedQuality}
          playbackRate={playbackRate}
          handleQualityChange={handleQualityChange}
          handlePlaybackRateChange={handlePlaybackRateChange}
          openQualityMenu={openQualityMenu}
          openPlaybackMenu={openPlaybackMenu}
        />
      </ControlsOverlay>
    </div>
  );
};

export default VideoPlayer;
