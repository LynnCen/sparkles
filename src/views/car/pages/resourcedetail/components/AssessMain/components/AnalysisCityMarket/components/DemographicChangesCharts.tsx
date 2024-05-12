/** 2016-2022人口变化一览图表 */
import LineBarCharts from '@/common/components/business/ECharts/components/LineBarCharts';
import { formatNumber } from '@/common/utils/ways';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const DemographicChangesCharts: React.FC<any> = ({
  data = [],
  className
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      lineData: data?.find((item) => item.name === '同比增长'),
      barData: data?.find((item) => item.name === '常住人口'),
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '0%',
        right: '0%',
        bottom: '11%',
        containLabel: true,
      },
      barYAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0'
        },
      },
    };
  }, [data]);

  return (
    <BoardCard title='2016-2022人口变化一览'>
      {data.length ? <LineBarCharts
        config={barChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default DemographicChangesCharts;
