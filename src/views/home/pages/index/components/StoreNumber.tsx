// 各城市开店数量
import { FC } from 'react';
import styles from '../entry.module.less';

const StoreNumber: FC<any> = () => {
  return (
    <div className={styles.storeNumberCon}>
      <div className='fs-16 bold pl-24 pt-20'>
        各城市开店总数量

      </div>
      <div className={styles.content}>
        <div className={styles.label}>
          <span>城市</span>
          <span>数量</span>
        </div>
        <img
          src='https://staticres.linhuiba.com/project-custom/locationpc/demo/bg_store_number.png'
          className={styles.bg} />
      </div>
    </div>
  );
};
export default StoreNumber;
