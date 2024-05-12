import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './entry.module.less';

const Pdf: FC<any> = () => {
  return (
    <div className={styles.container}>
      <div className='bold ft-64 mt-100'>
        快捷导航
      </div>
      <div className='mt-20'>
        <Link to='/pdf/insight'>踩点报告PDF页</Link>
      </div>
      {/* <div className='mt-20'>
        <Link to='/pdf/footprint'>踩点报告PDF页</Link>
      </div> */}
    </div>
  );
};

export default Pdf;
