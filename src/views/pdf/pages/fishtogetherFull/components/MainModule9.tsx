import { FC, useMemo } from 'react';
import { imgUrlSuffix } from '../ts-config';
import styles from '../entry.module.less';
import cs from 'classnames';
import TopTitle from './Base/TopTitle';
import BottomLogo from './Base/BottomLogo';
import V2Title from '@/common/components/Feedback/V2Title';

const MainModule9: FC<any> = ({
  number,
  res
}) => {
  const isSameModule = useMemo(() => {
    return res?.length !== 2 || res?.[0]?.title === res?.[1]?.title;
  }, [res]);
  return (
    <div className={cs(styles.mainModule, styles.mainModule9)}>
      <TopTitle number={number}>九、项目所在商圈陈述</TopTitle>
      <div className={styles.mainModuleWrapper}>
        <div className={cs(styles.module9Flex, 'mb-10')}>
          {
            res?.length ? <div className={styles.moduleCon}>
              <V2Title divider type='H3' text={res?.[0]?.title} style={{ marginBottom: '10px' }}/>
              <div className={styles.moduleImg}>
                <img src={`${res?.[0]?.url ? `${res[0].url}${imgUrlSuffix.size480}` : ''}`} alt='' />
              </div>
            </div> : '暂无数据'
          }
          {
            res?.length === 2 && <div className={styles.moduleCon}>
              {
                isSameModule
                  ? <V2Title type='H3' text='&nbsp;' style={{ marginBottom: '10px' }}/>
                  : <V2Title divider type='H3' text={res?.[1]?.title} style={{ marginBottom: '10px' }}/>
              }
              <div className={styles.moduleImg}>
                {/* <img src={res?.[1]?.url} alt='' /> */}
                <img src={`${res?.[1]?.url ? `${res[1].url}${imgUrlSuffix.size480}` : ''}`} alt='' />
              </div>
            </div>
          }
        </div>
        {
          isSameModule ? <div className={styles.remark}>{res?.[0]?.remark}</div> : <div className={cs(styles.module9Flex, styles.remark)}>
            <div className={styles.moduleCon}>{res?.[0]?.remark}</div>
            <div className={styles.moduleCon}>{res?.[1]?.remark}</div>
          </div>
        }
      </div>
      <BottomLogo/>
    </div>
  );
};

export default MainModule9;
