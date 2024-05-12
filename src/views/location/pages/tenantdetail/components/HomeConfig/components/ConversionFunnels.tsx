import React from 'react';
import { CardLayout } from './CardLayout';
import V2FunnelChart from '@/common/components/Charts/V2FunnelChart';
import styles from './index.module.less';
interface ConversionFunnelsProps {
  data: any,
  title: string,
  style: React.CSSProperties
}
const ConversionFunnels: React.FC<ConversionFunnelsProps> = ({ data, style, title }) => {
  return <CardLayout title={title} style={style}>
    <div className={styles.funnel} >
      <V2FunnelChart
        seriesData={data.map((item, index) => {
          if (index !== data.length - 1) {
            return {
              ...item,
              name: item.title,
              value: (data.length - index) * 1000,
              describe: '转化率',
              percent: '80%',
            };
          } else {
            return {
              ...item,
              name: item.title,
              value: (data.length - index) * 1000,
            };
          }
        })}
      />
    </div>

  </CardLayout>;
};

export default ConversionFunnels;
