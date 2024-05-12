import { FC, useState } from 'react';
import cs from 'classnames';
import styles from './entry.module.less';
import Search from './components/Search';
import ScheduleCards from './components/ScheduleCards';
import FunnelOverview from './components/FunnelOverview';
import AttractInvestmentOverview from './components/AttractInvestmentOverview';
import FunnelSiteSelection from './components/FunnelSiteSelection';
import CityAndArea from './components/CityAndArea';
import ShopCount from './components/ShopCount';

const YHTang: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({
    start: '', // 统计时间类型-开始时间
    end: '', // 统计时间类型-结束时间
    cityIds: '' // 区域筛选
  });

  return (
    <div className={styles.container}>
      {/* 搜索栏 */}
      <Search
        setSearchParams={setSearchParams}/>
      {/* 进度卡片 */}
      <ScheduleCards
        searchParams={searchParams}/>
      {/* 网规漏斗 */}
      <FunnelOverview
        searchParams={searchParams}/>
      <div className={cs(styles.sectionCon, 'mt-12')}>
        {/* 招商目标完成情况 */}
        <AttractInvestmentOverview
          searchParams={searchParams}/>
        {/* 选址漏斗 */}
        <FunnelSiteSelection
          searchParams={searchParams}/>
      </div>
      {/* 门店数量 */}
      <ShopCount
        searchParams={searchParams}/>
      {/* 门店柱状图 */}
      <CityAndArea
        searchParams={searchParams}/>
    </div>
  );
};

export default YHTang;
