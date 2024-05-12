import React from 'react';
import styles from './index.module.less';
import { CardLayout } from '../CardLayout';
import Map from './Map';
import RightCon from './RightCon';
interface StoreMapProps {
  data?: any
  title?:string
}
const StoreMap: React.FC<StoreMapProps> = ({ title }) => {


  return <CardLayout title={title} className={styles.storeMapCon} >
    <Map/>
    <RightCon/>
  </CardLayout>;
};

export default StoreMap;

