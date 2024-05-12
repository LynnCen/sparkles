/**
 * @Description 餐饮消费价格
 */

import { FC } from 'react';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import { CardLayout } from '../Layout';


interface FoodConsumeLevelRatioProps{
  [k:string]:any
}
const FoodConsumeLevelRatio: FC<FoodConsumeLevelRatioProps> = ({
  detail,
}) => {
  return (
    <CardLayout title='餐饮消费价格'>
      <V2BarChart
        title=''
        direction='horizontal'
        theme='green'
        xAxisData={detail?.map((item) => item.name) || []}
        seriesData={[{
          data: detail,
          animation: false,
          unit: '%',
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            ellipsis: '...',
            color: '#222222',
            fontSize: 14 }
        // center: ['50%', '30%'],
        }]}
        height={264}
        config={{
          legend: {
            show: false
          },
          grid: {
            left: 80,
            top: 16,
            right: 54,
            bottom: 24,
          },
          yAxis: {
            // min: 0, // 设置 y 轴的最小值
            // max: 100, // 设置 y 轴的最大值
            axisLabel: {
              formatter: '{value}%'
            },
          },
        }}
      />
    </CardLayout>

  );
};

export default FoodConsumeLevelRatio;
