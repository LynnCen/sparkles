import { getMaxData } from '@/common/utils/ways';
import { Flows } from '@/views/analysis/pages/index/ts-config';
import { lineOption } from '@/common/enums/echarts/line';
import { EChartsOption } from './index';
import merge from 'lodash.merge';
import { valueFormat } from '@/common/utils/ways';

const lineColor = '#E5E9F2';

export const getStatisticsOptions = (flowData: Flows): EChartsOption => {
  if (!flowData) return {};
  // 整合过店客流和进店客流数据，取其中的最大值
  const passengerFlowData = (flowData?.indoorFlow?.data || []).concat(flowData?.passbyFlow?.data || []);
  const maxFlowData = getMaxData(passengerFlowData);
  const maxStoreRate = getMaxData(flowData?.indoorRate?.data || []);
  const option: EChartsOption = {
    legend: {
      data: ['过店客流', '进店客流', '进店率'],
      top: 10,
    },
    xAxis: {
      type: 'category',
      data: flowData.indoorFlow?.date || [],
    },
    yAxis: [
      {
        type: 'value',
        splitNumber: 5,
        max: maxFlowData,
        min: 0,
        interval: Math.ceil(maxFlowData / 5), // 强制分为 5 段
        splitLine: {
          // y轴区域中的分隔线
          show: true,
          lineStyle: { color: lineColor, width: 1, type: 'dashed' },
        },
      },
      {
        type: 'value',
        splitNumber: 5,
        axisLabel: {
          formatter: '{value}%',
        },
        max: maxStoreRate,
        min: 0,
        interval: Math.ceil(maxStoreRate / 5), // 强制分为 5 段
        splitLine: { show: false },
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
    series: [
      {
        name: '过店客流',
        type: 'bar',
        yAxisIndex: 0,
        barMaxWidth: 50,
        data: flowData.passbyFlow?.data || [],
      },
      {
        name: '进店客流',
        type: 'bar',
        stack: '总量',
        barMaxWidth: 50,
        yAxisIndex: 0,
        data: flowData.indoorFlow?.data || [],
      },
      {
        name: '进店率',
        type: 'line',
        yAxisIndex: 1,
        data: flowData.indoorRate?.data || [],
      },
    ],
  };
  return merge({}, lineOption, option);
};
