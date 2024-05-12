import { FC, useEffect, useState, } from 'react';
import * as echarts from 'echarts/core';
import Charts from '@/common/components/EChart';
import {
  TitleComponent,
  TitleComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import {
  RadarChart,
  RadarSeriesOption
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use([
  TitleComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | LegendComponentOption
  | RadarSeriesOption
>

const type = ['businessScore', 'trafficScore', 'competitionScore', 'humanFlowScore', 'consumptionScore'];
const Radar: FC<{
  data: any;
  height: string;
}> = ({ height = '100%', data }) => {
  const [options, setOptions] = useState<any>();
  const [echartsIns, setEchartsIns] = useState<any>(null);
  useEffect(() => {
    if (!data) return;
    let i = -1;
    echartsIns && echartsIns.setOption({
      radar: [
        {
          axisName: {
            rich: {
              a: {
                color: '#132144',
                lineHeight: 20,
                fontSize: '16px',
              },
              b: {
                color: '#132144',
                align: 'center',
                fontWeight: 'bolder',
                fontSize: '22px'
              }
            },
            formatter: (a,) => {
              i++;
              return `{a|${a}}\n{b|${Math.round(data[type[i]])}}`;
            }
          }
        }
      ]
    });
  }, [echartsIns, data]);
  useEffect(() => {
    const val = type.map((val) => {
      return Math.round(data[val]);
    });
    const option: EChartsOption = {
      // color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
      title: {
        text: `{a|${Math.round(data.totalScore)}}\n{b|总分}`,
        left: 'center',
        top: 'middle',
        textStyle: {
          rich: {
            a: {
              color: 'rgba(19, 33, 68, 1)',
              align: 'center',
              fontSize: '32px',
              lineHeight: 33,
              fontWeight: 'bolder'
            },
            b: {
              color: '#132144',
              align: 'center',
              fontSize: '22px'
            }
          }
        },

      },
      legend: {
        // data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '商业氛围', max: 100 },
          { name: '交通环境', max: 100 },
          { name: '竞争环境', max: 100 },
          { name: '潜客聚焦点', max: 100 },
          { name: '消费匹配度', max: 100 },
        ],
        center: ['50%', '50%'],
        radius: 120,
        startAngle: -20,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          // formatter: '【{value}】',
          color: '#132144',
          fontSize: 24
        },
        splitArea: {
          // 区域颜色，默认深浅相隔
          areaStyle: {
            color: ['#fff', '#fff', '#fff', '#fff'],
            // shadowColor: 'rgba(0, 0, 0, 0.2)',
            // shadowBlur: 10
          }
        },
        // 贯穿的分割线
        axisLine: {
          lineStyle: {
            color: '#F0F0F4'
          }
        },
        // 圆形分割线
        splitLine: {
          lineStyle: {
            color: '#F0F0F4'
          }
        }
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          symbol: 'none',
          data: [
            {
              value: val,
              itemStyle: { borderColor: 'blue', borderWidth: 0 },
              lineStyle: { color: '#9450E4', width: 2 }, // 线条样式
              areaStyle: { color: 'rgba(187, 132, 253, 0.65)' } // 设置单项区域填充样式
            }
          ]
        }
      ]
    };
    setOptions(option);
  }, [data]);
  const loadedEchartsHandle = (echarts) => {
    setEchartsIns(echarts);
  };
  return <>
    <Charts height={height} option={options} isDestroy loadedEchartsHandle={loadedEchartsHandle} />
  </>;
};

export default Radar;
