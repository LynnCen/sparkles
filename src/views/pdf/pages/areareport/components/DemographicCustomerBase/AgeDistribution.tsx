import React, { useMemo } from 'react';
import { CardLayout } from '../Layout';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import { isArray } from '@lhb/func';
interface AgeDistributionProps{
ageDetail:any
}
const AgeDistribution:React.FC<AgeDistributionProps> = ({ ageDetail }) => {

  const xAxisData = useMemo(() => {
    const arr = isArray(ageDetail) && ageDetail.length ? ageDetail.map((item) => item.name) : [];
    return arr;
  }, [ageDetail]);

  const seriesData = useMemo(() => {
    const arr = isArray(ageDetail) && ageDetail.length ? ageDetail.map((item) => item.rate) : [];
    return arr;
  }, [ageDetail]);
  return <CardLayout title='年龄分布'>
    <V2BarChart
      title=''
      theme='blue'
      direction='horizontal'
      xAxisData={xAxisData}
      seriesData={[{
        animation: false,
        data: seriesData,
        center: ['50%', '30%'],
        label: { show: true,
          position: 'right',
          formatter: '{c}%',
          ellipsis: '...',
          color: '#222222',
          fontSize: 14
        }
      }]}
      height={267}
      config={{
        legend: {
          show: false
        },
        grid: {
          top: 10,
          left: 80,
          right: 54,
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%'
          },
        },
        tooltip: {
          // formatter: (params) => {
          //   console.log(`params`, params);
          //   return `${params[0].marker}${params[0].axisValueLabel}  ${rate?.[params[0].dataIndex]}`;
          // }
          formatter: '{b}: {c}%'
        }
      }}
    />
  </CardLayout>;
};

export default AgeDistribution;


