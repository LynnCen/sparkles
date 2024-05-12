/**
 * @Description 机会点详情页-顶部小方块，显示标题、数值、单位
 */
import { FC } from 'react';
import styles from './index.module.less';
import { beautifyThePrice, isDef } from '@lhb/func';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface TopItemProps {
  title: string;
  count?: any;
  unit?: string;
  explain?: string; // 气泡提示文字
}

const TopItem: FC<TopItemProps> = ({
  title,
  count,
  unit,
  explain = '',
}) => {

  return (
    <div className={styles.topItem}>
      <div className={styles.countRow}>
        <span className={styles.count}>{isDef(count) ? beautifyThePrice(Number(count), ',', 0) : '-' }</span>
        {!!unit && <span className='ml-2 fs-12 c-132'>{unit}</span>}
        {!!explain && <Tooltip title={explain}>
          <InfoCircleOutlined className={styles.infoIcon} />
        </Tooltip>}
      </div>
      <div className='mt-6 fs-12 c-666'>{title}</div>
    </div>
  );
};

export default TopItem;
