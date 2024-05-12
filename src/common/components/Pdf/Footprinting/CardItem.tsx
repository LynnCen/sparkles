import { FC, useEffect, useState, } from 'react';
import styles from './entry.module.less';
import cs from 'classnames';

const Card: FC<any> = ({ type, children }) => {
  const [info, setInfo] = useState<any>([]);
  useEffect(() => {
    switch (type) {
      case 1:
        setInfo({ index: '01', title: '踩点信息' });
        break;
      case 2:
        setInfo({ index: '02', title: '场地信息' });
        break;
      case 3:
        setInfo({ index: '03', title: '店铺信息' });
        break;
    }
  }, [type]);
  return (
    <div className={styles.cardItemCon}>
      <div className={styles.index}>
        <div>
          {info.index}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.line}></div>
        <div className={styles.title}>
          {info.title}
        </div>
        <div className={cs(styles.line, styles.lineSecond)}></div>
        <div className={styles.list}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
