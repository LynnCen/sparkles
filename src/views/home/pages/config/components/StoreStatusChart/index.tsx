/**
 * @Description 门店状态图表
 */

import { FC, useEffect, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import V2PieChart from '@/common/components/Charts/V2PieChart';
import { get } from '@/common/request';
import { isArray } from '@lhb/func';

const StoreStatusChart: FC<any> = ({
  title = '门店状态'
}) => {
  const [data, setData] = useState<any[]>([]);


  // 客户组规模
  const loadChartData = async () => {

    // https://yapi.lanhanba.com/project/532/interface/api/70405
    const data = await get('/standard/home/shopStatusCount');
    setData(isArray(data) ? data?.map((item: any) => ({ value: item.count || 0, name: item.statusName })) : []);
  };

  useEffect(() => {
    loadChartData();
  }, []);


  return (
    <div className={styles.storeStatusChart}>
      <div className={styles.title}>{title}</div>
      <div className={styles.contain}>
      <V2PieChart
        type='circle'
        seriesData={[{
          data: data,
        }]}
        config={{
          title: {
            left: '10%'
          }
        }}
        width={580}
        height={288}
      />
      </div>
    </div>
  );
};

export default StoreStatusChart;

