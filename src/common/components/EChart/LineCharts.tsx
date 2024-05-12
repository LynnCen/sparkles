/**
 * @Description 折线图
 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import EChart from '.';

echarts.use([
  LineChart,
  CanvasRenderer,
  GridComponent
]);

const LineCharts: FC<any> = ({
  height = '100%',
  width = '100%',
  optionLabel = 'name',
  optionVal = 'data',
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
      ...(config.tooltipConfig || {}), // tooltip额外传入的配置
    };

    const xAxis = [{ // x轴配置
      type: 'category',
      data: xData,
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
      data: yData,
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
        data: yData,
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
      }
    ];

    setOptions({
      tooltip,
      xAxis,
      yAxis,
      series,
      grid: config.grid,
      ...(config?.otherOptions || {}) // 除xAxis/yAxis/series之外的配置
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

export default LineCharts;
