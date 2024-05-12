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
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts';
// 全局过渡动画等特性
import { UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import Charts from '@/common/components/EChart';
import { getStatisticsOptions } from './echart-option';
import { get } from '@/common/request/index';

import { PolylineProps } from '../../ts-config';
// import Stores from '../Stores';
import { Spin } from 'antd';

import styles from '../index.module.less';

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

const CustomerCharts: React.FC<PolylineProps> = ({ filters }) => {
  const [options, setOptions] = useState<EChartsOption>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (filters.start && filters.end) {
      setLoading(true);
      getFlowStatistics();
    }
  }, [filters]);

  // 获取客流分析折线图数据
  const getFlowStatistics = async () => {
    // https://yapi.lanhanba.com/project/455/interface/api/44386
    const data: any = await get('/carStore/carStatisticsChart', filters, true);
    const legendData = ['过店客流', '进店数', '留资数', '试驾数', '订单数'];
    const optionSeries = [
      {
        name: '过店客流',
        type: 'line',
        yAxisIndex: 0,
        data: data?.passby?.data || [],
      },
      {
        name: '进店数',
        type: 'line',
        yAxisIndex: 0,
        data: data?.indoor?.data || [],
      },
      {
        name: '留资数',
        type: 'line',
        yAxisIndex: 0,
        data: data?.stayInfo?.data || [],
      },
      {
        name: '试驾数',
        type: 'line',
        yAxisIndex: 0,
        data: data?.testDrive?.data || [],
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 0,
        data: data?.order?.data || [],
      },
    ];
    // 整合过店客流和进店客流数据，取其中的最大值
    // const passengerFlowData = (data?.passby?.data || []).concat(data?.indoor?.data || []);
    const passengerFlowData = data?.indoor?.data || [];
    setOptions(
      getStatisticsOptions(
        legendData,
        optionSeries,
        passengerFlowData,
        data?.order?.data || [],
        data?.passby?.date || [],
        '%'
      )
    );
    setLoading(false);
  };

  return (
    <>
      <Spin wrapperClassName={styles.chartsWrap} spinning={loading}>
        <Charts height='376px' width='100%' option={options} isDestroy />
      </Spin>
    </>
  );
};

export default CustomerCharts;
