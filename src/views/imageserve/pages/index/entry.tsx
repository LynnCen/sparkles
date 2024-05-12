import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './entry.module.less';
const Imageserve: FC<any> = () => {
  return (
    <div className={styles.container}>
      <div className='bold ft-64 mt-100'>
        快捷导航
      </div>
      <div className='mt-20'>
        <Link to='/imageserve/attachment'>附件资料</Link>
      </div>
    </div>
  );
};

export default Imageserve;
