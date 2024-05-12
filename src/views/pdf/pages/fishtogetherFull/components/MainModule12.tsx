import { FC } from 'react';
import { imgUrlSuffix } from '../ts-config';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';

// import V2Title from '@/common/components/Feedback/V2Title';
const MainModule12: FC<any> = ({
  number,
  res,
  remark
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule12)}>
      <TopTitle number={number}>十二、其他</TopTitle>
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

export default MainModule12;
