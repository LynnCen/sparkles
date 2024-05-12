/**
 * @Description 经营门店/餐饮门店
 */

import { FC, useState, useMemo } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2PieChart from '@/common/components/Charts/V2PieChart';

const tabs = [
  { key: '1', label: '经营门店' },
  { key: '2', label: '餐饮门店' },
];

const TabsChart: FC<any> = ({
  detail
}) => {
  const [tabsActive, setTabsActive] = useState<string>(tabs[0].key);

  const targetChartData = useMemo(() => {
    const { totalDistribution, foodDistribution } = detail;
    if (tabsActive === '1' && totalDistribution) {
      return totalDistribution;
    }
    if (tabsActive === '2' && foodDistribution) {
      return foodDistribution;
    }
    return {};
  }, [detail, tabsActive]);

  return (
    <div className={styles.tabsCon}>
      <V2Tabs
        items={tabs}
        activeKey={tabsActive}
        onChange={(key) => setTabsActive(key)}
      />
      <V2PieChart
        type='circle'
        height='80px'
        seriesData={[{
          data: [
            { value: targetChartData?.oneYearRate || 0, name: '1年内占比' },
            { value: targetChartData?.oneToThreeYearRate || 0, name: '1-3年占比' },
            { value: targetChartData?.gtThreeYearRate || 0, name: '3年以上占比' },
          ],
          radius: [40, 30],
          center: ['20%', '50%'],
        }]}
        config={{
          legend: {
            left: '45%'
          }
        }}
      />

    </div>
  );
};

export default TabsChart;
