/**
 * @Description 门店数量
 */

import { FC, useEffect, useState } from 'react';
import { Segmented } from 'antd';
import { shopCountOfProvince, shopCountOfCity } from '@/common/api/yhtang';
import cs from 'classnames';
import styles from '../entry.module.less';
import BarChartModule from './BarChartModule';

const ShopCount: FC<any> = ({
  searchParams
}) => {
  const [levelVal, setLevelVal] = useState<number>(1);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData(levelVal);
  }, [searchParams, levelVal]);

  const loadData = (type: number) => {
    const targetFetch = type === 1 ? shopCountOfProvince : shopCountOfCity;
    targetFetch(searchParams).then((data) => {
      setLoaded(true);
      const { chartData } = data;
      setChartData(chartData);
    });
  };

  return (
    <div className={cs(styles.fullChartCon, 'mt-12')}>
      <div className={styles.flexCon}>
        <div className='c-222 fs-16 font-weight-500 mr-10'>
          门店数量
        </div>
        <Segmented
          options={[
            { label: '省份', value: 1 },
            { label: '城市', value: 2 },
          ]}
          value={levelVal}
          onChange={(val) => setLevelVal(val as number)}
        />
      </div>
      <div className={styles.chartCon}>
        <BarChartModule
          data={chartData}
          loaded={loaded}
          className={styles.barChartCon}/>
      </div>
    </div>
  );
};

export default ShopCount;
