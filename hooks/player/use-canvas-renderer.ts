import { useEffect, useRef } from "react";

type CanvasRendererParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function useCanvasRenderer({
  canvasRef,
  videoRef,
}: CanvasRendererParams) {
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video dimensions
    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Animation loop for rendering video to canvas
    const renderFrame = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    // Start rendering
    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [canvasRef, videoRef]);
}
