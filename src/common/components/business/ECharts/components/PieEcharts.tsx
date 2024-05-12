import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';

echarts.use([
  PieChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent
]);
// type EChartsOption = echarts.ComposeOption<PieSeriesOption>;

const ringColors = [
  '#7FDAFF',
  '#FFB771',
  '#95F0D0',
  '#FFD971',
  '#DAA7FF',
  '#A9A7FF',
  '#8ABBFF',
  '#FFC62B',
  '#5A76F9',
  '#36C3FB',
  '#A272FF',
  '#36C3FB',
  '#50DFB2',
];
const PieEcharts: FC<any> = ({
  className,
  height,
  width,
  optionLabel = 'name',
  optionVal = 'data',
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
    const { data, positionY } = config;
    let totalVal = 0;
    if (config.isDynamicData) {
      const len = data.length;
      // legendItemHeight: legend每行高度
      ins.resize({ height: (len * (config.legendItemHeight || 22) + 100) }); // 计算容器高度
    }

    const seriesData = data.map((item) => {
      totalVal += +item[optionVal]; // 接口返回的有些是number,有些是string
      return {
        name: item[optionLabel],
        value: +item[optionVal]
      };
    });

    const legendData = data.map((item) => {
      return item[optionLabel];
    });

    const tooltip = {
      trigger: 'item',
      formatter: '{a} <br/>{b}： {c} ({d}%)',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      ...(config.tooltipConfig || {})
    };

    const legend = {
      type: 'scroll', // 图例过多时，可以滚动
      orient: config.orient || 'vertical',
      left: '55%',
      itemWidth: 4, // 图例宽度
      itemHeight: 10, // 图例高度
      icon: 'circle', // 图例样式
      top: config.legendTop,
      data: legendData,
      itemGap: 16, // 纵向间隔
      formatter: (name) => {
        let showText = '';
        seriesData.forEach((item) => {
          if (item.name === name) {
            showText = `${name}：${(item.value / totalVal * 100).toFixed(2)}%`;
          }
        });
        return showText;
      },
      textStyle: {
        color: '#5C6775',
        fontSize: 12,
        padding: [0, 10, 0, 0]
      },
      ...(config.legendConfig || {})
    };

    const series = [{
      name: '行业分布',
      type: 'pie',
      center: ['30%', positionY || '50%'], // 控制图表显示的位置
      avoidLabelOverlap: false,
      // hoverAnimation: false, // 关闭点击变大高亮效果
      emphasis: {
        scale: false
      },
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false
      },
      // zlevel: 1,
      // z: 1,
      data: seriesData,
      ...(config.seriesConfig || {})
    }];

    setOptions({
      color: ringColors,
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
      height={height}
      width={width}
      className={className}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default PieEcharts;
