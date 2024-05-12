/** 漏斗图 */
import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { FunnelChart } from 'echarts/charts';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  FunnelChart,
  CanvasRenderer
]);

const funnelColors: string[] = [
  '#519AFF',
  '#519affe5',
  '#519affcc',
  '#519affb2',
  '#519aff99',
  '#519aff7f',
  '#519aff66',
  '#519aff4c',
  '#519aff33',
  '#519aff19',
];

const FunnelEcharts: FC<any> = ({
  className,
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
    const { data } = config;
    if (config.isDynamicData) {
      const len = data.length;
      // legendItemHeight: legend每行高度
      ins.resize({ height: (len * (config.legendItemHeight || 22) + 100) }); // 计算容器高度
    }

    const seriesData = data.map((item) => {
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
      // selectedMode: false, // 取消图例上的点击事件，控制是否可以通过点击图例改变系列的显示状态。
      orient: config.orient || 'horizontal', // 图标方向
      top: config.legendTop,
      left: config.legendLeft || 'center', // 图例组件离容器左侧的距离
      itemWidth: 25, // 图例标记的图形宽度。
      itemHeight: 14, // 图例标记的图形高度。
      data: legendData,
      itemGap: 8, // 纵向间隔
      textStyle: {
        color: '#5C6775',
        fontSize: 12,
        padding: [0, 10, 0, 0]
      },
      ...(config.legendConfig || {})
    };

    const series = [{
      name: '行业分布',
      type: 'funnel',
      left: '10%',
      top: '20%',
      width: '50%',
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 4,
      label: {
        show: true,
        position: 'right',
      },
      labelLine: {
        length: 40,
        lineStyle: {
          width: 1,
          type: 'dashed',
          color: '#EEEEEE'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: seriesData,
      ...(config.seriesConfig || {})
    }];

    setOptions({
      color: funnelColors,
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

export default FunnelEcharts;
