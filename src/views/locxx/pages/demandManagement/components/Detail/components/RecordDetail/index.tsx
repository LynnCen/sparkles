import { FC, useEffect, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { floorKeep } from '@lhb/func';

import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import IconFont from '@/common/components/Base/IconFont';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { get } from '@/common/request';
import V2Container from '@/common/components/Data/V2Container';
import RecordList from './components/RecordList';

interface phoneLogItem{
  /** 对话内容 */
  content:string;
  /** 开始时间 */
  startTime:number;
  /** 结束时间 */
  endTime:number;
  /** 说话方  百应电脑：AI ， 客户： ME */
  speaker:string;
}

interface byaiSessionRes {
  phoneLogVOList: phoneLogItem[];
  contentUrl: string;
}

/**
 * @Description 录音内容
 */
const RecordDetail:FC<any> = ({
  detailRightExtraData,
  handleRightExtra = () => {}
}) => {
  const audioRef:any = useRef<HTMLAudioElement>(null);
  const timerRef:any = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [recordDetail, setRecordDetail] = useState<byaiSessionRes>({
    phoneLogVOList: [],
    contentUrl: '',
  });



  const methods = useMethods({
    onPlay(startTime:number, endTime:number) {
      // 点哪句播放哪句，暂停在顶部 audio 标签暂停
      if (isNaN(startTime) || isNaN(endTime)) V2Message.error('语音播放失败');
      // 先把之前的定时器清除
      clearTimeout(timerRef.current);
      // 对时长进行排序，byai 返回的开始结束时间可能有问题
      const timeArr:number[] = [startTime, endTime];
      timeArr.sort((a, b) => a - b);
      const _startTime = timeArr[0];
      const _endTime = timeArr[1];
      const _duration:number = Number(floorKeep(_endTime, _startTime, 1, 0));
      audioRef.current.currentTime = floorKeep(_startTime, 1000, 4, 0); // currentTime 以秒为单位
      const playPromise = audioRef.current?.play();

      if (playPromise) {
        playPromise.then(() => {
          // 设定播放时长
          timerRef.current = setTimeout(() => {
            audioRef.current?.pause();
          }, _duration || 1000);
        }).catch((error) => {
          console.log('播放失败', error);
        });
      }
    },
    /**
     *  暂停播放，用户如果点击audio 标签的播放就清除定时器，防止音频播放定时停止
     */
    onPause() {
      clearTimeout(timerRef.current);
    },
    getSession() {
      setLoading(true);
      get('/locxx/byai/session', { callInstanceId: detailRightExtraData.callInstanceId }, { proxyApi: '/lcn-api' }).then((res:byaiSessionRes) => {
        setRecordDetail(res);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  });
  useEffect(() => {
    if (detailRightExtraData.visible) {
      detailRightExtraData.callInstanceId && methods.getSession();
    }
  }, [detailRightExtraData.visible]);


  return (
    <V2Container
      className={styles.recordDetail}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: <div className={styles.header}>
          <V2Title type='H2' text='录音内容' className={styles.headerTitle} extra={<IconFont iconHref='pc-common-icon-ic_closeone' onClick={() => handleRightExtra('', false)}/>}/>
        </div>
      }}
    >
      <RecordList
        mainHeight={mainHeight}
        loading={loading}
        audioRef={audioRef}
        recordDetail={recordDetail}
        onPause={methods.onPause}
        onPlay={methods.onPlay}/>
    </V2Container>
  );
};

export default RecordDetail;
