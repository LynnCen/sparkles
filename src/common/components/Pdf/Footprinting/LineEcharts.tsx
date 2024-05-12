import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import 'echarts/lib/component/title';
import ECharts from '@/common/components/EChart';

echarts.use([
  LineChart,
  CanvasRenderer,
  GridComponent
]);

const LineEcharts: FC<any> = ({
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

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const animation = false;
    const xAxis = {
      type: 'category',
      data: config.xData,
      axisLabel: {
        rotate: 45,
        color: '#fff'
      },
      offset: 10

    };
    const yAxis = { // y轴配置
      type: 'value'
    };
    const series = [{
      data: config.data,
      type: 'line',
      lineStyle: {
        width: 4
      },
      label: {
        show: true,
        color: '#fff',
        fontSize: '14',
        fontStyle: 'oblique',
        fontWeight: 'bold'
      }
    }];

    const title = {
      left: 'center',
      text: '客流分时趋势图',
      textStyle: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.8)',

      },
    };

    setOptions({
      xAxis,
      yAxis,
      series,
      title,
      animation,
    });
  };

  return (
    <ECharts
      option={options}
      loadedEchartsHandle={loadedHandle}
      {...props}/>
  );
};

export default LineEcharts;
