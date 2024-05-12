import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { color } from './ts-config';

echarts.use([
  PieChart,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent
]);
const PieEcharts: FC<any> = ({
  className,
  height,
  width,
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
    if (config.data?.length && ins) {
      initOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.data, ins]);

  const initOptions = () => {

    const tooltip = {
      trigger: 'item'
    };
    const series = [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['90%'],
        itemStyle: {
          borderWidth: 4, // 扇形图形的描边宽度
          borderColor: '#fff', // 扇形图形的描边颜
        },
        data: config?.data,
      }
    ];
    const grid = {
      left: 1,
      right: 1,
      top: 1,
      bottom: 1
    };

    setOptions({
      // animation: false,
      // 设置扇形的颜色,
      color: color,
      tooltip,
      series,
      grid
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
