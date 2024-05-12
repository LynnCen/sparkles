/**
 * @Description
 */

import { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { PauseCircleFilled, PlayCircleFilled } from '@ant-design/icons';
import { Slider, Popover } from 'antd';
import { speedOptions } from '../ts-config';
import cs from 'classnames';
import styles from './index.module.less';

const SpeedContent = ({
  targetSpeed,
  setTargetSpeed,
  setOpenPopover,
}) => {
  const handleSelect = (item) => {
    setTargetSpeed(item);
    setOpenPopover(false);
  };
  return <>
    {
      speedOptions.map((item: any) => <div
        className={cs('fs-14 pointer', targetSpeed.value === item.value ? 'c-006' : '')}
        onClick={() => handleSelect(item)}
      >
        {item.label}
      </div>)
    }
  </>;
};

const Controls: FC<any> = ({
  videoRef,
  videoDurationRef,
  isPlayStatus,
  duration,
  setIsPlayStatus,
  handlePlay,
}) => {
  const [curTime, setCurTime] = useState<number>(0); // 单位 s
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [targetSpeed, setTargetSpeed] = useState<any>(speedOptions[1]);
  // 监听timeupdate事件
  useEffect(() => {
    videoRef.current?.addEventListener('timeupdate', handleTimeupdate);
    // 视频播放完成
    videoRef.current?.addEventListener('ended', handleEnded);
    return () => {
      videoRef.current && videoRef.current.removeEventListener('timeupdate', handleTimeupdate);
      videoRef.current && videoRef.current.removeEventListener('ended', handleEnded);
    };
  }, []);
  useEffect(() => {
    if (!videoRef.current) return;
    getCurTime(); // 更新播放的时间
    if (isPlayStatus) {
      videoRef.current.play(); // 播放
      // timeIntervalRef.current = setInterval(() => {
      //   getCurTime();
      // }, 1000);
      return;
    }
    videoRef.current.pause(); // 暂停
    // clearInterval(timeIntervalRef.current);
    return () => {
      // timeIntervalRef.current && clearInterval(timeIntervalRef.current);
    };
  }, [isPlayStatus]);

  useEffect(() => {
    if (!duration) return;
    setSliderValue(curTime / duration * 100);
  }, [curTime, duration]);

  useEffect(() => {
    if (!videoRef.current) return;
    const { value } = targetSpeed;
    videoRef.current.playbackRate = value;

  }, [targetSpeed]);
  const {
    getCurTime,
    formatTime,
    formatterTooltipVal,
    handleTimeupdate,
    sliderOnChange,
    handleEnded,
  } = useMethods({
    getCurTime: () => {
      const curTimeVal = videoRef.current.currentTime;
      setCurTime(parseInt(curTimeVal));
    },
    formatTime: (seconds) => {
      // 计算分钟数和剩余的秒数
      const minutes = Math.floor(seconds / 60);
      const remainderSeconds = seconds % 60;
      // 如果分钟数或秒数小于10，则在前面添加一个'0'
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedSeconds = remainderSeconds < 10 ? '0' + remainderSeconds : remainderSeconds;
      // 返回格式化的时间字符串
      return formattedMinutes + ':' + formattedSeconds;
    },
    formatterTooltipVal: (val: number) => {
      const targetTime: number = videoDurationRef.current * val / 100;
      return formatTime(parseInt(targetTime.toString()));
    },
    handleTimeupdate: () => {
      getCurTime();
    },
    sliderOnChange: (val: number) => {
      setSliderValue(val);
      const jumpTime: number = videoDurationRef.current * val / 100; // 拖到要播放的时间
      videoRef.current.currentTime = jumpTime; // 跳转到指定的时间
    },
    handleEnded: () => {
      setIsPlayStatus(false);
    }
  });
  return (
    <div
      className={styles.controlsCon}
      onClick={(e) => e.stopPropagation()}>
      <div onClick={handlePlay}>
        {
          isPlayStatus ? <PauseCircleFilled className='fs-24 color-white pointer'/> : <PlayCircleFilled className='fs-24 color-white pointer'/>
        }
      </div>
      <div className={cs('ml-36 fs-12 color-white', styles.timeCon)}>
        <span className={styles.curTimeCon}>{formatTime(curTime)}</span>
        &nbsp;
        {formatTime(parseInt(duration))}
      </div>
      <div className={cs(styles.progressControl, 'color-white')}>
        <Slider
          value={sliderValue}
          tooltip={{
            formatter: formatterTooltipVal
          }}
          step={0.1}
          style={{
            width: '100%'
          }}
          disabled={duration === 0}
          onChange={sliderOnChange}
        />
      </div>
      <Popover
        content={<SpeedContent
          targetSpeed={targetSpeed}
          setTargetSpeed={setTargetSpeed}
          setOpenPopover={setOpenPopover}
        />}
        open={openPopover}
        trigger='click'
        onOpenChange={(newOpen: boolean) => setOpenPopover(newOpen)}
      >
        <div
          className={cs('fs-14 color-white pointer rt', styles.speedControl)}
        >
          {targetSpeed?.label}
        </div>
      </Popover>
    </div>
  );
};

export default Controls;
