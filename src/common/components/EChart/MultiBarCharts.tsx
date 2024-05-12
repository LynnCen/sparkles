/**
 * @Description 多根柱状图
 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import EChart from '.';

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent
]);

const MultiBarCharts: FC<any> = ({
  height = '100%',
  width = '100%',
  config = {},
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);

  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);

  useEffect(() => {
    if (config.xAxisData?.length && config.seriesConfig?.length && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.xAxisData, config.seriesConfig, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {


    const tooltip = {
      trigger: 'axis',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {})
    };


    // x轴配置
    const xAxis = [{
      type: 'category',
      data: config.xAxisData,
      axisLabel: {
        color: '#A2A9B0',
        fontSize: 12,
        rotate: config.rotateVal,
        interval: 0,
        textStyle: { // 轴文字样式
          color: '#A2A9B0'
        }
      },
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
    }];

    // y轴配置
    const yAxis = [{
      type: 'value',
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
    }];

    const series = [
      ...(config.seriesConfig || {}) // 多根柱状图series为数组格式，直接由外部传入
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
    <EChart
      option={options}
      height={height}
      width={width}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default MultiBarCharts;
