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
import { orderStatistic } from '@/common/api/order';
import { dataConvertToEchartsData } from '@/common/utils/ways';

import { PolylineProps, StatisticsFlow } from '../../ts-config';
import { OrderStatisticResultProps } from '@/views/analysis/pages/index/ts-config';
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

const CustomerCharts: React.FC<PolylineProps> = ({ filters, activeTab }) => {
  const [options, setOptions] = useState<EChartsOption>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { start, end, dateScope, storeIds, strStoredIds } = filters;

  useEffect(() => {
    if (start && end && storeIds) {
      setLoading(true);
      switch (activeTab) {
        case 'operate':
          getOrderStatisticData();
          break;
        default:
          getFlowStatistics();
          break;
      }
    }
  }, [start, end, storeIds, activeTab]);

  // 获取经营分析折线图数据
  const getOrderStatisticData = async () => {
    const params: any = { start, end, dateScope, storeIds };
    const result: OrderStatisticResultProps = await orderStatistic(params);
    const chartsData: any = dataConvertToEchartsData(result.orderDataList, 'name', 'saleAmount', 'order');
    const legendData = ['店内销售额（元）', '店内订单（笔）'];
    const optionSeries = [
      {
        name: '店内销售额（元）',
        type: 'bar',
        barMaxWidth: 50,
        stack: '总量',
        yAxisIndex: 0,
        data: chartsData.y || [],
      },
      { name: '店内订单（笔）', type: 'line', yAxisIndex: 1, data: chartsData.y2 || [] },
    ];
    setOptions(getStatisticsOptions(legendData, optionSeries, chartsData.y, chartsData.y2, chartsData.x, ''));
    setLoading(false);
  };

  // 获取客流分析折线图数据
  const getFlowStatistics = async () => {
    const params = { start, end, dateScope, storeIds: strStoredIds };
    // https://yapi.lanhanba.com/project/297/interface/api/33370
    const data: StatisticsFlow = await get('/store/flow/statistics', params, true);
    const legendData = ['进店客流', '过店客流', '进店率'];
    const optionSeries = [
      {
        name: '进店客流',
        type: 'bar',
        barMaxWidth: 50,
        stack: '总量',
        yAxisIndex: 0,
        data: data?.indoorFlow?.data || [],
      },
      { name: '过店客流', type: 'bar', barMaxWidth: 50, yAxisIndex: 0, data: data?.passbyFlow?.data || [] },
      {
        name: '进店率',
        type: 'line',
        yAxisIndex: 1,
        data: data.indoorRate?.data || [],
      },
    ];
    // 整合过店客流和进店客流数据，取其中的最大值
    const passengerFlowData = (data?.passbyFlow?.data || []).concat(data?.indoorFlow?.data || []);
    setOptions(
      getStatisticsOptions(
        legendData,
        optionSeries,
        passengerFlowData,
        data?.indoorRate?.data || [],
        data?.indoorRate?.date || [],
        '%'
      )
    );
    setLoading(false);
  };

  return (
    <>
      {/* <Stores activeTab={activeTab} /> */}
      <Spin wrapperClassName={styles.chartsWrap} spinning={loading}>
        <div className={styles.chartsContainer}>
          <Charts height='376px' width='100%' option={options} isDestroy />
        </div>
      </Spin>
    </>
  );
};

export default CustomerCharts;
