import { FC } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';
import DoubleCircle from './DoubleCircle';

const Cover: FC<any> = ({
  name
}) => {

  return (
    <div className={styles.coverCon}>
      <div className={styles.header}>
        <DoubleCircle/>
        <div className={styles.report}>
          {/* ASSESSMENT REPORT */}
          <img src='https://staticres.linhuiba.com/project-custom/locationpc/pdf/ic_location.png'
            style={{
              width: '144px',
              height: '37px',
            }}
          />
        </div>
      </div>
      <div className={cs(styles.titCon)}>
        <img
          // src='https://staticres.linhuiba.com/project-custom/location-insight/bg_title@2x.png'
          src='https://staticres.linhuiba.com/project-custom/saas-manage/img/report_title.png'
          width='100%'
          height='100%'/>
      </div>
      <div className='fs-32 mt-40'>
        {name}
      </div>
      <div className={styles.qrCode}>
        <img
          src='https://staticres.linhuiba.com/project-custom/saas-manage/img/location_qrcode.png'
          width='108px'
          height='108px'/>
        <p>联系我们</p>
      </div>
    </div>
  );
};

export default Cover;
