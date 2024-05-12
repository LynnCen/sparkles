import { FC, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import { TooltipComponent, MarkLineComponent } from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import ECharts from '@/common/components/EChart';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ScatterChart,
  TooltipComponent,
  CanvasRenderer,
  MarkLineComponent
]);

const ScatterCharts:FC<any> = ({
  config,
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);

  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);

  useEffect(() => {
    if (config.data.length && ins) {
      initOptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.data, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const markLineOpt = {
      animation: false,
      lineStyle: {
        type: 'dashed'
      },
      data: [
        [
          {
            coord: config.startData,
            symbol: 'none'
          },
          {
            coord: config.endData,
            symbol: 'none'
          }
        ]
      ],
      tooltip: {
        formatter: function() {
          return config.label;
        },
        position: 'bottom',

      }
    };
    const series = [
      {
        symbolSize: 7,
        data: config.data,
        type: 'scatter',
        colorBy: 'data',
        markLine: markLineOpt
      }
    ];
    const grid = {
      x: 60,
      y: 25,
      x2: 30,
      y2: 50
    };
    const tooltip = {
      trigger: 'item',
      formatter: function(params) {
        return `转化率：${params.data[1]}%\n人群占比：${params.data[0]}`;
      },
      extraCssText: 'white-space:pre-wrap',
      position: 'bottom',
      ...(config.tooltipConfig || {})
    };
    const yAxis = {
      min: 0,
      max: 0.16,
      interval: 0.02,
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: '{value}'
      },
      name: `转\n化\n率\n`,
      nameRotate: 360,
      ...(config.yAxis || {})
    };
    const xAxis = {
      nameLocation: 'middle',
      nameRotate: 360,
      nameGap: 35,
      ...(config.xAxis || {})
    };
    setOptions({
      series,
      xAxis,
      yAxis: yAxis,
      grid,
      tooltip
    });
  };
  return (
    <ECharts
      option={options}
      height='300px'
      width='560px'
      loadedEchartsHandle={loadedHandle}
    />
  );

};
export default ScatterCharts;
