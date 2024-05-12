/**
 * @Description 客群学历分布
 */

import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2PieChart from '@/common/components/Charts/V2PieChart';

const EducationRatio: FC<any> = ({
  detail,
}) => {
  return (
    <div className={cs(styles.chartWrapper, styles.pieChart, 'pd-16')}>
      <div className='fs-14 c-222 bold'>客群学历分布</div>
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

export default EducationRatio;
