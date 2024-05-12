import { FC, useEffect, useState } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { deepCopy } from '@lhb/func';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { echartsFormatUnit } from '@/common/utils/ways';

echarts.use([
  BarChart,
  CanvasRenderer,
  GridComponent
]);

const RotaryBarEcharts: FC<any> = ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const { data: originData, isPercent } = config;
    const data = deepCopy(originData);
    if (isPercent) {
      data.forEach((item) => {
        item[optionVal] = (+item[optionVal] * 100).toFixed(2);
      });
    }
    const unit = echartsFormatUnit(data.map(item => item.data)); // 获取数据的单位
    const yData = data.map(item => {
      return item[optionLabel];
    });
    const xData = data.map(item => {
      return (item[optionVal] / unit.value);
    });

    const barMax = Math.max.apply(Math, xData);// 最大值
    const grid = { // 图表整体间距、大小配置项 https://www.echartsjs.com/zh/option.html#grid.left
      left: 0,
      top: 0,
      right: 20,
      bottom: 10,
      containLabel: true
    };
    const xAxis = { // x轴配置 https://www.echartsjs.com/zh/option.html#xAxis.axisLine
      max: barMax.toFixed(),
      axisLabel: { // x轴文字样式
        color: '#C4C7D0',
        fontSize: 12,
        formatter: `{value} ${isPercent ? '%' : ''}`
      },
      splitLine: { // 竖线样式
        show: true,
        lineStyle: {
          color: 'rgba(166,166,166, 0.15)',
          width: 1,
          type: 'solid'
        }
      },
      // axisTick: {
      //   interval: 1
      // }
    };
    const yAxis = { // y轴配置
      type: 'category',
      data: yData,
      inverse: true, // 接口返回的是降序时
      axisLine: {
        lineStyle: {
          color: 'rgba(166,166,166, 0.15)',
          type: 'solid'
        }
      },
      axisLabel: { // 文字样式
        color: '#D9D9D9',
        fontSize: 12
      },
      axisTick: { // y轴 刻度线
        show: false,
      }
    };
    const series = [{
      type: 'bar',
      data: xData,
      // zlevel: 1,
      // z: 9,
      itemStyle: { // 柱子颜色
        color: '#5B8FF9',
        // normal: {
        //   show: true,
        //   borderRadius: [0, 30, 30, 0]
        // }
        borderRadius: [0, 30, 30, 0]
      },
      barWidth: '10px',
      label: { // 设置柱子上文字显示 https://www.echartsjs.com/zh/option.html#series-bar.label
        show: true,
        position: 'insideLeft',
        color: '#fff',
        fontSize: 11,
        padding: [3, 0, 0, 0],
        formatter: `{c}${isPercent ? '%' : ''}`,
      }
    }];

    setOptions({
      grid,
      xAxis,
      yAxis,
      series
    });
  };

  return (
    <ECharts
      options={options}
      className={className}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default RotaryBarEcharts;
