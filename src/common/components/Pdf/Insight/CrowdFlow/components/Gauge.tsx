import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
// import styles from '../../../entry.module.less';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/EChart';

echarts.use([
  GaugeChart,
  CanvasRenderer
]);

const Gauge: FC<any> = ({
  data
}) => {
  const [options, setOptions] = useState<any>(null);

  // const [state, setState] = useState<>();

  useEffect(() => {
    data && initOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const initOptions = () => {
    const { dayFlow, workdayFlow, holidayFlow } = data;

    const echartsOptions = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: +workdayFlow + +holidayFlow, // 最大值
          progress: {
            show: true,
            width: 14,
            roundCap: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#D027E6' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#392DDD' // 100% 处的颜色
                  }
                ]
              }
            }
          },
          startAngle: 200,
          endAngle: -20,
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 14
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          radius: '90%',
          anchor: {
            show: true,
            size: 18,
            itemStyle: {
              color: '#FFD3D9'
            }
          },
          pointer: {
            width: 3,
            itemStyle: {
              color: '#E25365'
            }
          },
          detail: {
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            valueAnimation: true,
            offsetCenter: [0, '75%'],
            formatter: ['{b|{value}}', '{a|日均客流指数(人次)}'].join('\n'),
            lineHeight: 23,
            rich: {
              a: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 12
              },
              b: {
                color: '#fff',
                fontSize: 28,
                fontWeight: 600
              }
            }
          },
          data: [{ value: dayFlow }]
        }
      ]
    };
    setOptions(echartsOptions);
  };

  return (
    <ECharts
      option={options}
      height='150px'/>
  );
};

export default Gauge;
