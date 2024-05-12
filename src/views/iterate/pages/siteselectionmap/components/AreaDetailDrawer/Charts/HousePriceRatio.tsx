/**
 * @Description 居住社区房价等级
 */

import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2PieChart from '@/common/components/Charts/V2PieChart';

const HousePriceRatio: FC<any> = ({
  detail,
}) => {
  return (
    <div className={cs(styles.chartWrapper, styles.pieChart, 'pd-16')}>
      <div className='fs-14 c-222 bold'>居住社区房价等级</div>
      <V2PieChart
        title=''
        type='circle'
        seriesData={[{
          data: detail,
          unit: '%',
          animation: false,
        }]}
        height={260}
      />
    </div>
  );
};

export default HousePriceRatio;
