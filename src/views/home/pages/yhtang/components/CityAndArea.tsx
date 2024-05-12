/**
 * @Description 各城市和商圈门店数
 */
import { FC, useEffect, useState } from 'react';
import { areaTypeShopCount, cityLevelShopCount } from '@/common/api/yhtang';
import cs from 'classnames';
import styles from '../entry.module.less';
import BarChartModule from './BarChartModule';

const CityAndArea: FC<any> = ({
  searchParams
}) => {
  const [cityData, setCityData] = useState<any[]>([]); // 城市数据
  const [areaData, setAreaData] = useState<any[]>([]); // 商圈数据
  const [showCityLevel, setShowCityLevel] = useState<boolean>(false);
  const [cityLoaded, setCityLoaded] = useState<boolean>(false);
  const [areaLoaded, setAreaLoaded] = useState<boolean>(false);

  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData();
  }, [searchParams]);

  const loadData = () => {
    // 城市级门店数
    cityLevelShopCount(searchParams).then((data) => {
      const { chartData, enable } = data;
      setShowCityLevel(!!enable);
      setCityLoaded(true);
      setCityData(chartData);
    });
    // 商圈门店数
    areaTypeShopCount(searchParams).then((data) => {
      const { chartData } = data;
      setAreaLoaded(true);
      setAreaData(chartData);
    });
  };

  return (
    <div className={cs(styles.sectionCon, 'mt-12')}>
      <div className={cs(styles.invariableSection, styles.chart)}>
        <div className='c-222 fs-16 font-weight-500 pt-16 pl-12'>
          各商圈类型门店数
        </div>
        {/* 柱状图 */}
        <BarChartModule
          data={areaData}
          loaded={areaLoaded}
          className={styles.barChartCon}/>
      </div>
      {
        showCityLevel ? <div className={cs(styles.invariableSection, styles.chart)}>
          <div className='c-222 fs-16 font-weight-500 pt-16 pl-12'>
          各城市线级门店数
          </div>
          {/* 柱状图 */}
          <BarChartModule
            data={cityData}
            loaded={cityLoaded}
            isSort={false}
            className={styles.barChartCon}/>
        </div> : <></>
      }
    </div>
  );
};

export default CityAndArea;

