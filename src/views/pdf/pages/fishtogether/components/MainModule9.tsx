import { FC } from 'react';
import { imgUrlSuffix } from '../ts-config';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';

const MainModule9: FC<any> = ({
  number,
  res
}) => {
  return (
    <div className={cs(styles.mainModule, styles.mainModule9)}>
      <TopTitle number={number}>{res?.[0]?.title}</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <div className={cs(styles.module9Flex, 'mb-12')}>
          {
            res?.length ? <div className={styles.moduleCon}>
              <div className={styles.moduleImg}>
                <img src={`${res?.[0]?.url ? `${res[0].url}${imgUrlSuffix.size480}` : ''}`} alt='' />
              </div>
            </div> : '暂无数据'
          }
        </div>
        <div className={styles.remark}>{res?.[0]?.remark}</div>
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule9;
