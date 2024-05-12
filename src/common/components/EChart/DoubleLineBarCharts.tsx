/**
 * @Description 折线双柱状混合图
 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { floorKeep, isNotEmptyAny, replaceEmpty } from '@lhb/func';
import { UniversalTransition } from 'echarts/features';
import { formatNumber } from '@/common/utils/ways';
import EChart from '.';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

// 计算最大值
function calMax(arr) {
  let max = arr[0] || 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  const maxInt = Math.ceil(+floorKeep(max, 9.5, 4, 2));// 不让最高的值超过最上面的刻度

  const maxVal = floorKeep(maxInt, 10, 3, 0);// 让显示的刻度是整数

  return maxVal;
}

// 计算最小值
function calMin(arr) {
  let min = arr[0] || 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }
  const minInt = Math.floor(+floorKeep(min, 10, 4, 2));
  const minVal = floorKeep(minInt, 10, 3, 0);// 让显示的刻度是整数

  return minVal;
}


const DoubleLineBarCharts: FC<any> = ({
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
    if (isNotEmptyAny(config.barData1) && isNotEmptyAny(config.lineData) && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.barData1, config?.lineData, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const xData = config.barData1.data.map(item => {
      return item?.[optionLabel];
    });
    const barYData1 = config.barData1.data.map(item => {
      return +item?.[optionVal];
    });
    const barYData2 = config.barData2.data.map(item => {
      return +item?.[optionVal];
    });
    const lineYData = config.lineData.data.map(item => {
      if (item?.[optionVal] && item[optionVal].indexOf('%') > -1) {
        return Number(item[optionVal].replace('%', ''));
      }
      return item?.[optionVal] && floorKeep(item[optionVal], 100, 3, 2);
    });


    const tooltip = {
      trigger: 'axis',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {})
    };

    /**
     * 如果需要修改图例的样式，可以通过config.otherOptions 覆盖
     */
    const legend = {
      show: true,
      y: 'bottom',
      icon: 'circle', // 设置为默认的圆形图标
      itemWidth: 8, // 图例宽度
      itemHeight: 10, // 图例高度
      data: [config?.barData1.name, config?.barData2.name, config?.lineData.name],
    };

    // x轴配置
    const xAxis = [{
      type: 'category',
      data: xData,
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(166, 166, 166, 0.15)',
          width: '1'
        }
      },
      axisLabel: {
        color: '#A2A9B0', // 轴文字样式
        rotate: config.rotateVal,
      },
      splitLine: { // 分割线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      axisPointer: {
        type: 'shadow'
      },
      ...(config.xAxisConfig || {})
    }];


    // const Min1 = calMin(barYData);
    const Min2: any = calMin(lineYData);
    const BarMax1: any = calMax(barYData1);
    const BarMax2: any = calMax(barYData2);
    const Max2: any = calMax(lineYData);

    // y轴公共配置项
    const yAxisPublicConfig = {
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(166, 166, 166, 0.15)',
          width: '1'
        }
      },
      axisLabel: {
        color: '#A2A9B0',
      },
      axisLine: { // 轴线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
    };

    // y轴配置
    const yAxis = [
      {
        type: 'value',
        min: 0, // 柱状图目前不会出现负数，暂时先设定最小值为0
        max: BarMax1 > BarMax2 ? BarMax1 : BarMax2,
        splitNumber: 10,
        interval: floorKeep(((BarMax1 > BarMax2 ? BarMax1 : BarMax2) - 0), 5, 4, 0) || 10, // 强制设置坐标轴分割间隔
        ...yAxisPublicConfig,
        ...(config.barYAxisConfig || {}) // 柱状图y轴传入配置
      },
      {
        type: 'value',
        min: Min2,
        max: Max2,
        splitNumber: 10,
        interval: floorKeep((Max2 - Min2), 5, 4, 0) || 10, // 强制设置坐标轴分割间隔,如过计算出来的间隔为0，则设置为10
        ...yAxisPublicConfig,
        axisLabel: {
          formatter: (val) => {
            return val + '%';
          },
          color: '#A2A9B0'
        },
        ...(config.lineYAxisConfig || {}), // 折线图y轴传入配置

      }
    ];

    const series = [
      {
        name: config?.barData1.name,
        type: 'bar',
        data: barYData1,
        barWidth: 12, // 柱状宽度
        itemStyle: {
          color: '#A6E7D0'
        },
        tooltip: {
          valueFormatter: function (value) {
            return formatNumber(value); // 格式化数字
          }
        },
        ...(config.barSeries1Config || {}) // 柱状图series传入配置
      },
      {
        name: config?.barData2.name,
        type: 'bar',
        data: barYData2,
        barWidth: 12, // 柱状宽度
        itemStyle: {
          color: '#358AFF'
        },
        tooltip: {
          valueFormatter: function (value) {
            return formatNumber(value); // 格式化数字
          }
        },
        ...(config.barSeries2Config || {}) // 柱状图series传入配置
      },
      {
        name: config?.lineData.name,
        type: 'line',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#FFE771' // 0% 处的颜色
            }, {
              offset: 1, color: '#FFC161' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        data: lineYData,
        yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
        tooltip: {
          valueFormatter: function (value) {
            return replaceEmpty(value) + '%';
          }
        },
        ...(config.lineSeriesConfig || {}) // 折线图series传入配置
        // min: 0,
        // max: 100,
        // interval: 5,
        // data: [200, 300, 400, 500, 600, 700, 800]
      }
    ];

    setOptions({
      tooltip,
      xAxis,
      yAxis,
      legend,
      series,
      grid: config.grid,
      ...config?.otherOptions // 除xAxis/yAxis/series之外的配置
    });

  };

  return (
    <EChart
      height={height}
      width={width}
      option={options}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default DoubleLineBarCharts;
