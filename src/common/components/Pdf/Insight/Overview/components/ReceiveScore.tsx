import { FC } from 'react';
import styles from '../../entry.module.less';
import Explain from './Explain';

const ReceiveScore: FC<any> = ({
  info
}) => {

  return (
    <div className={styles.receiveScoreCon}>
      <div className='fs-19 bold'>
        商圈评估
      </div>
      <div>
        <span className='c-02e fs-50'>{info?.scoreDescription}</span>
        {/* <span className='fs-14 cOpaWhite pl-8'>分/100</span> */}
      </div>
      <Explain scoreVal={info?.score}/>
    </div>
  );
};

export default ReceiveScore;
