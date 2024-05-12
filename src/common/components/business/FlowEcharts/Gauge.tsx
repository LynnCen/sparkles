import { FC, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import { TooltipComponent, TooltipComponentOption } from 'echarts/components';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import Charts from '@/common/components/EChart';
import styles from './index.module.less';

echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<TooltipComponentOption | GaugeSeriesOption>;

interface IProps {
  title?: string;
  data: Record<string, any>;
  height?: string;
}

const Gauge: FC<IProps> = ({ title, height = '300px', data }) => {
  const [options, setOptions] = useState<any>();
  useEffect(() => {
    const { dayFlow, weekdayFlow, weekendFlow } = data;
    const gaugeOptions: EChartsOption = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: +weekdayFlow + +weekendFlow, // 最大值
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
                    color: '#D027E6', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#392DDD', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          startAngle: 200,
          endAngle: -20,
          axisLine: {
            roundCap: true,
            lineStyle: { width: 20 },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: {
            show: true,
            size: 18,
            itemStyle: { color: '#FFD3D9' },
          },
          pointer: {
            width: 3,
            itemStyle: { color: '#E25365' },
          },
          detail: {
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            valueAnimation: true,
            offsetCenter: [0, '50%'],
            formatter: ['{b|{value}}', '{a|日均人流量}'].join('\n'),
            lineHeight: 23,
            rich: {
              a: {
                color: '#656E85',
                fontSize: 12,
              },
              b: {
                color: '#132144',
                fontSize: 18,
                fontWeight: 500,
              },
            },
          },
          data: [{ value: dayFlow }],
        },
      ],
    };
    setOptions(gaugeOptions);
  }, [data, title]);

  return (
    <div className={styles.gaugeWrap}>
      <p className={styles.title}>月日均客流预测</p>
      <Charts height={height} width='100%' option={options} isDestroy />
      <div className={styles.wrap}>
        <div className='mr-40'>
          <span className='fs-12 c-656 mr-6'>工作日客流</span>
          <span className='fs-18 bold c-333'>{data.weekdayFlow}</span>
        </div>
        <div>
          <span className='fs-12 c-656 mr-6'>节假日客流</span>
          <span className='fs-18 bold c-333'>{data.weekendFlow}</span>
        </div>
      </div>
    </div>
  );
};

export default Gauge;
