import { useRef, useEffect, useState, CSSProperties } from "react";
import Config from "../config/Config";

interface VideoLoadedParams {
  videoWidth?: number;
  videoHeight?: number;
  duration?: number;
}

export type VideoLoaded = ({ ...params }: VideoLoadedParams) => void;

interface VideoProps {
  url: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onLoaded?: VideoLoaded;
  onCanPlay?: () => void;
  style?: CSSProperties;
  className?: string;
}

export default function Video({
  url,
  onLoaded,
  onCanPlay,
  controls = true,
  muted = false,
  autoPlay = true,
  loop = true,
  style,
  className = ""
}: VideoProps) {
  const video = useRef(null);

  useEffect(
    () => {
      if (video.current) {
        let dom = video.current;
        dom.onloadedmetadata = () => {
          let { videoWidth, videoHeight, duration } = dom;
          onLoaded && onLoaded({ videoWidth, videoHeight, duration });
        };
        if (autoPlay) {
          dom.oncanplay = () =>
            dom
              .play()
              .then(() => onCanPlay && onCanPlay())
              .catch(console.error);
        }
      }
    },
    [video]
  );
  return (
    <video
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      preload="metadata"
      ref={video}
      style={{ height: "inherit", ...style }}
      className={className}
    >
      <source src={url.indexOf("://") > -1 ? url : Config.apiHost + url} type="video/mp4" />
    </video>
  );
}
