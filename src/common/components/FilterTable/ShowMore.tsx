import { FC } from 'react';
import styles from './index.module.less';
import { Tooltip } from 'antd';
const ShowMore: FC<any> = ({
  text,
  maxWidth = '210px', // 建议table.columns.td的width设置比maxWidth多20px即可
}) => {
  return (
    <Tooltip placement='topLeft' title={text}>
      <div className={styles.showMore} style={{ maxWidth }}>
        {text}
      </div>
    </Tooltip>
  );
};

export default ShowMore;
