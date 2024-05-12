/**
 * @Description
 */

import LBSBottom from '@/common/components/business/SurroundDrawer/components/LBSBottom';
import { FC, useRef } from 'react';
import styles from '../index.module.less';


const LbsReport: FC<any> = ({
  detail
}) => {

  const lbsRef:any = useRef();
  // 在这里编写组件的逻辑和渲染
  const type = {
    title: '', // TODO:
    img: 'https://staticres.linhuiba.com/project-custom/locationpc/surround/bg_sourround_lbslock.png'
  };
  const onLock = () => {
    lbsRef.current.handleUnlock();
  };
  return (
    <LBSBottom
      ref={lbsRef}
      detail={detail}
      extraType={type}
      mainClassName={styles.report}
      lockContentSlot={
        <div className={styles.lockCon}>
          <div className={styles.lock}>
            <span className={styles.icon}/>
          </div>
          <div className={styles.btn} onClick={onLock}>
          解锁VIP分析报告
          </div>
        </div>
      }
    />
  );
};

export default LbsReport;
