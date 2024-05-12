import { FC, useEffect, forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { message as msg, Spin } from 'antd';
import { PlayCircleFilled, FullscreenOutlined } from '@ant-design/icons';
import { liveUrlHW, livePlaypackUrlHW } from '@/common/api/device';
import { useMethods } from '@lhb/hook';
import { HWLiveProps } from './ts-config';
import styles from './index.module.less';
import cs from 'classnames';
import dayjs from 'dayjs';
import JTimeLine from '@/common/utils/JtimeLine';

const HWLive: FC<HWLiveProps> = forwardRef(
  (
    {
      id, // 设备id
      bigDataSend, // 埋点方法
      isLive, // 直播
      targetDate,
      // storeId, // 门店id
    },
    ref
  ) => {
    const [liveUrl, setLiveUrl] = useState('');
    const [endUrl, setEndUrl] = useState('');
    const [isHideLoading, setIsHideLoading] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const [showBar, setShowBar] = useState(false);
    const [isStop, setIsStop] = useState(true); // 是否不是播放状态
    const [dateParams, setDateParams] = useState({
      startTime: '',
      endTime: '',
    });
    const [timeLineTimer, setTimeLineTimer] = useState(null);
    const [jTimeLine, setJTimeLine] = useState(null);
    const [jTimeLineArr, setJTimeLineArr] = useState([]);
    const [speed, setSpeed] = useState(1);
    const [firstPlay, setFirstPlay] = useState<boolean>(true);// 是否为第一次播放

    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const timeLineRef = useRef(null);
    const canvasRef = useRef(null);

    const {
      mountedHandle,
      start,
      getVideoUrl,
      playLive,
      initStatus,
      stopHandle,
      fullscreen,
      recordSubmitForm,
      recordPlay,
      initTimeLine,
      handleTimeChange,
      speedChange
    } = useMethods({
      mountedHandle: async () => {
        await window.getScript('jPlayer');
        const Player = window.jPlayer.default;
        // const playerStatePlaying = Player.playerStatePlaying;
        const playerRefIns = new Player(videoRef.current);
        playerRef.current = playerRefIns;
        // (playerRef as any).current = new Player(this.$refs.HWLive);
        window._event = playerRefIns.event;
        // 链接异常监听
        playerRefIns.event.on('CLIENT_LINK_ERROR', (d: any) => {
          msg.error(d?.msg || '连接设备失败');
          setIsHideLoading(true);
          initStatus();
        });
        // 媒体信息
        playerRefIns.event.on('GET_MEDIA_INFO', () => {
          setLoadingShow(false);
          setIsHideLoading(true);
        });
        // 倍速改变
        (playerRef as any).current.event.on('speedNum', (s: any) => {
          setSpeed(s === '0' ? 1 : s);
          // speed = s === '0' ? 1 : s;
        });
        (playerRef as any).current.event.on('GET_MEDIA_STOP', () => {
          // this.loadingShow = false;
          setLoadingShow(false);
        });
        // GET_DEVICE_RECORD_LIST 获取设备回放列表  仅当播放设备为好望设备 录像为设备录像时，录像ws://** 长链接返回视频列表
        (playerRef as any).current.event.on('GET_DEVICE_RECORD_LIST', (s: any) => {
          const recordList = s;
          // 通过回调来传递时间轴数据 初始化时间轴
          const recordArr = recordList.rec_file_infos;
          recordArr.forEach((item: any) => {
            item.startTime = dayjs(item.start_time).valueOf();
            item.endTime = item.startTime + item.duration;
          });
          // this.jTimeLineArr = recordArr;
          setJTimeLineArr(recordArr);
          initTimeLine();
        });
      },
      initStatus: () => {
        const player: any = playerRef.current;
        player.stop();
        // this.jTimeLine = null;
        setLoadingShow(false);
        setIsHideLoading(false);
        setEndUrl('');
        timeLineTimer && clearInterval(timeLineTimer);
      },
      start: () => {
        if (isLive) { // 直播
          getVideoUrl();
        } else { // 回放
          endUrl ? (playerRef as any).current.resume() : getVideoUrl();
          // 继续播放埋点上报
          endUrl && bigDataSend('e11be5b1-0f82-4fc8-969a-709d50934f8d');
        }
        setIsStop(false);
        timeLineTimer && clearInterval(timeLineTimer);
      },
      // 暂停事件
      stopHandle: (init?: boolean, isChange?:boolean) => {
        // 切换门店或切换视频源（直播/回放）
        if (isChange) {
          setFirstPlay(true);
        }
        // 暂停埋点上报（与继续播放埋点同事件id）
        bigDataSend('e11be5b1-0f82-4fc8-969a-709d50934f8d');
        if (init) {
          initStatus();
          return;
        }
        setIsStop(true);
        // 在直播的情况下
        isLive ? initStatus() : (playerRef as any).current.pause();

        timeLineTimer && clearInterval(timeLineTimer);
      },
      getVideoUrl: async () => { // 获取直播地址
        if (isLive) {
          const { liveUrl } = await liveUrlHW({
            id,
            source: 'WEB'
          });
          setLiveUrl(liveUrl || '');
          playLive();
        } else {
          const { startTime, endTime } = dateParams;
          if (!startTime || !endTime) return;
          const data = await livePlaypackUrlHW({
            id: id,
            source: 'WEB',
            startTime,
            endTime,
            // storeId
          });
          setEndUrl(data?.playbackUrl || '');
          recordSubmitForm();
        }
      },
      playLive: () => { // 开始直播
        if ((playerRef as any).current.getState() === 0) {
          const el: any = videoRef.current;
          const ocanvas: any = canvasRef.current;
          if (el && ocanvas) {
            ocanvas.setAttribute('width', `${el.offsetWidth}`);
          }

          const options = {
            url: isLive ? liveUrl : endUrl,
            endtime: isLive ? null : new Date(dateParams.endTime), // 直播为null 录播为回放结束时间
            isStream: isLive // 直播为true 录播为false
          };

          (playerRef as any).current.play(options);

          // 第一次播放
          if (firstPlay && !isHideLoading) {
            setLoadingShow(true);
            setFirstPlay(false);
            // 开始播放埋点上报
            bigDataSend('d46c35fb-476e-450c-8c97-ba805166f359');
          }
          // 继续播放
          if (!firstPlay) {
            // 继续播放埋点上报（与暂停埋点同事件id）
            bigDataSend('e11be5b1-0f82-4fc8-969a-709d50934f8d');
          }
        } else { // 暂停事件
          (playerRef as any).current.stop();
        }
      },
      recordSubmitForm: () => {
        // this.jTimeLine = null;
        setJTimeLine(null);
        timeLineTimer && clearInterval(timeLineTimer);
        if ((playerRef as any).current.getState() !== 0) {
          stopHandle();
          (playerRef as any).current.event.once('GET_MEDIA_STOP', () => {
            recordPlay();
          });
        } else {
          recordPlay();
        }
      },
      recordPlay: () => {
        // this.isLive = false;
        setTimeout(() => {
          playLive();
          initTimeLine();
          const timer = setInterval(() => {
            if (!(playerRef as any).current.loadingState) {
              clearInterval(timer);
              if (!isLive) {
                const timeLineTimerVal: any = setInterval(() => {
                  // this.jTimeLine.run({
                  //   time: parseInt((playerRef as any).current.getCurTimestamp())
                  // });
                  jTimeLine && (jTimeLine as any).run({
                    time: parseInt((playerRef as any).current.getCurTimestamp())
                  });
                }, 500);
                setTimeLineTimer(timeLineTimerVal);
              }
            }
          }, 1000);
        }, 1000);
      },
      initTimeLine: () => {
        setJTimeLine(null);
        setSpeed(1);
        const canvasContain = timeLineRef.current;
        const ocanvas = canvasRef.current;
        const jTimeLineIns: any = new JTimeLine({ canvasContain, ocanvas });
        setJTimeLine(jTimeLineIns);
        jTimeLineIns.init({
          onChange: handleTimeChange
        });
        jTimeLineIns.changeSize(3);

        if (jTimeLineArr.length) {
          jTimeLineIns.getRecord(jTimeLineArr);
          jTimeLineIns.run({ time: dayjs((jTimeLineArr[0] as any).startTime).valueOf() });
        }
      },
      handleTimeChange: (nowTime: any) => {
        (playerRef as any).current.seekTo(nowTime);
        setSpeed(1); // seek后要将speed置为1状态；
      },
      fullscreen: () => {
        (playerRef as any).current.fullscreen();
      },
      speedChange: () => {
        if ((playerRef as any).current.getState() === 2) return;
        const currentSpeed = speed * 2;
        const speedVal = currentSpeed === 8 ? 1 : currentSpeed;
        setSpeed(speedVal);
        (playerRef as any).current.setSpeed(`${speedVal}`);
      }
    });

    // 将load方法暴露给父组件，可在父组件中使用该方法
    useImperativeHandle(ref, () => ({
      stop: () => stopHandle(true, true),
    }));

    useEffect(() => {
      mountedHandle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (targetDate) {
        const dateFormat = dayjs(targetDate).format('YYYY-MM-DD');
        const now = dayjs();
        const dateParams = {
          startTime: now < new Date(`${dateFormat} 08:00:00`)
            ? `${dateFormat} 00:00:00`
            : `${dateFormat} 08:00:00`,
          endTime: now.format('YYYY-MM-DD') > dateFormat
            ? `${dateFormat} 23:59:59`
            : now.format('YYYY-MM-DD HH:mm:ss')
        };
        setDateParams(dateParams);
      }
    }, [targetDate]);

    return (
      <div className={styles.hwContainer}>
        <Spin spinning={loadingShow} delay={500} wrapperClassName={styles.spinCon}>
          <div
            ref={videoRef}
            className={styles.video}
            onMouseEnter={() => setShowBar(true)}
            onMouseLeave={() => setShowBar(false)}>
            {
              !isHideLoading && (
                <div className={styles.videoReplace}>
                  <div className={styles.videoReplaceContainer}>
                    <PlayCircleFilled className={styles.pauseIcon} onClick={start}/>
                  </div>
                </div>
              )
            }
            {
              !isHideLoading && (
                <div className={styles.pauseImg}></div>
              )
            }
          </div>
        </Spin>
        <div className={styles.bottomContainer}>
          {!isLive && (
            // 回放的进度条
            <div ref={timeLineRef} className={styles.canvasContainer}>
              <canvas ref={canvasRef} className={styles.timeLineBody} height='48px'>
                该浏览器不支持canvas
              </canvas>
            </div>
          )
          }
          {/* styles.oprationBar */}
          <div className={cs(styles.oprationBar, showBar && styles.visibleBar)}>
            <div>
              <PlayCircleFilled className='fn-20 color-white pointer' onClick={() => isStop ? start() : stopHandle(false)}/>
              {
                !isLive && (
                  <span className='color-white pointer ml-10' onClick={speedChange}>倍速{ speed + 'X' }</span>
                )
              }
            </div>
            <div>
              <FullscreenOutlined className='fn-20 color-white pointer' onClick={fullscreen}/>
            </div>
          </div>
        </div>
      </div>
    );
  });

export default HWLive;
