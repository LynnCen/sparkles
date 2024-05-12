import { FC, useEffect, useState, useRef } from 'react';
import { isArray, urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { getVideoHashData } from '@/common/api/car';
import { getImageUrlWidthHeight } from '@/common/utils/ways';
import styles from './entry.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import CanvasCom from './components/CanvasCom';
import VideoCom from './components/VideoCom';
import Controls from './components/Controls';
import HintDialog from './components/HintDialog';

const Video: FC<any> = () => {
  const id: any = urlParams(location.search)?.id; // 分享页时url该字段有值，否则读取cookie
  const [videoData, setVideoData] = useState<any>();
  // console.log(`videoData`, videoData);
  const videoRef: any = useRef();
  const canvasRef: any = useRef();
  const canvasContextRef: any = useRef();
  const videoDurationRef: any = useRef(0);
  const [realSize, setRealSize] = useState({
    width: 0,
    height: 0
  });
  const [isPlayStatus, setIsPlayStatus] = useState<boolean>(false); // 是否是播放状态
  const [duration, setDuration] = useState<number>(0);
  // 部分浏览器下会无法完整播放视频的问题（谷歌浏览器需要关闭硬件加速器）
  const [showHint, setShowHint] = useState<boolean>(false); // 是否需要提醒一些无法播放视频的处理方式

  useEffect(() => {
    if (!(id)) return;
    loadData();
  }, [id]);

  useEffect(() => {
    if (!videoData) return;
    setTimeout(() => {
      // 监听浏览器窗口的大小变化
      window.addEventListener('resize', handleResize);
      // 监听视频加载，加载完成后框的额绘制
      videoRef.current.addEventListener('loadedmetadata', handleDraw);
      // 监听视频错误消息
      videoRef.current.addEventListener('error', () => {
        const errorInfo = videoRef.current.error;
        console.log(`errorInfo`, errorInfo);
        // 1. **MEDIA_ERR_ABORTED (1)**: 用户终止了媒体下载。这可能表示用户在媒体文件还未完全下载前就停止了下载或播放。
        // 2. **MEDIA_ERR_NETWORK (2)**: 发生网络错误，导致媒体下载失败。这可能是由于丢失网络连接或服务器不可用造成的。
        // 3. **MEDIA_ERR_DECODE (3)**: 媒体解码失败。即使媒体已成功下载，浏览器也可能无法解码文件以进行播放。
        // 4. **MEDIA_ERR_SRC_NOT_SUPPORTED (4)**: 媒体资源不被浏览器支持，或者格式不正确，导致浏览器无法加载媒体资源。这也可能意味着源文件损坏或不兼容。
        const { code } = errorInfo;
        // 目前在谷歌浏览器上无法完整播放或拖拽视频后无法继续播放的问题
        if (code === 3) {
          setShowHint(true);
        }
      });
    }, 0);
    return () => {
      videoRef.current && videoRef.current.removeEventListener('loadedmetadata', handleDraw);
      canvasContextRef.current && canvasContextRef.current.removeEventListener('resize', handleResize);
    };
  }, [videoData]);

  const {
    loadData,
    handleResize,
    handleDraw,
    calculateScaledDimensions,
    handlePlay,
  } = useMethods({
    loadData: async () => {
      const data = await getVideoHashData({ videoHash: id });
      console.log(data);
      const { videoUrl, encodeVideoUrl, checkPoints } = data;
      // const mockData = {
      //   checkPoints: [
      //     { x: 755, y: 245 },
      //     { x: 302.5, y: 1170 },
      //     { x: 1562.5, y: 912.5 },
      //     { x: 1575, y: 360 },
      //     { x: 985, y: 105 },
      //   ],
      //   videoUrl: 'https://temp.linhuiba.com/VQDG0089639HECC-2024-03-20-14-30-00.mp4',
      //   // encodeVideoUrl: 'https://temp.linhuiba.com/VQDG0089639HECC-2024-03-20-14-30-00-encode.mp4',
      //   encodeVideoUrl: null
      // };
      // const { videoUrl, encodeVideoUrl, checkPoints } = mockData;
      // 判断用哪个url
      let targetUrl = videoUrl; // 默认视频源
      let targetPoints: any[] = isArray(checkPoints) ? checkPoints : [];
      let originWH = { // 默认值
        width: 2304, // 2304,
        height: 1296, // 1296,
      };
      let encodeWh = { // 默认值
        width: 1280, // 1280,
        height: 720, // 720,
      };
      // 获取视频源的宽高，在视频上拼接参数可获取对应的视频的宽高
      if (videoUrl) {
        const targetSize: any = await getImageUrlWidthHeight(`${videoUrl}?vframe/jpg/offset/0`);
        targetSize && (originWH = targetSize);
      }
      // 获取编码后的视频源的宽高
      if (encodeVideoUrl) {
        const targetSize: any = await getImageUrlWidthHeight(`${encodeVideoUrl}?vframe/jpg/offset/0`);
        targetSize && (encodeWh = targetSize);
      }
      // 两个都有时，优先使用编码后的视频源地址
      if (videoUrl && encodeVideoUrl) {
        targetUrl = encodeVideoUrl;
        // 计算比例，重新确认画框坐标（编码后的视频源宽高比变小，但是是和视频源的宽高比是一致的，都是16/9）
        const ratioVal = originWH.width / encodeWh.width;
        targetPoints = targetPoints.map((item: any) => ({ x: item?.x / ratioVal, y: item?.y / ratioVal }));
      }
      setVideoData({
        url: targetUrl?.replace(/^http:\/\//, 'https://'),
        pointsData: targetPoints
      });
    },
    handleResize: () => {
      if (!canvasContextRef.current) return;
      canvasContextRef.current.clearRect(0, 0, realSize.width, realSize.height);
      handleDraw();
    },
    handleDraw: () => {
      const durationVal = videoRef.current.duration;
      videoDurationRef.current = durationVal;
      setDuration(durationVal);
      // 输出视频的宽度和高度
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      // console.log('视频宽度:', videoRef.current.videoWidth);
      // console.log('视频高度:', videoRef.current.videoHeight);
      const target = calculateScaledDimensions(videoWidth, videoHeight, window.innerWidth, window.innerHeight);
      // console.log(`target`, target);
      setRealSize(target);
      const targetRef = canvasRef.current;
      if (!targetRef.getContext) {
        V2Message.warning('您的浏览器不支持canvas，请更换为现代浏览器');
        return;
      };
      const canvasContext = targetRef.getContext('2d');
      canvasContextRef.current = canvasContext;
      canvasContext.strokeStyle = 'red'; // 设置线颜色
      // canvasContext.lineWidth = 2; // 设置线宽
      canvasContext.beginPath();
      const { pointsData } = videoData;
      const targetData = pointsData.length > 0 ? [...pointsData, pointsData[0]] : []; // 方便收尾相连
      targetData?.forEach((item: any, index: number) => {
        const { x, y } = item;
        const conversionX = target.width / videoWidth * x;
        const conversionY = target.height / videoHeight * y;
        item.conversionX = conversionX;
        item.conversionY = conversionY;
        if (index === 0) {
          canvasContext.moveTo(conversionX, conversionY);
        } else {
          canvasContext.lineTo(conversionX, conversionY);
          canvasContext.stroke();
        }
      });
    },
    calculateScaledDimensions: ( // 计算视频画面实际的尺寸
      videoWidth, // 视频的实际宽度
      videoHeight,
      containerWidth, // 容器的宽度
      containerHeight
    ) => {
      const aspectRatio = videoWidth / videoHeight; // 视频实际的宽高比
      const containerAspectRatio = containerWidth / containerHeight; // 容器的宽高比

      let finalWidth, finalHeight;
      if (aspectRatio > containerAspectRatio) { // 视频相对于容器太宽
        finalWidth = containerWidth;
        finalHeight = finalWidth / aspectRatio;
      } else { // 视频相对于容器太高或者正好
        finalHeight = containerHeight;
        finalWidth = finalHeight * aspectRatio;
      }

      return { width: finalWidth || 0, height: finalHeight || 0 };
    },
    handlePlay: () => {
      // 等待视频元数据加载完
      if (!videoDurationRef.current) return;
      setIsPlayStatus((state) => !state);
    },
  });

  return (
    <div className={styles.container} onClick={handlePlay}>
      {
        videoData ? <>
          {/* canvas层 */}
          <CanvasCom
            canvasRef={canvasRef}
            realSize={realSize}
          />
          {/* 视频层 */}
          <VideoCom
            videoRef={videoRef}
            url={videoData.url}
          />
          {/* 控制条 */}
          <Controls
            videoRef={videoRef}
            videoDurationRef={videoDurationRef}
            isPlayStatus={isPlayStatus}
            duration={duration}
            setIsPlayStatus={setIsPlayStatus}
            handlePlay={handlePlay}
          />
        </> : <></>
      }

      <HintDialog
        show={showHint}
        setShow={setShowHint}
      />
    </div>
  );
};

export default Video;
