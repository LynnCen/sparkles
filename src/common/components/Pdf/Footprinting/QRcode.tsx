import { FC, } from 'react';
import styles from './entry.module.less';
const QRcode: FC<any> = () => {

  return (
    <div className={styles.code}>
      <img src='https://staticres.linhuiba.com/project-custom/locationpc/pdf/qr_code.png' alt='' />
      <div className={styles.text}>联系我们</div>
    </div>
  );
};

export default QRcode;

