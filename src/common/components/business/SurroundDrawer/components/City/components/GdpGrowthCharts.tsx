/** 2016-2022GDP及增速情况图表
 *  @Quote 20231207版本引用该组件
 */
import LineBarCharts from '@/common/components/business/ECharts/components/LineBarCharts';
import { formatNumber } from '@/common/utils/ways';
import BoardCard from './BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';

const GdpGrowthCharts: React.FC<any> = ({
  cityName,
  loaded,
  data = [],
  className,
  showTitle = true, // 是否显示标题
  gridConfig = {}, // 图表位置配置
  legendConfig = {}, // 图例配置
}) => {
  const lineData = data?.find((item) => item.name === '同比增长');
  const barData = data?.find((item) => item.name === 'GDP');

  const startYear = lineData && Array.isArray(lineData.data) && lineData.data.length ? lineData.data[0].name : '';
  const endYear = lineData && Array.isArray(lineData.data) && lineData.data.length ? lineData.data[lineData.data.length - 1].name : '';
  const title = `${startYear}-${endYear}${cityName || ''}GDP及增速情况`;

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      lineData,
      barData,
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '0%',
        right: '0%',
        bottom: '11%',
        containLabel: true,
        ...gridConfig,
      },
      barYAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0'
        },
      },
      barSeriesConfig: {
        itemStyle: {
          color: '#8ABBFF'
        },
      },
      legendConfig
    };
  }, [barData, lineData]);

  return (
    <BoardCard title={showTitle ? title : null}>
      {data.length ? <LineBarCharts
        config={barChartConfig}
        optionVal='value'
        className={className}
      /> : loaded ? <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <></>}
    </BoardCard>
  );
};

export default GdpGrowthCharts;
