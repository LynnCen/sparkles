import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import Map from './Map';
import RightCon from './RightCon';
import { CardLayout } from '../CardLayout';
import { post } from '@/common/request';
interface StoreMapProps {
  data?: any
  title?:string
}
const StoreMap: React.FC<StoreMapProps> = ({ title }) => {
  const [data, setData] = useState<any>({});

  const getData = () => {
    // https://yapi.lanhanba.com/project/532/interface/api/70426
    post('/standard/home/shopDistribution').then((res:any) => {
      setData(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);


  return <CardLayout title={title} className={styles.storeMapCon} >
    <Map provinceCountList={data.provinceCountList}/>
    <RightCon data={data}/>
  </CardLayout>;
};

export default StoreMap;

