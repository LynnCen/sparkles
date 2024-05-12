import { FC } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';
import DoubleCircle from './DoubleCircle';

const Cover: FC<any> = ({
  name
}) => {

  return (
    <div className={styles.coverCon}>
      <div className='rt fs-16'>
        ASSESSMENT REPORT
      </div>
      <div className={cs(styles.titCon, 'mt-36')}>
        <img
          src='https://staticres.linhuiba.com/project-custom/location-insight/bg_title@2x.png'
          width='100%'
          height='100%'/>
      </div>
      <div className={cs(styles.placeholderRectangle, 'mt-100')}></div>
      <div className='fs-20 mt-32'>
        {name}
      </div>
      <DoubleCircle/>
    </div>
  );
};

export default Cover;
