/**
 * @Description 柱状图
 */

import { FC, useState, useEffect } from 'react';
import { isArray, isNotEmpty } from '@lhb/func';
// import cs from 'classnames';
// import styles from './entry.module.less';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { targetValSort, echartsFormatUnit } from '@/common/utils/ways';
// import { echartsFormatUnit } from '@/common/utils/ways';
import * as echarts from 'echarts/core';
import Charts from '@/common/components/EChart';
import V2Empty from '@/common/components/Data/V2Empty';

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer
]);

const BarChartModule: FC<any> = ({
  data,
  loaded = false,
  isSort = true // 是否需要排序
}) => {
  const [chartOption, setChartOption] = useState<any>({});

  useEffect(() => {
    if (!(isArray(data) && data.length)) return;
    loadConfig();
  }, [data]);

  const loadConfig = () => {
    const targetData = isSort ? targetValSort(data, 'value') : data; // 排序
    const unit: any = echartsFormatUnit(targetData.map(item => item.value)); // 获取数据的单位
    const xData = targetData.map(item => {
      return item.name;
    });
    const yData = targetData.map(item => {
      return item.value / unit.value;
    });
    const option = {
      grid: {
        left: 10,
        top: 22,
        right: 10,
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        show: true,
        // formatter: `{b}: {c}${unit.name}` // 原先写法
        formatter: (value) => {
          const { name, value: val, dataIndex } = value;
          let str = `${name}：${val}${unit.name}`;
          if (isArray(targetData) && dataIndex < targetData.length) {
            const rate = targetData[dataIndex].rate;
            isNotEmpty(rate) && (str += `<br/>全国占比: ${rate}`);
          }
          return str;
        }
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: { // 文字样式
          color: '#999',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#eee',
            type: 'dashed'
          }
        },
        axisTick: { // 刻度线
          show: false,
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { // 文字样式
          color: '#999',
          fontSize: 12,
          formatter: (value) => {
            return `${value}${unit.name}`;
          }
        },
        splitLine: { // 竖线样式
          show: true,
          lineStyle: {
            color: '#eee',
            width: 1,
            type: 'dashed'
          }
        }
      },
      series: [{
        type: 'bar',
        data: yData,
        barWidth: '12px',
        itemStyle: {
          color: { // 渐变
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#358AFF' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(53,138,255,0.5)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }]
    };
    setChartOption(option);
  };
  return (
    <>
      {
        !loaded || (isArray(data) && data.length) ? <Charts
          height='220px'
          option={chartOption}
          isDestroy /> : <V2Empty centerInBlock/>
      }
    </>
  );
};

export default BarChartModule;
