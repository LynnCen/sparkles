/**
 * @Description 列表内容-cell item
 *
 */

import { FC, useMemo } from 'react';
import cs from 'classnames';
import styles from '../index.module.less';
import { isNotEmpty } from '@lhb/func';

const ListItem: FC<any> = ({
  item,
  handleItem, // 点击商圈项
}) => {
  /**
   * @description 显示与当前poi距离
   */
  const distanceStr = useMemo(() => {
    const distance = item.distance; // 接口返回数据单位m
    if (!isNotEmpty(distance)) return '';

    if (distance >= 10000) {
      return `${(distance / 1000).toFixed(0)}km`;
    } else if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    } else {
      return `${distance}m`;
    }
  }, [item]);

  return (
    <div className={cs(styles.listItem, 'pd-12')} onClick={() => handleItem(item)}>
      <div className={styles.titleRow}>
        <div className={styles.rowLeft}>
          <div className={cs(styles.imgBox, 'mr-8')}>
            <img src={item.icon} width='100%' height='100%' />
          </div>
          <div className={cs(styles.titCon, 'fs-14 c-222 bold')}>
            {item.name}
          </div>
        </div>
        <div className={cs(styles.distance, 'fs-14 c-222 bold')}>
          {distanceStr}
        </div>
      </div>

      <div className={cs(styles.addressRow, 'mt-6 ml-24 fs-12 c-666')}>
        {item.address}
      </div>
    </div>
  );
};

export default ListItem;
