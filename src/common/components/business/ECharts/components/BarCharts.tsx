/** 柱状图 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer
]);

const BarCharts: FC<any> = ({
  className,
  optionLabel = 'name',
  optionVal = 'data',
  config = {},
  type = 'vertical', // vertical 竖形条形图，horizontal 横向条形图
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);

  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);

  useEffect(() => {
    if (config.data?.length && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.data, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const xData = config.data.map(item => {
      return item[optionLabel];
    });
    const yData = config.data.map(item => {
      return item[optionVal];
    });

    const tooltip = {
      trigger: 'axis',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {})
    };

    // x轴公共配置项
    const xAxisOtherConfig = {
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      splitLine: { // 分割线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      ...(config.xAxisConfig || {})
    };

    // x轴配置
    const xAxis = type === 'vertical' ? [{
      type: 'category',
      data: xData,
      axisLabel: {
        color: '#A2A9B0',
        fontSize: 12,
        rotate: config.rotateVal,
        interval: 0,
        textStyle: { // 轴文字样式
          color: '#A2A9B0'
        }
      },
      ...xAxisOtherConfig
    }] : [{
      type: 'value',
      axisLabel: {
        textStyle: {
          color: '#A2A9B0',
        },
      },
      ...xAxisOtherConfig
    }];

    // y轴公共配置项
    const yAxisOtherConfig = {
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#A2A9B0',
        },
      },
      axisLine: { // 轴线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      ...(config.yAxisConfig || {})
    };

    // y轴配置
    const yAxis = type === 'vertical' ? [{
      type: 'value',
      ...yAxisOtherConfig
    }] : [{
      type: 'category',
      data: yData,
      axisLabel: {
        color: '#A2A9B0',
        fontSize: 12,
        rotate: config.rotateVal,
        interval: 0,
        textStyle: { // 轴文字样式
          color: '#A2A9B0'
        }
      },
      ...yAxisOtherConfig
    }];

    const series = type === 'vertical' ? [
      {
        type: 'bar',
        data: yData,
        barWidth: 12, // 柱状宽度,
        ...(config.seriesConfig || {})
      }
    ] : [
      {
        type: 'bar',
        data: xData,
        barWidth: 6, // 柱状宽度
        ...(config.seriesConfig || {})
      }
    ];

    setOptions({
      tooltip,
      xAxis,
      yAxis,
      series,
      grid: config.grid,
      ...config?.otherOptions // 除xAxis/yAxis/series之外的配置
    });

  };

  return (
    <ECharts
      options={options}
      className={className}
      otherOption={{
        notMerge: true
      }}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default BarCharts;
