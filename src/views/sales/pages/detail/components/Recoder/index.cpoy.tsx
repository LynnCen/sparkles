import { Space, Timeline } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';

const { Item } = Timeline;

interface RecoderProps {

}

const style = {
  color: '#132144',
  fontWeight: 'bold',
  whiteSpace: 'nowrap'
};

const renderDot = () => {
  return (
    <div className={styles.dotWrap}>
      <div className={styles.dotContent}></div>
    </div>
  );
};


const Recoder: FC<RecoderProps> = () => {
  return (
    <div className={styles.timeLineWrap}>
      <Timeline mode='left'>
        <Item label='10-18 星期二' dot={renderDot()}>
          <Space align='start' style={style as any}>
            <span>15:46</span>
            <span>王宇</span>
            <Space direction='vertical'>
              <span>
            改价，将场地费由100修改为500，修改
              </span>
              <span>
            改价，将场地费由100修改为500，修改
              </span>
            </Space>
          </Space>
        </Item>
        <Item label='10-18 星期二' position='left' dot={renderDot()}>
          <Space align='start' style={style as any}>
            <span>15:46</span>
            <span>王宇</span>
            <Space direction='vertical'>
              <span>
            改价，将场地费由100修改为500，修改
              </span>
              <span>
            改价，将场地费由100修改为500，修改
              </span>
            </Space>
          </Space>
        </Item>
        <Item label='10-18 星期二' position='left' dot={renderDot()}>
          <Space align='start' style={style as any}>
            <span>15:46</span>
            <span>王宇</span>
            <Space direction='vertical'>
              <span>改价，将场地费由100修改为500，修改</span>
            </Space>
          </Space>
        </Item>
        <Item label='10-18 星期二' position='left' dot={renderDot()}>
          <Space align='start' style={style as any}>
            <span>15:46</span>
            <span>王宇</span>
            <Space direction='vertical'>
              <span>改价，将场地费由100修改为500，修改
              </span>
            </Space>
          </Space>
        </Item>
      </Timeline>
    </div>
  );

};

export default Recoder;
