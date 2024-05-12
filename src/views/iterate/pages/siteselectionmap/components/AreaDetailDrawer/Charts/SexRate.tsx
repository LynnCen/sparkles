/**
 * @Description 性别比例图
 */
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';
import React, { useMemo } from 'react';
import cs from 'classnames';
const SexRate:React.FC<any> = ({ data, className }) => {
  const rateData: any = useMemo(() => {
    const result = {};
    data?.forEach((item) => {
      result[item.name === '男' ? 'male' : 'female'] = item;
    });
    return result;
  }, [data]);
  return (
    <div className={styles.sexRateWrap} >
      <div className={cs(styles.sexRate, className && styles[className])}>
        <div className={styles.sexInfo}>
          <IconFont iconHref='iconic_man' style={{ width: '20px', height: '20px' }} /><span>男性</span>
        </div>
        <div className={styles.rateContent}>
          <div className={styles.leftRate} style={{ width: `${rateData?.male?.rate}%` }}>
            <div className={styles.rateBar} />
            <div className={styles.ratePercent}>{rateData?.male?.rate}%</div>
          </div>
          <div className={styles.rightRate} style={{ width: `${rateData?.female?.rate}%` }}>
            <div className={styles.rateBar}/>
            <div className={styles.ratePercent}>{rateData?.female?.rate}%</div>
          </div>
        </div>
        <div className={styles.sexInfo}>
          <IconFont iconHref='iconic_woman' style={{ width: '20px', height: '20px' }} /><span>女性</span>
        </div>
      </div>
    </div>
  );
};

export default SexRate;
