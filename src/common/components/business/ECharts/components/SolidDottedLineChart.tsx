/** 折线图 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';

echarts.use([
  LineChart,
  CanvasRenderer,
  GridComponent
]);

const SolidDottedLineChart: FC<any> = ({
  className,
  height,
  width,
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
    if ((config?.y1Data || config?.y2Data) && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.y1Data, config?.y2Data, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const tooltip = {
      trigger: 'axis',
      // formatter: '{b}: {c}',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {}), // tooltip额外传入的配置
    };

    const xAxis = [{ // x轴配置
      type: 'category',
      data: config.xData,
      axisLine: {
        lineStyle: { // x轴线样式
          color: '#eee',
          width: 1
        }
      },
      axisLabel: { // x轴文字样式
        color: '#A2A9B0',
        fontSize: 12,
        rotate: config.rotateVal,
        interval: 0
      },
      axisTick: { // 刻度线
        show: false
      },
      ...(config.xAxisConfig || {}), // x轴额外传入的配置
    }];
    const yAxis = [{ // y轴配置
      name: '人次',
      nameLocation: 'end',
      nameTextStyle: {
        color: '#282A2A',
        fontSize: 12,
        // padding: [5, 0, 0, 0]
      },
      type: 'value',
      data: config.y1Data,
      axisTick: { // 刻度线
        show: true
      },
      axisLabel: { // y轴文字样式
        color: '#A2A9B0',
        fontSize: 12,
        // formatter: '{value} %'// 纵坐标百分比
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#eee',
          width: 1
        }
      },
      ...(config.yAxisConfig || {})// y轴额外传入的配置
    }, { // y轴配置
      name: '人次',
      nameLocation: 'end',
      nameTextStyle: {
        color: '#282A2A',
        fontSize: 12,
        // padding: [5, 0, 0, 0]
      },
      type: 'value',
      data: config.y2Data,
      axisTick: { // 刻度线
        show: true
      },
      axisLabel: { // y轴文字样式
        color: '#A2A9B0',
        fontSize: 12,
        // formatter: '{value} %'// 纵坐标百分比
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#eee',
          width: 1
        }
      },
      ...(config.yAxisConfig || {})// y轴额外传入的配置
    }];
    const series = [
      {
        type: 'line',
        data: config.y1Data,
        lineStyle: { // 折线图颜色样式
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(255, 193, 97, 1)'
            }, {
              offset: 1, color: 'rgba(255, 231, 113, 1)'
            }],
            global: false
          }
        },
        smooth: true,
        showSymbol: false, // 是否默认展示圆点
        ...(config.seriesConfig || {}) // 图表series额外传入的配置,一般用来配置颜色
      },
      {
        type: 'line',
        data: config.y2Data,
        lineStyle: { // 折线图颜色样式
          type: 'dotted',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(255, 193, 97, 1)'
            }, {
              offset: 1, color: 'rgba(255, 231, 113, 1)'
            }],
            global: false
          }
        },
        smooth: true,
        showSymbol: false, // 是否默认展示圆点
        ...(config.seriesConfig || {}) // 图表series额外传入的配置,一般用来配置颜色
      }
    ];

    setOptions({
      tooltip,
      xAxis,
      yAxis,
      series,
      grid: config.grid
    });

  };

  return (
    <ECharts
      options={options}
      height={height}
      width={width}
      className={className}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default SolidDottedLineChart;
