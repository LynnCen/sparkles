/* 企业分布图表*/
import DoughnutEcharts from '@/common/components/business/ECharts/components/DoughnutEcharts';
import BoardCard from '../../BoardCard';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const EnterpriseDistributionCharts: React.FC<any> = ({
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
        name: '企业分布',
        showSymbol: data.length === 1
      },
    };
  }, [data]);

  return (
    <BoardCard title='企业分布(3km)'>
      {data.length ? <DoughnutEcharts
        config={doughnutChartConfig}
        optionVal='value'
        className={className}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default EnterpriseDistributionCharts;
