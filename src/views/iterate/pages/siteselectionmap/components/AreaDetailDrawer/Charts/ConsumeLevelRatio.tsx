/**
 * @Description 消费水平
 */

import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2BarChart from '@/common/components/Charts/V2BarChart';

const ConsumeLevelRatio: FC<any> = ({
  detail,
}) => {
  return (
    <div className={cs(styles.chartWrapper, styles.pieChart, 'pd-16')}>
      <div className='fs-14 c-222 bold'>消费水平</div>
      <V2BarChart
        title=''
        xAxisData={detail?.map((item) => item.name) || []}
        seriesData={[{
          data: detail,
          unit: '%',
          animation: false,
          // center: ['50%', '30%'],
        }]}
        height={264}
        config={{
          legend: {
            show: false
          },
          grid: {
            top: 24,
            bottom: 24
          },
          yAxis: {
            // min: 0, // 设置 y 轴的最小值
            // max: 100, // 设置 y 轴的最大值
            axisLabel: {
              formatter: '{value}%'
            },
          },
          // tooltip: {
          //   formatter: '{b}: {c}%'
          // }
        }}
      />
    </div>
  );
};

export default ConsumeLevelRatio;
