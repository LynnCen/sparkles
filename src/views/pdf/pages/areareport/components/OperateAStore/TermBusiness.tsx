/**
 * @Description 存量门店存续比例分布
 */

import { FC, useMemo } from 'react';
// import { CardLayout } from '../Layout';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import { isArray, isNotEmptyAny } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
interface TermBusinessProps{
  [k:string]:any
}
const TermBusiness: FC<TermBusinessProps> = ({
  detail,
  isBusiness
}) => {

  const description = useMemo(() => {
    if (!isNotEmptyAny(detail)) return '';
    const businessCount = detail?.poiNum;
    const maxIndustry = detail?.subBusinessList.reduce((max, item) => {
      return item?.gtThreeYearNum > max?.gtThreeYearNum ? item : max;
    }, detail?.subBusinessList[0]);
    return `${isBusiness ? '围栏内' : '周边500米'}存量门店中有${businessCount}家${detail?.categoryName}门店，其中3年以上老店最多为${maxIndustry.categoryName}，有${maxIndustry.gtThreeYearNum}家`;
  }, [detail]);

  /**
   * @description 二级行业
   */
  const secondLevelBusinessNames = useMemo(() => {
    console.log('detail', detail);
    if (!isNotEmptyAny(detail)) return [];
    return detail?.subBusinessList.map(itm => itm.categoryName);
  }, [detail]);

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
    if (!isNotEmptyAny(detail)) return [];
    const curBusiness = { ...detail };
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
      animation: false,
      data: gtThreeYearNumArr,
    }, {
      name: '开业1-3年',
      stack: 'price',
      animation: false,
      data: oneToThreeYearNumArr,
    }, {
      name: '开业1年以内',
      stack: 'price',
      animation: false,
      data: oneYearNumArr,
    }];

    return res;
  }, [detail]);
  return (


    <div className={cs(styles.chartWrapper, styles.barChart, styles.historyChartWrap)}>
      <div className={styles.chartTop}>
        {/*  餐饮门店经营年限 改为 门店经营年限  */}
        <div className={styles.chartTitle}>{detail?.categoryName}门店经营年限</div>
        <div className={styles.descOver}>{description}</div>
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

export default TermBusiness;
