import { getMaxData } from '@/common/utils/ways';
import { lineOption, lineAxisLabel } from '@/common/enums/echarts/line';
import { EChartsOption } from './index';
import { OrderStatisticProps } from '../../../ts-config';
import merge from 'lodash.merge';
import { valueFormat } from '@/common/utils/ways';

const lineColor = '#E5E9F2';

export const getStatisticsOptions = (orderStatistic: OrderStatisticProps): EChartsOption => {
  if (!orderStatistic) return {};
  const maxSaleData = getMaxData(orderStatistic.saleAmountData);
  const maxOrderData = getMaxData(orderStatistic.orderData);
  const option: EChartsOption = {
    legend: {
      data: ['店内销售额（元）', '店内订单（笔）'],
    },
    xAxis: {
      type: 'category',
      data: orderStatistic.date || [],
    },
    tooltip: {
      formatter(params): string {
        if (!Array.isArray(params)) return '';
        return params.reduce((sum, cur) => {
          return `<div style="color: #132144">${sum}</div>${cur.marker} <span style="color:#B8BDC4">${
            cur.seriesName
          }：</span> <span style="color: #132144">${valueFormat(cur.value)}</span>`;
        }, params[0].name) as string;
      },
    },
    yAxis: [
      {
        type: 'value',
        splitNumber: 5,
        max: maxSaleData,
        min: 0,
        interval: Math.ceil(maxSaleData / 5), // 强制分为 5 段
        splitLine: {
          // y轴区域中的分隔线
          show: true,
          lineStyle: { color: lineColor, width: 1, type: 'dashed' },
        },
        axisLabel: { ...lineAxisLabel },
      },
      {
        type: 'value',
        splitNumber: 5,
        max: maxOrderData,
        min: 0,
        interval: Math.ceil(maxOrderData / 5), // 强制分为 5 段
        axisLabel: { ...lineAxisLabel },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '店内销售额（元）',
        type: 'bar',
        stack: '总量',
        yAxisIndex: 0,
        barMaxWidth: 50,
        data: orderStatistic.saleAmountData || [],
      },
      {
        name: '店内订单（笔）',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        data: orderStatistic.orderData || [],
      },
    ],
  };

  return merge({}, lineOption, option);
};
