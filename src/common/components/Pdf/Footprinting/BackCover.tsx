import { FC, } from 'react';
import styles from './entry.module.less';
import QRcode from './QRcode';
const BackCover: FC<any> = () => {

  return (
    <div className={styles.backCoverCon}>
      <div className={styles.backCode}>
        <QRcode/>
      </div>
    </div>
  );
};

export default BackCover;
