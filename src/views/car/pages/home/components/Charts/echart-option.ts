// import { getMaxData } from '@/common/utils/ways';
import { lineOption } from '@/common/enums/echarts/line';
import { EChartsOption } from './index';
import merge from 'lodash.merge';
import { valueFormat } from '@/common/utils/ways';

export const getStatisticsOptions = (
  legendData: string[],
  optionSeries: any[],
  y1data: any[],
  y2data: any[],
  date: any[],
  y2unit?: string
): EChartsOption => {
  if (!y1data) return {};
  // const maxY1Data = getMaxData(y1data);
  // const maxY2Rate = getMaxData(y2data);
  const option: EChartsOption = {
    legend: { data: legendData, top: 10 },
    xAxis: { type: 'category', data: date || [] },
    yAxis: [
      {
        type: 'value',
        // splitNumber: 5,
        // max: maxY1Data,
        // min: 0,
        // interval: Math.ceil(maxY1Data / 5), // 强制分为 5 段
        // splitLine: {
        //   show: true,
        //   lineStyle: { color: '#E5E9F2', width: 1, type: 'dashed' },
        // },
      },
      {
        type: 'value',
        // splitNumber: 5,
        axisLabel: { formatter: `{value}${y2unit}` },
        // max: maxY2Rate,
        // min: 0,
        // interval: Math.ceil(maxY2Rate / 5), // 强制分为 5 段
        // splitLine: { show: false },
      },
    ],
    tooltip: {
      formatter(params): string {
        if (!Array.isArray(params)) return '';
        return params.reduce((sum, cur) => {
          const isPercentage = cur.seriesName === '进店率';
          return `<div style="color: #132144">${sum}</div>${cur.marker} <span style="color:#B8BDC4">${
            cur.seriesName
          }：</span> <span style="color: #132144">${isPercentage ? `${cur.value}%` : valueFormat(cur.value)}</span>`;
        }, params[0].name) as string;
      },
    },
    series: optionSeries,
  };
  return merge({}, lineOption, option);
};
