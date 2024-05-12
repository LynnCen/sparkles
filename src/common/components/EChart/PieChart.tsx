/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';
// 按需引入组件，后缀为Component,  系列类型的定义后缀都为 Option
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
} from 'echarts/components';
// 按需引入需要的图表类型
import { PieChart, PieSeriesOption } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// import { FlowIProps } from '@/pages/StoreAnalysis/Index/ts-config';
import Charts from '@/common/components/EChart';
import { pieColor } from '@/common/enums/color';

// 注册必须的组件
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
  PieChart,
]);

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type EChartsOption = echarts.ComposeOption<
  ToolboxComponentOption | TooltipComponentOption | PieSeriesOption | LegendComponentOption
>;

interface IProps {
  data: any[];
  title: string;
  unit?: string;
}

const CustomerCharts: React.FC<IProps> = ({ data, title, unit = '%' }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    getFlowStoresStatistics();
  }, [data]);

  // 获取数据
  const getFlowStoresStatistics = useMemo(
    () => async () => {
      const options: EChartsOption = {
        title: { text: title, textStyle: { fontSize: 16 } },
        color: pieColor,
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          icon: 'circle',
          orient: 'vertical',
          right: '5%',
          top: 'middle', // 居中
          bottom: '20%',
          type: 'scroll', // 图例超过一页翻页显示
          data: data,
          formatter: (name) => {
            const list = options.series && options.series[0].data;
            const target = list.find((item) => item.name === name);
            let percent = unit ? target.value : '';
            // 如果不是百分比的数值，则处理后填入
            if (!unit) {
              let total = 0;
              for (var i = 0; i < list.length; i++) {
                total += list[i].value;
              }
              percent = total === 0 ? 0 : ((target.value / total) * 100).toFixed(2);
            }
            return `{name|${name}}{line||}{percent|${percent}%}`;
          },
          textStyle: {
            color: '#132144',
            rich: {
              name: { color: '#132144' },
              line: { padding: [0, 0, 0, 10], color: '#d9d9d9' },
              percent: { padding: [0, 10, 0, 10], color: '#949CAE' },
              value: { color: '#132144' },
            },
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['48%', '70%'],
            center: ['30%', '50%'],
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 4,
            },
            minAngle: 10,
            label: { show: false },
            labelLine: { show: false },
            data: data,
            tooltip: {
              formatter: function (params): string {
                if (Array.isArray(params)) return '';
                return `${params.marker} ${params.name} ${params.percent}%`;
              },
            },
          },
        ],
      };
      setOptions(options);
    },
    [data]
  );

  return <Charts height='300px' width='100%' option={options} isDestroy />;
};

export default CustomerCharts;
