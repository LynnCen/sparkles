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

const Radar: FC<{
  data: any;
  indicator: any;
  height?: string;
  title?: string | number;
  titleLabel?: string;
  radius?: number;
  seriesInfo?:any;
  radarInfo?:any;
  axisNameFontSize?: string[];
  titleTextFontSize?: string[];
  shape?:string;
  startAngle?:number;
}> = ({
  height = '100%',
  data,
  indicator,
  title,
  titleLabel,
  radius = 120,
  seriesInfo,
  radarInfo,
  axisNameFontSize = ['16px', '22px'],
  titleTextFontSize = ['32px', '22px'],
  shape = 'circle',
  startAngle = -20
}) => {
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
                color: '#666666',
                lineHeight: 20,
                fontSize: axisNameFontSize[0],
              },
              b: {
                color: '#132144',
                align: 'center',
                fontWeight: 'bolder',
                fontSize: axisNameFontSize[1]
              }
            },
            formatter: (a,) => {
              i++;
              return `{b|${Math.round(data[i])}}\n{a|${a}}`;
            },
            ...radarInfo
          }
        }
      ],
    });
  }, [echartsIns, data, radarInfo, axisNameFontSize]);
  useEffect(() => {
    const option: EChartsOption = {
      // color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
      ...(title && {
        title: {
          text: titleLabel ? `{a|${title}}\n{b|${titleLabel}}` : `{a|${title}}`,
          left: 'center',
          top: 'middle',
          textStyle: {
            rich: {
              a: {
                color: 'rgba(19, 33, 68, 1)',
                align: 'center',
                fontSize: titleTextFontSize[0],
                lineHeight: 33,
                fontWeight: 'bolder'
              },
              b: {
                color: '#132144',
                align: 'center',
                fontSize: titleTextFontSize[1]
              }
            }
          },
        }
      }),
      radar: {
        // shape: 'circle',
        // indicator: [
        //   { name: '商业氛围', max: 100 },
        //   { name: '交通环境', max: 100 },
        //   { name: '竞争环境', max: 100 },
        //   { name: '潜客聚焦点', max: 100 },
        //   { name: '消费匹配度', max: 100 },
        // ],
        indicator,
        center: ['50%', '50%'],
        radius: radius,
        startAngle,
        splitNumber: 4,
        shape,
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
              value: data,
              itemStyle: { borderColor: 'blue', borderWidth: 0 },
              lineStyle: { color: '#9450E4', width: 2 }, // 线条样式
              areaStyle: { color: 'rgba(187, 132, 253, 0.65)' } // 设置单项区域填充样式
            }
          ]
        }
      ],
      ...seriesInfo
    };
    setOptions(option);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, indicator]);
  const loadedEchartsHandle = (echarts) => {
    setEchartsIns(echarts);
  };
  return <>
    <Charts height={height} option={options} isDestroy loadedEchartsHandle={loadedEchartsHandle} />
  </>;
};

export default Radar;
