import BarCharts from '@/common/components/business/ECharts/components/BarCharts';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const AppCharts: React.FC<any> = ({
  data = [],
  className
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    const isExceedCriticalValue = data.length > 4;
    return {
      data: data,
      rotateVal: isExceedCriticalValue ? 15 : 0,
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '0%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
      },
      otherOptions: {
        color: ['#8ABBFF']
      }
    };
  }, [data]);

  return (
    <BoardCard title='APP偏好'>
      {data.length ? <BarCharts
        config={barChartConfig}
        optionVal='name'
        optionLabel='value'
        type='horizontal'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default AppCharts;
