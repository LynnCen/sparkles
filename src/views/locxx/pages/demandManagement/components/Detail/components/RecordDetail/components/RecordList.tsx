/**
 * @Description
 */

import IconFont from '@/common/components/Base/IconFont';
import { replaceEmpty } from '@lhb/func';
import { List, Space, Avatar, Spin } from 'antd';
import cs from 'classnames';

import styles from '../index.module.less';


const RecordList = ({
  mainHeight,
  loading,
  audioRef,
  onPause,
  recordDetail,
  onPlay
}) => {

  /** 用户对象 */
  const speakerObj = (speaker:string = 'ME'):any => {
    return {
      AI: {
        avatar: 'https://staticres.linhuiba.com/project-custom/saas-manage/img/ic_kefu.png',
        className: 'right',
      },
      ME: {
        avatar: 'https://staticres.linhuiba.com/project-custom/saas-manage/img/ic_kehu.png',
        className: 'left',
      }
    }[speaker];
  };

  return (
    <div className={styles.view} style={{ height: mainHeight }}>
      <div className={styles.msgList}>
        <Spin spinning={loading}>
          <audio
            controls
            preload='auto'
            ref={audioRef}
            onPause={onPause}
            src={recordDetail.contentUrl}
          />
          <List
            itemLayout='horizontal'
            dataSource={recordDetail.phoneLogVOList}
            split={false}
            renderItem={(item:any) => {
              return <List.Item className={cs(styles[speakerObj(item.speaker).className])}>
                <Space align='start'>
                  {item.speaker === 'ME' && <Avatar size={36} src={speakerObj(item.speaker).avatar} />}
                  <div className={styles.msg}>
                    {item.speaker === 'ME' && <IconFont iconHref='icon-ic_yuyin' onClick={() => onPlay(item.startTime, item.endTime)}/>}
                    {replaceEmpty(item.content) }
                  </div>
                  {item.speaker === 'AI' && <Avatar size={36} src={speakerObj(item.speaker).avatar} />}
                </Space>
              </List.Item>;
            }}
          />
        </Spin>
      </div>
    </div>
  );
};

export default RecordList;
