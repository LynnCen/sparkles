/** 所在行业分布图表 */
import BarCharts from '@/common/components/business/ECharts/components/BarCharts';
import { formatNumber } from '@/common/utils/ways';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const IndustryCharts: React.FC<any> = ({
  data = [],
  className
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    const isExceedCriticalValue = data.length > 4;
    return {
      data: data,
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true,
      },
      xAxisConfig: {
        axisLabel: {
          formatter: function(value) {
            if (value.length > 6) {
              value = value.substring(0, 6) + '...'; // 仅显示前6个字符
            }
            return value;
          },
          color: '#A2A9B0',
          fontSize: 12,
          rotate: isExceedCriticalValue ? 35 : 0,
          interval: 0,
          textStyle: { // 轴文字样式
            color: '#A2A9B0'
          }
        }
      },
      yAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0'
        },
      },
      otherOptions: {
        color: ['#8ABBFF']
      }
    };
  }, [data]);

  return (
    <BoardCard title='所在行业分布'>
      {data.length ? <BarCharts
        config={barChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default IndustryCharts;
