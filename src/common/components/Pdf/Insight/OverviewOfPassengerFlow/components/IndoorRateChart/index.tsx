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

const chartFields:string[] = ['passbyCount', 'indoorCount', 'indoorRate'];

const IndoorRateChart: React.FC<any> = ({
  titleTime,
  detailInfo = {},
}) => {

  // 拿到过店总数、进店总数、进店率是否显示对象
  const showFields:any = useMemo(() => {
    const obj = {};
    // 兼容如果没有导入过数据，detailInfo.fields 为空数组时展示图表
    if (detailInfo.fields && detailInfo.fields.length === 0) {
      return {
        passbyCount: true,
        indoorCount: true,
        indoorRate: true,
      };
    };
    recursionEach(detailInfo.fields || [], 'children', (item) => {
      if (chartFields.includes(item.key)) {
        obj[item.key] = item.showColumn;
      }
    });
    return obj;
  }, [detailInfo.fields]);


  const renderChart = () => {

    // 双柱状图
    if (showFields.passbyCount && showFields.indoorCount && !showFields.indoorRate) {
      return <DoubleBarChart data={detailInfo?.indoorHistogram}/>;
    }

    // 单柱状图
    if ((showFields.passbyCount || showFields.indoorCount) && !showFields.indoorRate) {
      // 找到进店总数、提袋数、提袋率中显示的类型 key
      let barType:string = 'indoorCount';
      for (const key in showFields) {
        if (showFields[key] === true && key !== 'indoorRate') {
          barType = key;
        }
      }
      return <BarChart data={detailInfo?.indoorHistogram} barType={barType}/>;
    }
    // // 单折线图 产品说不会出现单折线图情况，不考虑
    // if (!showFields.passbyCount && !showFields.indoorCount && showFields.indoorRate) {
    //   return <LineChart data={detailInfo?.indoorHistogram}/>;
    // }

    // 双柱状+折现图
    if (showFields.passbyCount && showFields.indoorCount && showFields.indoorRate) {
      return <DoubleLineBarChart data={detailInfo?.indoorHistogram}/>;
    }

    // 柱状+折现图
    if ((showFields.passbyCount || showFields.indoorCount) && showFields.indoorRate) {
      // 找到进店总数、提袋数、提袋率中显示的类型 key
      let barType:string = 'indoorCount';
      for (const key in showFields) {
        if (showFields[key] === true && key !== 'indoorRate') {
          barType = key;
        }
      }
      return <LineBarChart data={detailInfo?.indoorHistogram} barType={barType}/>;
    }
    return null;
  };



  return (
    <>
      {!isUndef(renderChart()) && <div className={(styles.firstPage)}>
        <Header
          hasIndex
          name={`${titleTime}客流分时趋势图`}/>
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
