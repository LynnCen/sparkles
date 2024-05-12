/** 仪表盘图表 */
import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { isNotEmptyAny } from '@lhb/func';

echarts.use([
  GaugeChart,
  CanvasRenderer
]);


const GaugeCharts: FC<any> = ({
  className,
  // optionLabel = 'name',
  // optionVal = 'data',
  config
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);

  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);

  useEffect(() => {
    if (isNotEmptyAny(config.data) && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.data, ins]);


  const initOptions = () => {
    const { dailyFlow, max } = config.data;

    const echartsOptions = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: max, // 最大值
          progress: {
            show: true,
            width: 20,
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
              width: 20
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
          radius: '70%',
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
          center: ['40%', '50%'], // 控制图表显示的位置
          detail: {
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            valueAnimation: true,
            offsetCenter: [0, '60%'],
            formatter: ['{b|{value}}', '{a|日均客流指数(人次)}'].join('\n'),
            lineHeight: 23,
            rich: {
              a: {
                color: '#C4C7D0',
                fontSize: 12,
                lineHeight: 16
              },
              b: {
                color: '#222222',
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 40
              }
            }
          },
          data: [{ value: dailyFlow }],
          ...(config.seriesConfig || {}) // 额外配置
        }
      ]
    };
    setOptions(echartsOptions);
  };

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  return (
    <ECharts
      options={options}
      className={className}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default GaugeCharts;
