/**
 * @Description 商圈详情-业态饼图
 */

import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import V2PieChart from '@/common/components/Charts/V2PieChart';
import { isArray } from '@lhb/func';

const PieChart: FC<any> = ({
  detail,
}) => {
  const [pieChartData, setPieChartData] = useState<any[]>([]); // 饼图数据

  /**
   * @description 设置饼图数据，返回的业态比率加起来不足100%，自行计算其他业态数据
   */
  useEffect(() => {
    if (!isArray(detail.businessDistributions)) {
      setPieChartData([]);
      return;
    }

    const totalNumber = detail.businessDistributions.reduce((prevVal: number, currVal: any) => {
      return prevVal + currVal.poiNum; // 接口返回的各业态poi总数
    }, 0); // 返回数据的总和
    const totalRate = detail.businessDistributions.reduce((prevVal: number, currVal: any) => {
      return prevVal + currVal.categoryRate;
    }, 0); // 返回数据的总和

    if (!totalNumber || !totalRate) {
      setPieChartData([]);
      return;
    }

    const allNumber = Math.round(totalNumber / totalRate); // 100%对应的poi数量
    const otherNumber = allNumber - totalNumber; // 其他业态数量

    const pieData = detail?.businessDistributions.map(itm => ({
      value: itm.poiNum,
      name: itm.categoryName,
    }));
    (otherNumber > 0) && pieData.push({
      value: otherNumber,
      name: '其他业态',
    });

    setPieChartData(pieData);
  }, [detail]);

  return (
    <div className={cs(styles.chartWrapper, styles.pieChart, 'pd-16')}>
      <div className='fs-14 c-222 bold'>商圈内业态分布情况</div>
      <V2PieChart
        title=''
        type='circle'
        seriesData={[{
          data: pieChartData
        }]}
        height={250}
      />
    </div>
  );
};

export default PieChart;
