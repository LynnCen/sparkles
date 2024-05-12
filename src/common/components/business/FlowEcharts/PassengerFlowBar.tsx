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
import merge from 'lodash.merge';
import { echartsFormatUnit, valueFormat } from '@/common/utils/ways';
import { lineOption } from '@/common/enums/echarts/line';

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

interface IProps {
  // showTitle?: boolean;
  title?: string;
  data: Record<string, any>;
  height?: string;
  xUnit?: string;
  isAnalysis?: boolean;
  // xAxisLabel?: boolean;
}

const PassengerFlowBar: FC<IProps> = ({ title, height = '364px', xUnit = '时', isAnalysis = false, data }) => {
  const [options, setOptions] = useState<any>();
  useEffect(() => {
    const { x, y } = data;
    const unit = echartsFormatUnit(y); // 获取单位
    const yData = y.map((item: number) => {
      return unit.name ? (item / unit.value).toFixed(1) : item;
    });

    const echartsOptions = merge({}, lineOption, {
      title: { text: title, textStyle: { fontSize: 16 } },
      legend: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: x,
      },
      grid: {
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签。
        top: 50,
        right: 0,
        bottom: 0,
        left: 0,
      },
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
      series: [{ name: '客流量(人次)', data: yData, type: 'bar' }],
    });
    setOptions(echartsOptions);
  }, [data, isAnalysis, title, xUnit]);

  return (
    <>
      <Charts height={height} width='100%' option={options} isDestroy />
    </>
  );
};

export default PassengerFlowBar;
