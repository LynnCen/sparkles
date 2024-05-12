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
  '#546FC6',
  '#91CD75',
  '#EF6667',
  '#FAC858',
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
const RoundedCornerPie: FC<any> = ({
  optionLabel = 'name',
  optionVal = 'count',
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

  // const textStr = (text: string, count: number) => {
  //   return `${text.substring(0, count)}${text?.length > count ? '...' : ''}`;
  // };

  // const valueVal = (val: number) => {
  //   if (val >= 10000) {
  //     return `${((val / 10000)).toString().match(/^\d+(?:\.\d{0,1})?/)}w`;
  //   }
  //   return val;
  // };

  const initOptions = () => {
    const { data } = config;
    // let totalVal = 0;
    if (config.isDynamicData) {
      const len = data.length;
      // legendItemHeight: legend每行高度
      ins.resize({ height: (len * (config.legendItemHeight || 10) + 100) }); // 计算容器高度
    }

    const seriesData = data.map((item) => {
      // totalVal += item[optionVal];
      return {
        name: item[optionLabel],
        value: item[optionVal]
      };
    });

    const legendData = data.map((item) => {
      return item[optionLabel];
    });

    // const tooltip = {
    //   trigger: 'item',
    //   formatter: '{a} <br/>{b}： {c} ({d}%)',
    //   ...(config.tooltipConfig || {})
    // };

    const legend = {
      orient: config.orient || 'vertical',
      right: 'right',
      itemWidth: 8,
      itemHeight: 8,
      top: 'middle',
      data: legendData,
      itemGap: 8, // 纵向间隔
      formatter: (name) => {
        let showText = '';
        seriesData.forEach((item: any) => {
          if (item.name === name) {
            // showText = `${textStr(name, config.legendTextMaxCount || 4)} ${(valueVal(item.value))}个`;
            showText = `${name} ${(item.value)}个`;
          }
        });
        return showText;
      },
      textStyle: {
        color: '#656E85',
        fontSize: 12,
        // padding: [0, 0, 0, 0]
      },
      ...(config.legendConfig || {})
    };

    const series = [{
      // name: '',
      type: 'pie',
      radius: [20, 40],
      center: ['23%', '50%'], // 控制图表显示的位置
      // roseType: 'area',
      avoidLabelOverlap: false,
      hoverAnimation: false, // 关闭点击变大高亮效果
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false
      },
      data: seriesData,
      ...(config.seriesConfig || {})
    }];

    setOptions({
      color: ringColors,
      // tooltip,
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

export default RoundedCornerPie;
