import { FC, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { message as msg, Button } from 'antd';
import { PlayCircleFilled, FullscreenOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { YDLiveProps } from './ts-config';
import { isArray } from '@lhb/func';
import dayjs from 'dayjs';
import cs from 'classnames';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';

const speedLevelData = [1, 2, 4, 8, 16];

const YDLive: FC<YDLiveProps> = forwardRef(
  (
    {
      url,
      bigDataSend, // 埋点方法
      isLive, // 直播
      startTime
    },
    ref
  ) => {
    const [isPlay, setIsPlay] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [showBar, setShowBar] = useState(true);
    const [speedLevel, setSpeedLevel] = useState<number>(0);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const pauseRef = useRef(null);

    const {
      start,
      onload,
      removeOldBtn,
      stopHandle,
      playCircleChange,
      oncapture,
      fullScreenHandle,
      onChangeSpeed
    } = useMethods({
      // 点击播放
      start: () => {
        onload();
        setIsPause(false);
        setSpeedLevel(0);
      },
      onload: async () => {
        await window.getScript('YDPlayer');
        const YD = window.YDPlayer('YDPlayerCompatible');
        const container = videoRef.current;
        const player: any = YD.createPlayer(
          container,
          { screenX: 1, screenY: 1, ratio: 0.5625, spinner: true },
          ['native', 'ydplayerjs']
        );
        playerRef.current = player;
        // 直播
        if (isLive) {
          setTimeout(() => {
            player.openStreaming(url, 1).catch(() => {
              msg.error(`播放发生错误`);
            });
          }, 0);
        } else {
          // 开始播放回放
          setTimeout(() => {
            player.openPlayback(url, new Date(dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'))).catch(r => {
              msg.error(r?.message || `播放发生错误`);
            });
          }, 0);
        }
        player.on('playing', function () {
          removeOldBtn(); // 去掉原来的按钮,需要在播放器实例化之后执行
          // 开始播放（继续播放不在这里上报），只有一开始点击播放按钮才会触发，和团威同步过
          if (!isPause) {
            // 开始播放埋点上报
            bigDataSend('d46c35fb-476e-450c-8c97-ba805166f359');
          }
        });
        setIsPlay(true);
      },
      removeOldBtn: () => {
        const tagetEl = videoRef.current;
        const el = (tagetEl as any)?.childNodes[0]?.childNodes[0]?.childNodes;
        if (!isArray(el)) return;
        /**
         * 播放器重复实例化会生成多个底部控制台
         * 尝试过方案1: 在执行stopHandle的时候清除整个实例，后续还是会有多个控制台
         */
        for (let i = 0; i < el.length; i++) {
          if (el[i].className.indexOf('ydplayer-video-operate') > -1) {
            el[i].remove(el[i]);
            i--;
          };
        };
      },
      // 暂停
      stopHandle: () => {
        playerRef.current && (playerRef.current as any).stop();
        setIsPlay(false);
        setIsPause(false);
      },
      playCircleChange: async () => {
        // 暂停/继续播放埋点上报
        bigDataSend('e11be5b1-0f82-4fc8-969a-709d50934f8d');
        if (isPause) {
          start();
        } else {
          setIsPause(true);
          const res = await (playerRef.current as any).capture();
          res && oncapture(res);
          isLive ? (playerRef.current as any).closeStreaming() : (playerRef.current as any).closePlayback();
        }
      },
      oncapture: (result: Record<string, any>) => {
        if (!pauseRef) return;
        const images: any = pauseRef.current;
        images.innerHTML = '';
        const url = result.url; // SN: url.sn;  Channel: url.channel
        const data = result.data;
        images.insertAdjacentHTML(
          'beforeend',
          '<div style="box-sizing: border-box; min-width: 50%; display: inline-block; vertical-align:middle; position: relative; border: 1px solid transparent; width:100%"><img style="width:100%;" src="' +
          data +
          '" /><p>' +
          url.sn +
          ':' +
          url.channel +
          '</p></div>'
        );
      },
      fullScreenHandle: () => {
        (playerRef.current as any).requestFullscreen();
      },
      onChangeSpeed: () => {
        if (speedLevel === speedLevelData.length - 1) {
          setSpeedLevel(0);
        } else {
          setSpeedLevel(speedLevel + 1);
        };
      }
    });

    // 将load方法暴露给父组件，可在父组件中使用该方法
    useImperativeHandle(ref, () => ({
      stop: stopHandle,
    }));

    useEffect(() => {
      playerRef.current && (playerRef.current as any).changePlayback(speedLevelData[speedLevel]).catch(function (err) {
        console.error(err);
      });
    }, [speedLevel]);
    return (
      <div
        className={styles.ydContainer}
        onMouseEnter={() => setShowBar(true)}
        onMouseLeave={() => setShowBar(false)}>
        {
          !isPlay && (
            <div className={styles.placeholderSection}>
              <div className={styles.container}>
                {/* <IconFont className={styles.logoIcon} iconHref='icon-loc-fanbai' /> */}
                <PlayCircleFilled className={styles.pauseIcon} onClick={start} />
              </div>
            </div>
          )
        }
        {
          isPause && (<div ref={pauseRef} className={styles.pauseImg}></div>)
        }
        <div className={cs(styles.barCon, showBar && styles.visibleBar)}>
          <span>
            {isPause ? <PlayCircleFilled className='fn-20 color-white pointer' onClick={playCircleChange} /> : <PauseCircleOutlined className='fn-20 color-white pointer' onClick={playCircleChange} />}
            {!isLive && <Button type='link' className='color-white pointer ml-10' onClick={onChangeSpeed}>倍速{speedLevelData[speedLevel]}X</Button>}
          </span>
          <FullscreenOutlined className='fn-20 color-white pointer' onClick={fullScreenHandle} />
        </div>
        <div ref={videoRef}></div>
      </div>
    );
  });

export default YDLive;
