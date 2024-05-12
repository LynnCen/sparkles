import { FC, useState, useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import * as echarts from 'echarts/core';
import { TooltipComponent, TooltipComponentOption, LegendComponent, LegendComponentOption } from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import Chart from '@/common/components/EChart';
import { orderProportion } from '@/common/api/order';
import { getPieOptions } from './pieCharts-options';
import { FlowIProps } from '@/views/overview/pages/index/ts-config';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout]);

export type EChartsOption = echarts.ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

const RatioPieChart: FC<FlowIProps> = ({ filters }) => {
  const { start, end, storeIds } = filters;
  const [options, setOptions] = useState<{ salesOptions: EChartsOption; orderOptions: EChartsOption }>({
    salesOptions: {},
    orderOptions: {},
  });

  useEffect(() => {
    const getPieChartData = async () => {
      const saleAmountResult = await orderProportion({ storeIds, start, end, sortBy: 'saleAmount' });
      const orderAmountResult = await orderProportion({ storeIds, start, end, sortBy: 'order' });
      const saleData =
        (Array.isArray(saleAmountResult?.proportionList) &&
          saleAmountResult?.proportionList.map((item) => ({
            name: item.storeName,
            value: item.saleAmount,
          }))) ||
        [];
      const orderData =
        (Array.isArray(orderAmountResult?.proportionList) &&
          orderAmountResult?.proportionList.map((item) => ({
            name: item.storeName,
            value: item.order,
          }))) ||
        [];
      setOptions({
        salesOptions: getPieOptions({
          title: '销售额分布',
          data: saleData,
          totalName: '销售额（元）',
          unit: '¥',
          totalNum: saleAmountResult?.total?.saleAmount || 0,
        }),
        orderOptions: getPieOptions({
          title: '订单分布',
          data: orderData,
          totalName: '订单数（笔）',
          totalNum: orderAmountResult?.total?.order || 0,
        }),
      });
    };
    if (start && end) {
      getPieChartData();
    }
  }, [start, end, storeIds]);

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col span={12}>
        <Card>
          <Chart option={options.salesOptions} height={'300px'} isDestroy />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Chart option={options.orderOptions} height={'300px'} isDestroy />
        </Card>
      </Col>
    </Row>
  );
};

export default RatioPieChart;
