// components/VideoPlayer.tsx
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-player with proper typing
const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-video bg-gray-900" />,
  }
) as any; // Use "as any" to bypass TypeScript temporarily

interface VideoPlayerProps {
  hlsUrl: string;
  thumbnailUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ hlsUrl, thumbnailUrl }) => {
  const [playing, setPlaying] = useState(false);

  console.log(hlsUrl, thumbnailUrl);
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <ReactPlayer
        url={hlsUrl}
        width="100%"
        height="100%"
        playing={playing}
        crossOrigin="anonymous"
        controls={true}
        light={!playing && thumbnailUrl ? thumbnailUrl : false}
        onClickPreview={() => setPlaying(true)}
        config={{
          file: {
            hlsOptions: {
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
            },
          },
        }}
        onError={(e: any) => console.error("Video error:", e)}
      />
    </div>
  );
};

export default VideoPlayer;
