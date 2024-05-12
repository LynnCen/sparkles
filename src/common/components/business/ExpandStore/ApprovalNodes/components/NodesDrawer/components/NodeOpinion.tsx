/**
 * @Description 节点意见
 */
import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

const NodeOpinion: FC<any> = ({
  textStr, // 意见
  isStart, // 是否是发起节点
}) => {

  return (
    <V2DetailItem
      label=''
    >
      <div
        className={cs(
          styles.opinionCon,
          isStart ? styles.isStart : '',
          'c-222 fs-14'
        )}
      >
        {textStr}
      </div>
    </V2DetailItem>
  );
};

export default NodeOpinion;
