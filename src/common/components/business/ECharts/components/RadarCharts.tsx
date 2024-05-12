/** 雷达图 */
import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { RadarChart } from 'echarts/charts';

echarts.use([
  TitleComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
]);


const ringColors = [
  '#1890FF',
  '#FFC62B',
  '#5A76F9',
  '#36C3FB',
  '#A272FF',
  '#36C3FB',
  '#50DFB2',
  '#fe861d',
  '#2a6835',
  '#7b8850',
  '#683c2a',
  '#47ad58',
  '#c836be',
  '#eb93a6',
  '#3db1f7',
  '#a4734f',
  '#2edbd6',
  '#a74b7b',
  '#ec3535',
  '#fdbf78',
  '#346dbc',
  '#bc78fd',
  '#fd78d3',
  '#cfa35b'
];
const RadarCharts: FC<any> = ({
  className,
  optionLabel = 'name',
  config
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

  const initOptions = () => {
    const { data, indicator } = config;
    if (config.isDynamicData) {
      const len = data.length;
      // legendItemHeight: legend每行高度
      ins.resize({ height: (len * (config.legendItemHeight || 22) + 100) }); // 计算容器高度
    }

    const legendData = data.map((item) => {
      return item[optionLabel];
    });

    const tooltip = {
      trigger: 'item',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {})
    };

    const legend = {
      orient: config.orient || 'horizontal',
      align: 'auto',
      itemWidth: 4, // 图例宽度
      itemHeight: 10, // 图例高度
      icon: 'circle', // 图例样式
      top: config.legendTop,
      data: legendData,
      ...(config.legendConfig || {})
    };

    const radar = {
      // shape: 'circle', // 雷达图样式
      indicator: indicator,
      center: ['50%', '50%'], // 图表位置
      radius: '70%',
    };

    // 设置第一条轴上的坐标轴
    radar.indicator[0].axisTick = {
      show: true,
      lineStyle: {
        color: '#BFBFBF', // 坐标轴颜色
        width: 1 // 坐标轴宽度
      }
    };

    // 设置第一条轴上的坐标轴标签
    radar.indicator[0].axisLabel = {
      show: true,
    };


    const series = [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: data,
        ...(config.seriesConfig || {})
      }
    ];

    setOptions({
      color: ringColors,
      radar,
      tooltip,
      legend,
      series
    });
  };

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  return (
    <ECharts
      options={options}
      className={className}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default RadarCharts;
