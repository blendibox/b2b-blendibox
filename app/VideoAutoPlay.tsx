"use client";

import { useEffect, useRef } from "react";


interface VideoAutoPlayProps {
  src?: string;
  className?: string;
}

export default function VideoAutoPlay(params: VideoAutoPlayProps) {
const videoRef = useRef<HTMLVideoElement | null>(null);

const src = params.src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          if (video.paused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Ignora AbortError silenciosamente
              });
            }
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);


  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      controls
	  preload="metadata"
      style={{ width: "100%", borderRadius: "12px" }}
    />
  );
}