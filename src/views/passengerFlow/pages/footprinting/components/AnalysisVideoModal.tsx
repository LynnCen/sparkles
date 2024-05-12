/**
 * @Description 踩点宝视频分析，画线框图片渲染
 */
import { FC, useEffect, useRef, useState } from 'react';
import { Modal, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { floorKeep, isNotEmptyAny } from '@lhb/func';
import videojs from 'video.js';

import styles from '../index.module.less';
import { aspectFit } from './VideoItem';
import 'video.js/dist/video-js.css';

import { useClientSize } from '@lhb/hook';
import { checkSpotVideoDetail } from '@/common/api/footprinting';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

export type AnalysisImageProps = {
  id: number|string; // 当前视频段id
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

// 默认的视频播放宽高
const videoWidth = 1280;
const videoHeight = 720;


const AnalysisVideoModal: FC<AnalysisImageProps> = ({ id, open, setOpen }) => {
  const size = useClientSize();
  const imageWrapRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const videoJsRef = useRef<any>(null);

  const [clientSize, setClientSize] = useState<{width:number, height:number, rate:number}>({ width: videoWidth, height: videoHeight, rate: 1 }); // 视频根据适口缩放的宽高，如果rate<1，则视频会缩小，大于等于 1 不做处理
  const [videoData, setVideoData] = useState<any>({});
  const [frameObjData, setFrameObjData] = useState<any>({ frameMapData: new Map(), frameData: [] });
  const [loading, setLoading] = useState<boolean>(false);


  /** 将矩形对角线坐标转为四个点 */
  const calculateRectanglePoints = (x1, y1, x2, y2) => {
    // 计算矩形的四个点坐标
    const x3 = x1;
    const y3 = y2;
    const x4 = x2;
    const y4 = y1;

    // 返回矩形的四个点坐标
    return [
      { x: x1, y: y1 }, // 点1
      { x: x3, y: y3 }, // 点3
      { x: x2, y: y2 }, // 点2
      { x: x4, y: y4 }, // 点4
    ];
  };

  /** 生成线框 */
  const initFrame = (canvasContext, canvasSize) => {


    const canvasWidth = canvasSize.width;
    const canvasHeight = canvasSize.height;
    const realVideoWidth = videoJsRef.current.videoWidth || 2304;
    const realVideoHeight = videoJsRef.current.videoHeight || 1296;

    // 图片根据画布大小等比例缩放
    const local = aspectFit(realVideoWidth, realVideoHeight, canvasWidth, canvasHeight);

    // 计算出画布和图片的比例，用来缩放画框
    const xRate = Number(floorKeep(canvasWidth, realVideoWidth, 4, 2));
    const yRate = Number(floorKeep(canvasHeight, realVideoHeight, 4, 2));
    const setRate = xRate < yRate ? xRate : yRate;

    canvasContext.width = setRate > 1 ? videoWidth : local.dw;// 设置画布宽
    canvasContext.height = setRate > 1 ? videoHeight : local.dh;


    // 保存的点数据是原图尺寸坐标，需要根据缩放倍数缩小画布 画框点
    const scalePointData = videoData.points;


    const data = scalePointData.map((item) => {

      return {
        x: floorKeep(item.x, setRate, 3, 2),
        y: floorKeep(item.y, setRate, 3, 2),
      };
    });
    // 线的颜色
    canvasContext.strokeStyle = 'rgb(120, 173, 127)';
    canvasContext.lineWidth = 3;
    // 开始划线
    canvasContext.beginPath();

    canvasContext.moveTo(data[0].x, data[0].y);
    data.forEach((item, index) => {
      if (index !== 0) {
        canvasContext.lineTo(item.x, item.y);
      }
      if (index === data.length - 1) {
        canvasContext.lineTo(data[0].x, data[0].y);
      }
    });
    canvasContext.stroke();
  };

  /** 生成画布 */
  const initCanvas = (canvasContext, bboxes, canvasSize) => {

    // 清除画布
    // canvasContext.clearRect(0, 0, parseInt(videoWidth), parseInt(videoHeight));
    // 将视频帧渲染到 canvas 上，将尽可能的与屏幕上播放的视频的帧速率同步
    canvasContext.drawImage(videoJsRef.current, 0, 0, (canvasSize.width), (canvasSize.height));
    // 生成线框
    initFrame(canvasContext, canvasSize);

    bboxes?.map((item) => {
      return drawRectangle(canvasContext, item, 'rgb(255,0,0)', canvasSize);
    });

  };

  /** 画框 */
  const drawRectangle = (canvasContext, boxInfo, strokeStyle, canvasSize) => {
    const rectanglePoints = calculateRectanglePoints(boxInfo.x_min, boxInfo.y_min, boxInfo.x_max, boxInfo.y_max);
    // 线的颜色
    canvasContext.strokeStyle = strokeStyle;
    // 开始划线
    canvasContext.beginPath();


    let data:any[] = [];
    // 如果 rate 小于 1，则需要缩小画布 画框点
    if (canvasSize.rate < 1) {
      data = rectanglePoints.map((item) => {

        return {
          x: floorKeep(item.x, canvasSize.rate, 3, 2),
          y: floorKeep(item.y, canvasSize.rate, 3, 2),
        };
      });
    } else {
      data = rectanglePoints;
    }

    canvasContext.moveTo(data[0].x, data[0].y);
    data.forEach((item, index) => {
      if (index !== 0) {
        canvasContext.lineTo(item.x, item.y);
      }
      if (index === data.length - 1) {
        canvasContext.lineTo(data[0].x, data[0].y);
      }
    });

    // 结束
    canvasContext.stroke();

    // trace_id
    // 设置文本样式
    canvasContext.font = '20px Arial'; // 设置字体大小和字体样式
    canvasContext.fillStyle = strokeStyle; // 设置文本颜色

    // 在特定坐标点上写字
    canvasContext.fillText(`trace_id:${boxInfo.trace_id}`, data[0].x, data[0].y - 10); // 在坐标点处写字
  };

  /** 找到某个帧的索引，如果没找到则往前一帧找，没有则继续往前一帧找 */
  function findIndexByFrame(data, targetFrame) {
    let targetIndex = -1;
    let currentFrame = targetFrame;

    while (targetIndex === -1 && currentFrame >= 2) {
      const index = data.findIndex(item => item.frame === currentFrame);
      if (index !== -1) {
        targetIndex = index;
      }
      currentFrame--;
    }

    return targetIndex;
  }

  /** 画出总人数 */
  const drawCount = (canvasContext, frame, canvasSize) => {

    const targetIndex = findIndexByFrame(frameObjData.frameData, frame);

    const endOfData = targetIndex >= 0 ? frameObjData.frameData.slice(0, targetIndex + 1) : [];

    // 统计总人数
    const total = new Set();
    endOfData.forEach(item => {
      item.bboxes.forEach(bbox => {
        total.add(bbox.trace_id);
      });
    });
    const uniqueTotal = total.size;

    canvasContext.font = '20px Arial'; // 设置字体大小和字体样式
    canvasContext.fillStyle = 'rgb(255,0,0)'; // 设置文本颜色

    // 在特定坐标点上写字
    const middle = floorKeep(canvasSize.width, 2, 4, 0);
    canvasContext.fillText(`总人数:${uniqueTotal}`, middle, 20); // 在坐标点处写字
    canvasContext.fillText(`frame:${frame}`, middle, 40); // 在坐标点处写字

    // // 性别不准暂不使用
    // // 统计性别为female且不重复的trace_id数量
    // const femaleTraceIds = new Set();
    // endOfData.forEach(item => {
    //   item.bboxes.forEach(bbox => {
    //     if (bbox.attributions.sex === 'female') {
    //       femaleTraceIds.add(bbox.trace_id);
    //     }
    //   });
    // });
    // const uniqueFemaleTraceIds = femaleTraceIds.size;

    // // 统计性别为male且不重复的trace_id数量
    // const maleTraceIds = new Set();
    // endOfData.forEach(item => {
    //   item.bboxes.forEach(bbox => {
    //     if (bbox.attributions.sex === 'male') {
    //       maleTraceIds.add(bbox.trace_id);
    //     }
    //   });
    // });
    // const uniqueMaleTraceIds = maleTraceIds.size;

  };


  /** requestVideoFrameCallback的回调 */
  const videoFrameCallback = (now, metadata, canvasContext, clientSize) => {
    // console.log(now, metadata);
    // 区域框+人框
    initCanvas(canvasContext, frameObjData.frameMapData.get(Number(Math.ceil(Number(floorKeep(metadata.mediaTime, 6, 3, 4))).toFixed(0))), clientSize);
    // 右上角 frame+人数
    drawCount(canvasContext, Number(Math.ceil(Number(floorKeep(metadata.mediaTime, 6, 3, 4))).toFixed(0)), clientSize);
    // 重新注册回调以获得关于下一帧的通知。
    videoJsRef.current.requestVideoFrameCallback((now, metadata) => videoFrameCallback(now, metadata, canvasContext, clientSize));
  };

  const getVideoDetail = (id) => {
    setLoading(true);
    checkSpotVideoDetail({ id }).then((res:any) => {
      setVideoData(res);

      const parmaArr = res.analysisDetailUrl.split('/');
      const url = `${window.location.origin}/ob/${parmaArr[parmaArr.length - 1]}`;

      fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(response => response.json())
        .then(data => {
          if (Number(data.r) === 200) {
            /** 将数据转为map格式，每一帧只有唯一个对象 */
            const _frameData = data.data.reduce((map, item) => {
              map.set(item.frame, item.bboxes);
              return map;
            }, new Map());
            setFrameObjData({
              frameMapData: _frameData,
              frameData: data.data,
            });

            setLoading(false);
          } else {
            V2Message.error('获取不到画框信息，请重试');
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });

    });

  };

  useEffect(() => {
    open && getVideoDetail(id);
  }, [id, open]);

  /** 初始化video.js */
  useEffect(() => {

    // 图片根据画布大小等比例缩放
    const local = aspectFit(videoWidth, videoHeight, size.width, size.height);

    // 计算出画布和图片的比例，用来缩放画框
    const xRate = Number(floorKeep(size.width, videoWidth, 4, 2));
    const yRate = Number(floorKeep(size.height, videoHeight, 4, 2));
    const rate = xRate < yRate ? xRate : yRate;


    const _clientSize = {
      width: rate > 1 ? videoWidth : local.dw,
      height: rate > 1 ? videoHeight : local.dh,
      rate,
    };

    setClientSize(_clientSize);


    !loading && isNotEmptyAny(videoData) && videojs(videoJsRef.current, {
      autoplay: false,
      controls: true,
      // 设置控件一直显示
      inactivityTimeout: 0,
      playbackRates: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], // 倍速，与下列 children 配置有冲突
      // notSupportedMessage: '此视频暂无法播放，当前仅支持mp4，ogg，webm，mpeg4 格式',
      controlBar: {
        // timeDivider: true,//是否显示时间控制条，默认为true
        remainingTimeDisplay: true, // 是否显示剩余时间，默认为true
        fullscreenToggle: false, // 全屏按钮
        pictureInPictureToggle: false, // 画中画
        // children: [
        //   { name: 'playToggle' }, // 播放按钮
        //   {
        //     name: 'volumePanel', // 音量控制
        //     inline: false, // 不使用水平方式
        //   },
        //   { name: 'progressControl' }, // 播放进度条
        //   { // 倍数播放，可以自己设置
        //     name: 'playbackRateMenuButton',
        //     'playbackRates': [0.5, 1, 1.5, 2, 2.5]
        //   },
        // ]
      },
    }, () => {
      const targetRef = canvasRef.current;
      targetRef.oncontextmenu = function (e) { // 禁用右键后的默认菜单
        e.preventDefault();
      };

      const video = videoJsRef.current;

      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        // 最初注册回调，以便在第一帧时得到通知。
        video.requestVideoFrameCallback((now, metadata) => videoFrameCallback(now, metadata, targetRef.getContext('2d'), _clientSize));
      } else {
        return alert(
          '你的浏览器不支持，请更换 chrome'
        );
      }

    });

  }, [videoData, loading]);


  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen?.(false)}
      width={'100%'}
      bodyStyle={{ padding: 0, background: 'transparent', height: '100%' }}
      closable={false}
      wrapClassName={styles.analysisVideoModalWrapper}
      maskClosable={false}
      afterClose={() => {
        videoJsRef.current && videoJsRef.current.pause();
      }}
    >
      <div className={styles.analysisVideoModal} ref={imageWrapRef} >
        <Spin spinning={loading}>
          <canvas
            ref={canvasRef}
            width={clientSize.width}
            height={clientSize.height}/>
          <video
            ref={videoJsRef}
            className='video-js vjs-big-play-centered'
            width={clientSize.width}
            height={clientSize.height}>
            {/* 720p */}
            {/* <source src="https://middle-file.linhuiba.com/ltPADHQJME26cxOEHLSaiW6Wo-r9" type="video/mp4"></source> */}
            {/* 原视频 */}
            <source src={videoData.videoUrl} type='video/mp4'/>

          </video>
        </Spin>
        <CloseCircleOutlined className={styles.closeIcon} onClick={() => setOpen?.(false)} />
      </div>
    </Modal>
  );
};

export default AnalysisVideoModal;
