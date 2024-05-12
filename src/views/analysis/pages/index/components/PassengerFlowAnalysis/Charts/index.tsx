/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts/core';
// // 按需引入组件，后缀为Component,  系列类型的定义后缀都为 Option
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

import { get } from '@/common/request/index';
import Charts from '@/common/components/EChart';

import PieCharts from '@/common/components/EChart/PieChart';
import { Card, Col, Row } from 'antd';

import { getStatisticsOptions } from './echart-option';
import { InitialProps, StoreAnalysisProps } from '@/views/analysis/pages/index/ts-config';
import { Spin } from 'antd';
import { isArray } from '@lhb/func';

import styles from './index.module.less';

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

const defaultValue = { name: '', date: [], data: [] };

const CustomerCharts: React.FC<InitialProps> = ({ filters }) => {
  const [data, setData] = useState<StoreAnalysisProps>({
    flows: { indoorFlow: defaultValue, passbyFlow: defaultValue, indoorRate: defaultValue },
    genderRate: [],
    ageRate: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { start, end, storeIds, dateScope } = filters;
  useEffect(() => {
    if (start && end && storeIds) {
      getFlowStoresStatistics();
    }
  }, [start, end, storeIds]);

  // 获取数据
  const getFlowStoresStatistics = async () => {
    setLoading(true);
    const params = { start, end, dateScope, storeId: storeIds };
    // https://yapi.lanhanba.com/project/297/interface/api/33372
    const result: StoreAnalysisProps = await get('/store/analysis', params);
    setData(result);
    setLoading(false);
  };

  return (
    <Spin spinning={loading} className={styles.flowAbout}>
      <div className={styles.flowAbout}>
        <div className={styles.flowCharts}>
          <Charts height='400px' width='100%' option={getStatisticsOptions(data.flows)} />
        </div>
        <Row gutter={[16, 0]} className={styles.genderRateRow}>
          {isArray(data?.genderRate) && data?.genderRate.length ? <Col span={12}>
            <Card>
              <PieCharts data={data?.genderRate || []} title='进店客群男女比例' unit='' />
            </Card>
          </Col> : <></>}
          {isArray(data?.ageRate) && data?.ageRate.length ? <Col span={12}>
            <Card>
              <PieCharts data={data?.ageRate || []} title='进店客群年龄比例' />
            </Card>
          </Col> : <></>}
        </Row>
      </div>
    </Spin>
  );
};

export default CustomerCharts;
