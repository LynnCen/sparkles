/** 到访偏好图表 */
import BarCharts from '@/common/components/business/ECharts/components/BarCharts';
import { formatNumber } from '@/common/utils/ways';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const VisitingCharts: React.FC<any> = ({
  data = [],
  className
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    const isExceedCriticalValue = data.length > 4;
    return {
      data: data,
      rotateVal: isExceedCriticalValue ? 35 : 0,
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true,
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
    <BoardCard title='到访偏好'>
      {data.length ? <BarCharts
        config={barChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default VisitingCharts;
