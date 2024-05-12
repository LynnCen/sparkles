import { useRef, useEffect, FC } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './style/video-play.less';

interface VideoPlayProps {
  src?: string;
  width?: string | number;
  height?: string | number;
}

const VideoPlay: FC<VideoPlayProps> = ({ src, width, height }) => {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const onReadyPlay = (palyer) => {
    videoRef.current = palyer;
    // palyer.play();
  };

  const init = () => {
    const _option = {
      controls: true,
      // notSupportedMessage: '此视频暂无法播放，当前仅支持mp4，ogg，webm，mepg4 格式',
      controlBar: {
        // timeDivider: true,//是否显示时间控制条，默认为true
        // remainingTimeDisplay: false,//是否显示剩余时间，默认为true
        fullscreenToggle: false, // 全屏按钮
        children: [// 自定义
          { name: 'playToggle' }, // 播放按钮
          {
            name: 'volumePanel', // 音量控制
            inline: false, // 不使用水平方式
          },
          { name: 'currentTimeDisplay' }, // 当前已播放时间
          // { name: 'durationDisplay' }, // 总时间
          { name: 'progressControl' }, // 播放进度条
          {
            name: 'pictureInPictureToggle'// 支持画中画
          },
          {
            name: 'FullscreenToggle'// 支持全屏，
          }
        ]
      }

    };

    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, _option, () => {
      });
      onReadyPlay(player);
    }
  };

  useEffect(() => {
    init();
  });

  return (
    <div style={{
      width,
      height,
    }} >
      <video style={{ height: '100%', width: '100%' }} ref={videoRef}
        className='video-js vjs-big-play-centered'>
        <source src={src} type='video/mp4' />
        <source src={src} type='video/ogg'/>
        <source src={src} type='video/webm'/>
        <source src={src} type='video/mepg4'/>
      </video>
    </div>
  );
};


export default VideoPlay;
