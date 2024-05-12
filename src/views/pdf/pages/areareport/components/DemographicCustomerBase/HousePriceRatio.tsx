/**
 * @Description 居住社区房价等级
 */

import { FC } from 'react';
import V2PieChart from '@/common/components/Charts/V2PieChart';
import { CardLayout } from '../Layout';

interface HousePriceRatioProps{
  [k:string]:any
}
const HousePriceRatio: FC<HousePriceRatioProps> = ({
  detail,
}) => {
  return (
    <CardLayout title='社区房价等级'>
      <V2PieChart
        title=''
        type='circle'
        seriesData={[{
          animation: false,
          data: detail,
          unit: '%'
        }]}
        height={260}
      />
    </CardLayout>

  );
};

export default HousePriceRatio;
