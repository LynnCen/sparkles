/** 子女年龄情况图表 */
import DoughnutEcharts from '@/common/components/business/ECharts/components/DoughnutEcharts';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const ChildrenAgeCharts: React.FC<any> = ({
  data = [],
  className
}) => {


  // 图表配置
  const doughnutChartConfig = useMemo(() => {
    const isExceedCriticalValue = data.length > 4;
    return {
      data: data,
      rotateVal: isExceedCriticalValue ? 15 : 0,
      orient: 'vertical',
      legendTop: 'middle',
      legendConfig: {
        align: 'left',
        right: '16%',
      },
      seriesConfig: {
        name: '子女年龄情况',
        showSymbol: data.length === 1
      },
    };
  }, [data]);

  return (
    <BoardCard title='子女年龄情况'>
      {data.length ? <DoughnutEcharts
        config={doughnutChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default ChildrenAgeCharts;
