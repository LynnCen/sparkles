/**
 * @Description 单个信息块
 */

import { FC } from 'react';
import styles from '../index.module.less';
import cs from 'classnames';

interface itemType{
  name:string;
  value?:any
  unit?:string // 单位
}

interface Props {
  index :number, // 索引
  item :itemType// 块信息
}

const MyComponent: FC<Props> = ({
  index,
  item
}) => {
  // 在这里编写组件的逻辑和渲染
  return (
    <div key={index} className={cs(styles.itemBlock, 'mt-8')}>
      <div className={styles.itemName}>{item.name}</div>
      <div className={styles.valueBlock}>
        <span className={styles.itemValue}>{item.value || '-'}</span>
                    &nbsp;
        <span className='fs-12'>{item.unit}</span>
      </div>
    </div>
  );
};

export default MyComponent;
