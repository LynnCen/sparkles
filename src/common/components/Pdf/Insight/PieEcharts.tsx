import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/EChart';

echarts.use([
  PieChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent
]);
// type EChartsOption = echarts.ComposeOption<PieSeriesOption>;

const ringColors = [
  '#f66063',
  '#5ccc93',
  '#7546ff',
  '#fedc3a',
  '#009199',
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
const PieEcharts: FC<any> = ({
  optionLabel = 'name',
  optionVal = 'data',
  config,
  ...props
}) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);

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
      ...(config.tooltipConfig || {})
    };

    const legend = {
      orient: config.orient || 'vertical', // 垂直排布
      left: config.legendLeft || 'auto',
      itemWidth: 12,
      itemHeight: 12,
      top: config.legendTop,
      data: legendData,
      itemGap: 8, // 纵向间隔
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
        color: '#D9D9D9',
        fontSize: 14,
        padding: [0, 10, 0, 0]
      },
      ...(config.legendConfig || {})
    };

    const series = [{
      name: '行业分布',
      type: 'pie',
      // radius: [65, 50], // 设置该参数来控制是否是圆环
      center: ['75%', positionY || '45%'], // 控制图表显示的位置
      avoidLabelOverlap: false,
      hoverAnimation: false, // 关闭点击变大高亮效果
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
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
      option={options}
      loadedEchartsHandle={loadedHandle}
      {...props}/>
  );
};

export default PieEcharts;
