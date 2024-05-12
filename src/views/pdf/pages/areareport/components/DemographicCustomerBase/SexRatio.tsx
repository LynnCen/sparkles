import React from 'react';
import { CardLayout } from '../Layout';
import SexRate from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer/Charts/SexRate';
interface SexRatioProps{
  [k:string]:any
}
const SexRatio:React.FC<SexRatioProps> = (props) => {
  return <CardLayout title='性别比例'>
    <SexRate data={props.sexInfo} className='withOutBorder'/>
  </CardLayout>;
};

export default SexRatio;


