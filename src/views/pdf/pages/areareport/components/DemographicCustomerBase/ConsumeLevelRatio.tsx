/**
 * @Description 消费水平
 */

import { FC } from 'react';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import { CardLayout } from '../Layout';
interface ConsumeLevelRatioProps{
  [k:string]:any
}
const ConsumeLevelRatio: FC<ConsumeLevelRatioProps> = ({
  detail,
}) => {
  return (
    <CardLayout title='消费水平'>
      <V2BarChart
        title=''
        xAxisData={detail?.map((item) => item.name) || []}
        seriesData={[{
          data: detail,
          unit: '%',
          // center: ['50%', '30%'],
          animation: false,
          label: { show: true,
            formatter: '{c}%',
            ellipsis: '...',
            color: '#222222',
            fontSize: 14 }
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
    </CardLayout>
  );
};

export default ConsumeLevelRatio;
