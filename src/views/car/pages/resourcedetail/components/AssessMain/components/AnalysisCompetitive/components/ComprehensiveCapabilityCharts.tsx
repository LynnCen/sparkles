/** 综合能力图表 */
import RadarCharts from '@/common/components/business/ECharts/components/RadarCharts';
import BoardCard from '../../BoardCard';
import { isNotEmptyAny } from '@lhb/func';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const ComprehensiveCapabilityCharts: React.FC<any> = ({
  data = {},
  className
}) => {


  // 图表配置

  const chartConfig = useMemo(() => {
    return {
      data: data.data,
      indicator: data.indicator, // 轴坐标
      legendConfig: {
        show: false
      },
      seriesConfig: {
        name: '综合能力',
      },
    };
  }, [data]);

  return (
    <BoardCard title='综合能力'>
      {isNotEmptyAny(data) ? <RadarCharts
        config={chartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default ComprehensiveCapabilityCharts;
