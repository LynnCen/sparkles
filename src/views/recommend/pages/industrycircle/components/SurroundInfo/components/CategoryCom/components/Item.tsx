/**
 * @Description 单个项
 */
import { FC } from 'react';
import styles from '../index.module.less';
import { Tooltip } from 'antd';

interface Props {
  itemData:any // 元素内容数据
}

const Item: FC<Props> = ({
  itemData
}) => {
  // 在这里编写组件的逻辑和渲染
  return (
    <div className={styles.item}>
      <div
        className={styles.iconImg}
        style={{
          backgroundImage: `url('${itemData.icon}'`
        }}
      >
      </div>
      <div className={styles.address}>
        <span className={styles.mainAdd}>
          <Tooltip title={itemData?.name}>
            {itemData?.name}
          </Tooltip>
        </span>
        <span className={styles.exraAdd}>
          <Tooltip title={itemData?.address}>
            {itemData?.address}
          </Tooltip>
        </span>
      </div>
      {
        itemData?.distance > 0 && <div className={styles.distance}>
          {itemData?.distance > 1000 ? `${itemData?.distance / 1000}km` : itemData?.distance + 'm'}
        </div>
      }


    </div>
  );
};

export default Item;
