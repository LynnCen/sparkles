import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import { imgUrlSuffix } from '../ts-config';

// import V2Title from '@/common/components/Feedback/V2Title';
const MainModule8: FC<any> = ({
  number,
  res,
  remark
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule8)}>
      <TopTitle number={number}>八、选址须知/工程条件确认</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <div className={styles.module8Flex}>
          {
            res?.map((item, index) => {
              return <div key={index}>
                <img src={`${item}${imgUrlSuffix.size480}`} alt='' />
              </div>;
            })
          }
        </div>
        {remark && <div className={styles.module8Remark}>{remark}</div>}
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule8;
