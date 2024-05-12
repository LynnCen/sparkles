import { Progress, ProgressProps } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';

interface ProgressWithTitleProps {
  title?:string; // 下方标题
  percent?:number; // 下方标题
  config?:ProgressProps; // 进度条额外参数
};


const ProgressWithTitle : FC<ProgressWithTitleProps> = ({
  title,
  percent,
  config = {}
}) => {

  return (
    <div className={styles.progressWithMsg}>
      <Progress type='circle' percent={percent} width={48} strokeColor={'#73A0FA'} {...config}/>
      {title && <div className={styles.title}>{title}</div>}
    </div>
  );
};

export default ProgressWithTitle;
