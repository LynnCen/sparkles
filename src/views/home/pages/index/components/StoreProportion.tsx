// 各类型店铺占比
import { FC } from 'react';
import styles from '../entry.module.less';

const StoreProportion: FC<any> = () => {
  return (
    <div className={styles.storeProportionCon}>
      <div className='fs-16 bold'>
        各类型店铺占比

      </div>
      <img
        src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_store_proportion.png'
        className={styles.bg} />
    </div>
  );
};
export default StoreProportion;
