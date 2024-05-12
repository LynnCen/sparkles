import { FC, useEffect, useState } from 'react';
import { targetMaxItem } from '@/common/utils/ways';
import styles from '../../entry.module.less';
import Header from '../../Header';
import BarEcharts from '../../BarEcharts';
import DoubleCircle from '../../DoubleCircle';
import cs from 'classnames';

const Catering: FC<any> = ({
  catering,
  isIntegration

}) => {

  const [rankStr, setRankStr] = useState<string>('');
  const targetIndex = {
    1: '第一',
    2: '前二',
    3: '前三',
  };
  useEffect(() => {
    if (Array.isArray(catering) && catering.length) {
      const targetCatering = targetMaxItem({ data: catering, targetCount: 3 });
      const len = targetCatering.length;
      let str = `门店数${targetIndex[len]}的菜系:`;
      for (let i = 0; i < len; i++) {
        str += catering[i].name ? `${catering[i].name}${i < len - 1 ? '，' : ''}` : '';
      }
      setRankStr(str);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catering]);

  return (
    <div className={cs(styles.cateringCon, isIntegration && styles.integration)}>
      <Header
        hasIndex
        indexVal='03'
        name='商业氛围评估-餐饮业态'/>
      { rankStr && <div className={styles.pointCon}>
        {rankStr}
      </div>
      }
      <BarEcharts
        config={{
          data: catering,
          // isPercent: true
        }}
        width='100%'
        height='450px'/>
      <DoubleCircle/>
    </div>
  );
};

export default Catering;
