/**
 * @Description 转换漏斗图表
 */

import { FC, useEffect, useState } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import { post } from '@/common/request';
import { floorKeep, isArray } from '@lhb/func';
import V2FunnelChart from '@/common/components/Charts/V2FunnelChart';

const ConversionsChart: FC<any> = ({
  title = '转换漏斗',
  searchParams = {}
}) => {
  const [data, setData] = useState<any[]>([]);

  // 客户组规模
  const loadChartData = async () => {

    // https://yapi.lanhanba.com/project/532/interface/api/70398
    const { values } = await post('/standard/home/funnel', { ...searchParams });
    setData(isArray(values) ? values?.map((item: any, index) => {
      const percent = index + 1 !== values.length && Number(item.value) !== 0 ? floorKeep(floorKeep(values[index + 1].value || 0, item.value, 4, 2), 100, 3, 1) : 0;
      return ({
        value: item.value || 0,
        name: item.name,
        ...(index + 1 !== values.length && { describe: percent + '%'  }),
        // ...(index + 1 !== values.length && { percent: percent + '%' })
      });
    }) : []);
  };

  useEffect(() => {
    loadChartData();
  }, [searchParams]);


  return (
    <div className={styles.storeStatusChart}>
      <div className={styles.title}>{title}</div>
      <V2FunnelChart
        seriesData={data}
      />
    </div>
  );
};

export default ConversionsChart;

