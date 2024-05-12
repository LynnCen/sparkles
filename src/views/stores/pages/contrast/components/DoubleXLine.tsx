/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';
// // 按需引入组件，后缀为Component,  系列类型的定义后缀都为 Option
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
// 按需引入需要的图表类型
import { LineChart, LineSeriesOption } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { lineOption } from '@/common/enums/echarts/line';
import Charts from '@/common/components/EChart';

// 注册必须的组件
echarts.use([TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition]);

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | LegendComponentOption | LineSeriesOption
>;

const commonSeries: any = {
  type: 'line',
  smooth: true,
  showSymbol: false, // 对应坐标轴时，折线上的圆点才显示
  emphasis: {
    focus: 'series',
  },
};

const CustomerCharts: React.FC<any> = ({ data, tooltipFormatterUnit, yAxisConfig, legendData }) => {
  const [option, setOption] = useState<any>({});

  useEffect(() => {
    const loadOptions: any = (data: Array<any>, legendData: Array<string>) => {
      return {
        // 把x、y轴看做是个容器，设置容器上、右、下、左的距离
        grid: { top: 50, bottom: 50, containLabel: true },
        legend: {
          // 设置图表中折线对应的标题位置的说明
          ...lineOption.legend,
          data: legendData,
        },
        tooltip: {
          ...lineOption.tooltip,
          formatter: `{b0}<br /> {a0}  {c0}${tooltipFormatterUnit}<br /> {b1}<br />{a1}  {c1}${tooltipFormatterUnit}`,
        },
        xAxis: [
          // x轴配置
          { type: 'category', ...lineOption.xAxis, data: data[0].date },
          { type: 'category', ...lineOption.xAxis, data: data[1].date },
        ],
        yAxis: [
          // y轴配置
          { ...lineOption.yAxis, ...yAxisConfig, type: 'value' },
        ],
        series: [
          // 下方的x轴
          { name: legendData[0], data: data[0].data, ...commonSeries },
          // 上方的x轴
          { name: legendData[1], xAxisIndex: 1, data: data[1].data, ...commonSeries },
        ],
      };
    };
    const options: EChartsOption = loadOptions(data, legendData);
    setOption(options);
  }, [data, tooltipFormatterUnit, yAxisConfig, legendData]);

  return <Charts height='300px' width='100%' option={option} isDestroy />;
};

export default CustomerCharts;
