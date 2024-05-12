/**
 * @Description 根据勾选字段展示不同进店分时趋势图
 */
import { isUndef, recursionEach } from '@lhb/func';
import React, { useMemo } from 'react';
import Header from '../../../Header';
import DoubleCircle from '../../../DoubleCircle';
import styles from '../../../entry.module.less';
import DoubleLineBarChart from './DoubleLineBarChart';
import LineBarChart from './LineBarChart';
import BarChart from './BarChart';
import DoubleBarChart from './DoubleBarChart';

const chartFields:string[] = ['indoorCount', 'shoppingCount', 'shoppingRate'];

const IndoorRateChart: React.FC<any> = ({
  titleTime,
  detailInfo = {},
}) => {

  // 拿到进店总数、提袋数、提袋率是否显示对象
  const showFields:any = useMemo(() => {
    const obj = {};
    recursionEach(detailInfo.fields || [], 'children', (item) => {
      if (chartFields.includes(item.key)) {
        obj[item.key] = item.showColumn;
      }
    });
    return obj;
  }, [detailInfo.fields]);


  const renderChart = () => {

    // 产品说如果只有进店总数，则不现实图表
    if (showFields.indoorCount && !showFields.shoppingCount && !showFields.shoppingRate) {
      return null;
    }

    // 双柱状图
    if (showFields.indoorCount && showFields.shoppingCount && !showFields.shoppingRate) {
      return <DoubleBarChart data={detailInfo?.shoppingHistogram}/>;
    }

    // 单柱状图
    if ((showFields.indoorCount || showFields.shoppingCount) && !showFields.shoppingRate) {
      // 找到进店总数、提袋数、提袋率中显示的类型 key
      let barType:string = 'indoorCount';
      for (const key in showFields) {
        if (showFields[key] === true && key !== 'shoppingRate') {
          barType = key;
        }
      }
      return <BarChart data={detailInfo?.shoppingHistogram} barType={barType}/>;
    }
    // // 单折线图 产品说不会出现单折线图情况，不考虑
    // if (!showFields.indoorCount && !showFields.shoppingCount && showFields.shoppingRate) {
    //   return <LineChart data={detailInfo?.shoppingHistogram}/>;
    // }

    // 双柱状+折现图
    if (showFields.indoorCount && showFields.shoppingCount && showFields.shoppingRate) {
      return <DoubleLineBarChart data={detailInfo?.shoppingHistogram}/>;
    }

    // 柱状+折现图
    if ((showFields.indoorCount || showFields.shoppingCount) && showFields.shoppingRate) {
      // 找到进店总数、提袋数、提袋率中显示的类型 key
      let barType:string = 'indoorCount';
      for (const key in showFields) {
        if (showFields[key] === true && key !== 'shoppingRate') {
          barType = key;
        }
      }
      return <LineBarChart data={detailInfo?.shoppingHistogram} barType={barType}/>;
    }
    return null;
  };



  return (
    <>
      {!isUndef(renderChart()) && <div className={(styles.firstPage)}>
        <Header
          hasIndex
          name={`${titleTime}提袋分时趋势`}/>
        <div className={styles.content}>
          {renderChart()}
        </div>
        <div className={styles.footer}>
          <DoubleCircle layout='vertical'/>
        </div>
      </div>}
    </>
  );
};


export default IndoorRateChart;
