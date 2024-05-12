import { FC, useEffect } from 'react';
// import cs from 'classnames';
import styles from '../../entry.module.less';

const RadarAngleItem: FC<any> = ({
  title,
  color,
  // score
}) => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={styles.radarAngleItemCon}>
      <div
        className={styles.decorateStick} style={{
          background: color
        }}></div>
      <div>
        <div className='fs-16 c-fff'>
          {title}
        </div>
        {/* <div className='fs-14 cOpaWhite mt-5'>
          分数
          <span className='c-02e fs-20'>  {score || 0}</span>
        </div> */}
      </div>
    </div>
  );
};

export default RadarAngleItem;
