/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { lineOption } from '@/common/enums/echarts/line';
import Charts from '@/common/components/EChart';
import Empty from '@/common/components/Empty';

echarts.use([TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition]);

export type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | LegendComponentOption | LineSeriesOption
>;

const commonSeries: any = {
  type: 'line',
  smooth: true,
  showSymbol: false,
  emphasis: { focus: 'series' },
};

const Trent: React.FC<any> = ({ data, tooltipFormatterUnit, yAxisConfig, legendData, storeInfos }) => {
  const [option, setOption] = useState<any>({});

  useEffect(() => {
    const loadOptions: any = (data: Array<any>, legendData: Array<string>, storeInfos: any[]) => {
      const series = storeInfos.map((store, index) => {
        // 存在单门店多个时间维度的对比，所以需带上时间来确定对应门店的数据
        const target = data.find(
          (item) => `${store.id}-${store.start}-${store.end}` === `${item.id}-${item.startDate}-${item.endDate}`
        );

        return { ...commonSeries, name: legendData[index], type: 'line', data: target?.chartData || [] };
      });

      // 最长的为横轴
      const maxXDate = data.reduce((prev, next) => {
        const prevList = Array.isArray(prev) ? prev : prev.date || [];
        return prevList.length > (next.date || []).length ? prevList : next.date || [];
      });

      return {
        // 把x、y轴看做是个容器，设置容器上、右、下、左的距离
        grid: { top: 50, bottom: 50, containLabel: true },
        legend: {
          // 设置图表中折线对应的标题位置的说明
          ...lineOption.legend,
          data: legendData,
          type: 'scroll',
        },
        tooltip: {
          ...lineOption.tooltip,
          formatter(params) {
            if (!Array.isArray(params)) return '';
            return params.reduce((sum, cur) => {
              return `${sum} ${cur.name} ${cur.seriesName} ${cur.value}${tooltipFormatterUnit}<br />`;
            }, '') as string;
          },
        },
        xAxis: {
          type: 'category',
          data: maxXDate,
          ...lineOption.xAxis,
        },
        yAxis: { ...lineOption.yAxis, ...yAxisConfig, type: 'value' },
        series,
      };
    };
    if (storeInfos.length && data.length) {
      const options: EChartsOption = loadOptions(data, legendData, storeInfos);
      setOption(options);
    }
  }, [data, storeInfos]);

  if (!data.length) {
    return (
      <div style={{ height: '200px', padding: '40px 0' }}>
        <Empty />
      </div>
    );
  }

  return <Charts height='400px' width='100%' option={option} isDestroy />;
};

export default Trent;
