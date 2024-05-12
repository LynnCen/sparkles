/**
 * @Description 商圈详情-经营年限柱状图
 */

import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { isArray } from '@lhb/func';

const BarChart: FC<any> = ({
  detail,
}) => {
  const [businessItems, setBusinessItems] = useState<any[]>([]); // 业态tab
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值，取caregoryName

  /**
   * @description 设置业态tabs
   */
  useEffect(() => {
    const { businessDistributions } = detail;
    if (!isArray(businessDistributions) || !businessDistributions.length) {
      setBusinessItems([]);
      return;
    }
    const items = businessDistributions.map(itm => ({ label: itm.categoryName, key: itm.categoryName }));
    setBusinessItems(items);
    setTabActive(items[0].key);

  }, [detail]);

  /**
   * @description 二级行业
   */
  const secondLevelBusinessNames = useMemo(() => {
    if (!tabActive) return [];

    const { businessDistributions } = detail;
    if (!isArray(businessDistributions)) return [];

    const curBusiness = businessDistributions.find(itm => itm.categoryName === tabActive);
    if (!curBusiness) return [];

    // 有二级行业数据则使用；没有二级数据，直接使用一级行业名
    return (isArray(curBusiness.subBusinessList) || curBusiness.subBusinessList) ? curBusiness.subBusinessList.map(itm => itm.categoryName) : [curBusiness.categoryName];
  }, [tabActive]);

  /**
   * @description 当前选中业态的二级行业数据
   * 格式如下
   * [{
        name: '开业3年以上',
        stack: 'price',
        data: [145, 444, 332, 887, 999],
      }, {
        name: '开业1-3年',
        stack: 'price',
        data: [133, 333, 686, 663, 872],
      }, {
        name: '开业1年以内',
        stack: 'price',
        data: [122, 222, 780, 663, 520],
      }]
   */
  const secondLevelBusinessData = useMemo(() => {
    if (!tabActive) return [];

    const { businessDistributions } = detail;
    if (!isArray(businessDistributions)) return [];

    const curBusiness = businessDistributions.find(itm => itm.categoryName === tabActive);
    if (!curBusiness) return [];

    const oneYearNumArr: number[] = [];
    const oneToThreeYearNumArr: number[] = [];
    const gtThreeYearNumArr: number[] = [];

    if (isArray(curBusiness.subBusinessList) || curBusiness.subBusinessList) {
      // 有二级行业数据
      curBusiness.subBusinessList.forEach(itm => {
        oneYearNumArr.push(itm.oneYearNum || 0);
        oneToThreeYearNumArr.push(itm.oneToThreeYearNum || 0);
        gtThreeYearNumArr.push(itm.gtThreeYearNum || 0);
      });
    } else {
      // 没有二级数据，直接使用一级数据
      oneYearNumArr.push(curBusiness?.oneYearNum || 0);
      oneToThreeYearNumArr.push(curBusiness?.oneToThreeYearNum || 0);
      gtThreeYearNumArr.push(curBusiness?.gtThreeYearNum || 0);
    }

    const res = [{
      name: '开业3年以上',
      stack: 'price',
      data: gtThreeYearNumArr,
    }, {
      name: '开业1-3年',
      stack: 'price',
      data: oneToThreeYearNumArr,
    }, {
      name: '开业1年以内',
      stack: 'price',
      data: oneYearNumArr,
    }];

    return res;
  }, [tabActive]);

  return (
    <div className={cs(styles.chartWrapper, styles.barChart, styles.historyChartWrap)}>
      <div className={styles.chartTop}>
        <div className={styles.chartTitle}>各业态门店经营年限</div>
        <div className={styles.chartTab}>
          <V2Tabs
            items={businessItems}
            activeKey={tabActive}
            onChange={(active) => setTabActive(active)}
          />
        </div>
      </div>
      <div className={styles.chartContent}>
        <V2BarChart
          title=''
          xAxisData={secondLevelBusinessNames}
          seriesData={secondLevelBusinessData}
          height={349}
          config={{
            // 图例调到左侧，宽度为整行
            legend: {
              top: 13,
              right: 6,
              width: 'auto'
            },
            grid: {
              top: 110,
            }
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;
