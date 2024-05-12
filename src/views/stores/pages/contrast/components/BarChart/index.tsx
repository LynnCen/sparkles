/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import { BarChart, BarSeriesOption } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { BarChartsProps } from '../../ts-config';
import Charts from '@/common/components/EChart';
import { getMaxData } from '@/common/utils/ways';
import { lineOption } from '@/common/enums/echarts/line';
import merge from 'lodash.merge';

// 注册必须的组件
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
]);

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type EChartsOption = echarts.ComposeOption<
  ToolboxComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption | BarSeriesOption
>;

const commonSeries: any = {
  type: 'bar',
  barMinWidth: 4,
  barMaxWidth: 10,
  label: {
    // 设置柱子上文字显示 https://www.echartsjs.com/zh/option.html#series-bar.label
    show: true,
    position: 'right',
    color: '#333333',
    fontSize: 11,
    padding: [3, 0, 0, 0],
    formatter: function (params) {
      return params.value || '';
    },
  },
};

export const GenderBarChart: React.FC<BarChartsProps> = ({ dataList, legendData, storeInfos }) => {
  const [options, setOptions] = useState<EChartsOption>({});

  useEffect(() => {
    if (!Array.isArray(dataList) || !dataList.length || !legendData.length) {
      return;
    }
    const yNameData: string[] = ['男生', '女生'];

    const seriesData = storeInfos.map((item, index) => {
      // 单门店多个时间维度的对比，所以需带上时间来确定对应门店的数据
      const target = dataList.find(
        (legend) => `${legend.id}-${legend.startDate}-${legend.endDate}` === `${item.id}-${item.start}-${item.end}`
      );

      return {
        name: legendData[index],
        data: (target && [target?.male || 0, target?.female || 0]) || [],
      };
    });

    const numbers: number[] = seriesData.reduce((sum, cur) => {
      return sum.concat(cur.data);
    }, [] as any[]);

    const maxData = getMaxData(numbers);

    setOptions(getStatisticsOptions(legendData, yNameData, seriesData, maxData));
  }, [dataList, storeInfos]);

  return <Charts height='600px' width='100%' option={options} isDestroy />;
};

export const AgeBarChart: React.FC<BarChartsProps> = ({ dataList, legendData, storeInfos }) => {
  const [options, setOptions] = useState<EChartsOption>({});

  useEffect(() => {
    if (!Array.isArray(dataList) || !dataList.length || !storeInfos.length) {
      return;
    }

    let yNameData: string[] = [];
    if (dataList[0].data && Array.isArray(dataList[0].data)) {
      yNameData = dataList[0].data.map((itm: any) => itm.name);
    }

    const seriesData = storeInfos.map((item, index) => {
      // 单门店多个时间维度的对比，所以需带上时间来确定对应门店的数据
      const target = dataList.find(
        (legend) => `${legend.id}-${legend.startDate}-${legend.endDate}` === `${item.id}-${item.start}-${item.end}`
      );

      return {
        name: legendData[index],
        data: (target && (target.data || []).map((targetItem: any) => targetItem.count)) || [],
      };
    });

    const numbers: number[] = seriesData.reduce((sum, cur) => {
      return sum.concat(cur.data);
    }, [] as any[]);
    const maxData = getMaxData(numbers);

    const options = getStatisticsOptions(legendData, yNameData, seriesData, maxData);

    setOptions(options);
  }, [dataList, storeInfos]);

  return <Charts height='600px' width='100%' option={options} isDestroy />;
};

const getStatisticsOptions = (
  legendData: string[],
  yNameData: string[],
  seriesData: any[],
  maxData: number
): EChartsOption => {
  const option: EChartsOption = {
    grid: { top: '50px', bottom: '30px', containLabel: true },
    legend: { data: legendData, type: 'scroll' },
    xAxis: {
      ...lineOption.xAxis,
      type: 'value',
      splitNumber: 10,
      max: maxData,
      min: 0,
      interval: Math.ceil(maxData / 5), // 强制分为 5 段
      splitLine: {
        show: true,
        lineStyle: { color: '#E5E9F2', width: 1, type: 'dashed' },
      },
    },
    yAxis: {
      name: '人次',
      nameTextStyle: {
        align: 'right',
        verticalAlign: 'top',
        color: '#132144',
      },
      type: 'category',
      data: yNameData,
      axisLine: {
        show: true,
        lineStyle: { color: '#E5E9F2', width: 1, type: 'dashed' },
      },
      axisLabel: {
        color: `#B8BDC4`,
        fontSize: 12,
        margin: 10,
      },
      axisTick: {
        // 刻度相关
        show: false,
      },
    },
    series: seriesData.map((itm) => {
      return {
        ...itm,
        ...commonSeries,
      };
    }),
  };
  const opts = merge({}, lineOption, option);
  return opts;
};
