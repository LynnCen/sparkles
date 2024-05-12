/**
 * @Description 顾客组柱状图表
 */

import { FC, useMemo } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import V2PieChart from '@/common/components/Charts/V2PieChart';

const CustomerGroupChart: FC<any> = ({
  data
}) => {
  const chartData = useMemo(() => {
    return data?.map((item: any) => ({ value: item.count || 0, name: item.name }));
  }, [data]);

  return (
    <div className={styles.customerGroupChart}>
      <div className={styles.title}>客户组规模</div>
      <V2PieChart
        type='circle'
        seriesData={[{
          data: chartData,
        }]}
        config={{
          title: {
            left: '10%'
          }
        }}
        width={600}
        height={414}
      />
    </div>
  );
};

export default CustomerGroupChart;

