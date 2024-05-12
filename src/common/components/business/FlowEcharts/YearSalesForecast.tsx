import { FC, useEffect, useState } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';
// 按需引入组件，后缀为Component,  系列类型的定义后缀都为 Option
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
} from 'echarts/components';
// 按需引入需要的图表类型
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import Charts from '@/common/components/EChart';
import { echartsFormatUnit, getMaxData, valueFormat } from '@/common/utils/ways';
import { lineAxisLabel, lineOption } from '@/common/enums/echarts/line';
import merge from 'lodash.merge';
import styles from './index.module.less';

// 注册必须的组件
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
]);

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type EChartsOption = echarts.ComposeOption<
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | LineSeriesOption
>;

const lineColor = '#E5E9F2';

interface IProps {
  title: string;
  saleTotal: number | string;
  orderTotal: number;
  data: Record<string, any>;
  height?: string;
  xAxisLabel?: boolean;
}

const YearSalesForecast: FC<IProps> = ({ title, height = '300px', data, saleTotal, orderTotal }) => {
  const [options, setOptions] = useState<any>();
  useEffect(() => {
    const { x, y, y2 } = data;
    const unit = echartsFormatUnit(y); // 获取单位
    // 订单量
    const orderList = y.map((item: number) => {
      return unit.name ? (item / unit.value).toFixed(1) : item;
    });
    // 销售额
    const saleList = y2.map((item: number) => {
      return unit.name ? (item / unit.value).toFixed(1) : item;
    });

    const maxSaleData = getMaxData(y2);
    const maxOrderData = getMaxData(y);
    const example = merge({}, lineOption, {
      legend: {
        data: ['销售额（元）', '订单量（笔）'],
      },
      xAxis: {
        type: 'category',
        data: x,
      },
      grid: {
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签。
        right: 0,
        bottom: 0,
        left: 0,
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
      tooltip: {
        trigger: 'axis',
        formatter(params): string {
          if (!Array.isArray(params)) return '';
          return params.reduce((sum, cur) => {
            return `<div style="color: #132144">${sum}</div>${cur.marker} <span style="color:#B8BDC4">${
              cur.seriesName
            }：</span> <span style="color: #132144">${valueFormat(cur.value)}</span>`;
          }, params[0].name) as string;
        },
      },
      series: [
        {
          name: '销售额（元）',
          data: saleList,
          type: 'bar',
          yAxisIndex: 0,
          barMaxWidth: 50,
        },
        {
          name: '订单量（笔）',
          data: orderList,
          type: 'line',
          yAxisIndex: 1,
          showSymbol: false,
        },
      ],
    });

    setOptions(example);
  }, [data, title]);

  return (
    <div className={styles.yearSaleWrap}>
      <p className={styles.title}>{title}</p>
      <p className='ft-12 c-959 mt-10 mb-10'>
        <span className='mr-32'>
          总订单量(笔)：<span>{orderTotal}</span>
        </span>
        <span>
          总销售额(元)：<span>{saleTotal}</span>
        </span>
      </p>
      <Charts height={height} width='100%' option={options} isDestroy />
    </div>
  );
};

export default YearSalesForecast;
