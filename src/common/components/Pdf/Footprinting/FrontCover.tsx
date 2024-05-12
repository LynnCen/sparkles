import { FC } from 'react';
import styles from './entry.module.less';
import QRcode from './QRcode';
interface Props{
  name:string
}
const Cover: FC<Props> = ({
  name
}) => {

  return (
    <div className={styles.frontCoverCon}>
      <div className={styles.content}>
        <div className={styles.name}>
          {name}
        </div>
        <div className={styles.frontCover}>
          <QRcode/>
        </div>
      </div>
    </div>
  );
};

export default Cover;
