import React from 'react';
import { CardLayout } from '../Layout';
import V2PieChart from '@/common/components/Charts/V2PieChart';
interface EducationPieProps{
  [k:string]:any
}
const EducationPie:React.FC<EducationPieProps> = ({ educationdetail }) => {
  return <CardLayout title='客群学历分布'>
    <V2PieChart
      title=''
      type='circle'
      seriesData={[{
        data: educationdetail,
        unit: '%',
        animation: false,
      }]}
      height={260}
    />
  </CardLayout>;
};

export default EducationPie;


