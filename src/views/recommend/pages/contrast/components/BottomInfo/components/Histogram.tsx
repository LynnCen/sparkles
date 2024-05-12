/** 柱状图 */
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { barChartColor, colorChart } from '../../../ts-config';

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  TooltipComponent
]);

const Histogram: FC<any> = ({
  // forwardedRef,
  width,
  className,
  xData,
  direction = 'vertical', // 'horizontal' | 'vertical';
  yData, // y00,y10,y20,y30对应x0轴;  y01,y11,y21,y31对应x1轴
  config = {},
  data,
  formatterText, // 自定义显示hover数据
  chartColor, // 自定义barchart颜色
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);
  const dataRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);

  useEffect(() => {
    if (ins) {
      ins.resize();
    }
  }, [ins, width]);

  useEffect(() => {
    dataRef.current = data;
    if (xData?.length && yData.length && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xData, yData, ins, data]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const formatter = useCallback((a) => {
    if (formatterText) {
      return formatterText();
    }
    let str = `${a[0]?.axisValueLabel}<br/>`;

    dataRef?.current[a[0]?.dataIndex]?.dataList?.map((item, index) => {
      str += `<span style="
      display: inline-block;
      height: 10px;
      margin-right:5px;
      width: 10px;
      border-radius: 50%;
      background-color: ${barChartColor[index][0]};
      "></span>${item.shortName || item.name}：${item.value}<br/>`;
    });
    return str;
  }, [data]);

  const initOptions = () => {
    const color = colorChart; // 设置柱条的颜色
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
    const xAxis = [{
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
    const yAxis = [{
      type: 'value',
      ...yAxisOtherConfig,
      // 不显示y轴数值标签
      // axisLabel: {
      //   show: false
      // },
    }];
    const series:any = [];
    yData.map((item, index) => {
      series.push({
        type: 'bar',
        data: item,
        barWidth: 12, // 柱状宽度,
        barGap: 1, // 设置柱条间隔为柱子宽的的100%
        itemStyle: {
          normal: {
            color: function() {
              return {
                type: 'linear',
                x: direction === 'vertical' ? 0 : 1,
                y: 0,
                x2: 0,
                y2: direction === 'vertical' ? 1 : 0,
                colorStops: [{
                  offset: 0, color: chartColor?.[0] || barChartColor[index][0]
                },
                {
                  offset: 1, color: chartColor?.[0] || barChartColor[index][0]
                }
                ],
              };
            }
          }
        },
        ...(config.seriesConfig || {}),
      });
    });

    const grid = {
      left: 80,
      top: 10,
      right: 20,
      bottom: 20,
      ...(config.grid || {})
    };
    setOptions({
      tooltip,
      xAxis: direction === 'vertical' ? xAxis : yAxis,
      yAxis: direction === 'vertical' ? yAxis : xAxis,
      series,
      grid,
      color,
      rich: {
        green: {
          color: 'green'
        },
        red: {
          color: 'red'
        }
      },
      formatter: (e) => formatter(e),
      // formatter: `{b0}:{c0}<br/>{b1}:{c1}<br/>{a}`,
      ...config?.otherOptions // 除xAxis/yAxis/series之外的配置
    });

  };
  // React.useImperativeHandle(forwardedRef, () => ({
  //   _eIns: ins, // 手动关闭弹出层
  // }));
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

export default Histogram;
