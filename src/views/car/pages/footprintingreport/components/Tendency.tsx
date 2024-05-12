import { FC, useState, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import EChart from '@/common/components/EChart';
import { color } from '@/common/enums/color';

echarts.use([LineChart, CanvasRenderer, GridComponent, LegendComponent]);
const Tendency: FC<any> = ({ data }) => {
  const [options, setOptions] = useState<any>(null);
  const [ins, setIns] = useState<any>(null);
  useEffect(() => {
    initOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    return () => {
      ins && ins.dispose();
    };
  }, [ins]);
  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const x: any = data?.length ? data[0]?.lineDatas.map((item: any) => item.name) : [];

  const series: any = [];
  if (data?.length) {
    for (let i = 0; i < data.length; i++) {
      const y = {
        name: data[i].checkDate,
        type: 'line',
        data: data[i].lineDatas && data[i].lineDatas.length ? data[i].lineDatas.map((item) => item.value) : [],
        stack: 'Total',
        lineStyle: {
          color: color[i],
        },
      };
      series.push(y);
    }
  }


  const initOptions = () => {
    const xAxis = [
      {
        type: 'category',
        data: x,
        axisLabel: {
          rotate: 45,
        },
      },
    ];
    const yAxis = [
      {
        type: 'value',
      },
    ];
    const grid = [
      {
        top: 30,
        left: 60,
      },
    ];
    const legend = { data: data?.length ? data.map((item) => item.checkDate) : [] };
    setOptions({
      xAxis,
      yAxis,
      series,
      grid,
      legend,
    });
  };
  return (
    <div>
      <EChart height='420px' option={options} loadedEchartsHandle={loadedHandle} />
    </div>
  );
};
export default Tendency;
