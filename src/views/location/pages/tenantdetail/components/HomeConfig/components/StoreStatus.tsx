import React from 'react';
import { CardLayout } from './CardLayout';
import V2PieChart from '@/common/components/Charts/V2PieChart';
interface StoreStatusProps {
  data?:any,
  style:React.CSSProperties
}
const StoreStatus: React.FC<StoreStatusProps> = (props) => {
  return <CardLayout title={props.data.title} style={props.style}>
    <V2PieChart
      type='circle'
      seriesData={[{
        data: [
          { value: 1048, name: '已签约' },
          { value: 735, name: '已交房' },
          { value: 580, name: '开业中' },
          { value: 484, name: '已闭店' },
        ],
      }]}
    />
  </CardLayout>;
};

export default React.memo(StoreStatus);
