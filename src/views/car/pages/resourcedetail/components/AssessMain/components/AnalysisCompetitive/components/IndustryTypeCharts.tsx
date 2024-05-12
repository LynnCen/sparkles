/** 行业分类图表 */
import DoughnutEcharts from '@/common/components/business/ECharts/components/DoughnutEcharts';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const IndustryTypeCharts: React.FC<any> = ({
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
        name: '行业分类',
        showSymbol: data.length === 1
      },
    };
  }, [data]);

  return (
    <BoardCard title='行业分类'>
      {data.length ? <DoughnutEcharts
        config={doughnutChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default IndustryTypeCharts;
