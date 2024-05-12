/**
 * @Description 目录的
 */
import { FC, useMemo } from 'react';

import styles from './index.module.less';


const ListTitle: FC<any> = ({
  size = 'normal',
  index,
  title,
  subheadingEn
}) => {
  const isLargeSize = useMemo(() => (size === 'large'), [size]);

  return (
    <div className={styles.listTitle}>
      {!!index && <div className={styles[isLargeSize ? 'largeNumber' : 'number']}>
        {index}
      </div>}
      <div className={styles['titleContent']}>
        <p className={styles[isLargeSize ? 'largeTitle' : 'title']}>{title}</p>
        <p className={styles[isLargeSize ? 'largeSubheadingEn' : 'subheadingEn']}>{subheadingEn}</p>
      </div>
    </div>
  );
};

export default ListTitle;
