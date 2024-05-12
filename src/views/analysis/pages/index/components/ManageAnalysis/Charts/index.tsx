/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
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
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import Charts from '@/common/components/EChart';
import { dataConvertToEchartsData } from '@/common/utils/ways';
import { orderStatistic } from '@/common/api/order';
import { getStatisticsOptions } from './echart-option';
import { InitialProps, OrderStatisticProps, OrderStatisticResultProps } from '../../../ts-config';
import { Spin } from 'antd';

import styles from '../index.module.less';

// 注册必须的组件
echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
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

const CustomerCharts: React.FC<InitialProps> = ({ filters }) => {
  const { start, end, storeIds, dateScope } = filters;
  const [data, setData] = useState<OrderStatisticProps>({
    orderData: [],
    saleAmountData: [],
    date: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (start && end && storeIds) {
      getFlowStoresStatistics();
    }
  }, [start, end, storeIds]);

  // 获取数据
  const getFlowStoresStatistics = async () => {
    setLoading(true);
    const params = { start, end, dateScope, storeIds: [storeIds] };
    const result: OrderStatisticResultProps = await orderStatistic(params);
    const chartsData: any = dataConvertToEchartsData(result.orderDataList || [], 'name', 'order', 'saleAmount');
    setLoading(false);
    setData({
      orderData: chartsData.y,
      saleAmountData: chartsData.y2,
      date: chartsData.x,
    });
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.customerCharts}>
        <Charts height='400px' width='100%' option={getStatisticsOptions(data)} />
      </div>
    </Spin>
  );
};

export default CustomerCharts;
