/**
 * @Description 折线图
 */
import { FC, useState, useEffect } from 'react';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import { colorRadio } from '../../../ts-config';

echarts.use([
  LineChart,
  CanvasRenderer,
  GridComponent
]);
// const contextType = {
//   [TimeSelect.MONTH]: '上个月',
//   [TimeSelect.QUARTER]: '上个季度',
//   [TimeSelect.YEAR]: '去年'
// };
const LineCharts: FC<any> = ({
  className,
  height,
  width,
  config = {},
  selectedInfo,
  valueName = '新增门店数',
  // curSelected
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
  }, [config?.data, ins]);

  const loadedHandle = (ins: any) => {
    ins && setIns(ins);
  };

  const initOptions = () => {
    const tooltip = {
      trigger: 'axis',
      backgroundColor: '#494949',
      textStyle: {
        color: '#FFFFFF'
      },
      formatter: function(params) {
        let str = '';
        params?.map((item, index) => {
          if (!(config?.data[item?.dataIndex]?.dataList[index]?.storeRatio)) return;
          str += `${selectedInfo[index]?.name}：${valueName}${item?.value}<br>`;

          // TODO-77: 1109 产品要求删除后半段话
          // ,环比${contextType[curSelected]}${config.data[item.dataIndex].dataList[index].storeRatio >= 0 ? '增加' : '减少'}
          // ${(Math.abs(config.data[item.dataIndex].dataList[index].storeRatio) * 100)?.toFixed(2)}%<br>

        });
        return `${params[0]?.axisValue}<br>${str}`;
      },
      ...(config.tooltipConfig || {}), // tooltip额外传入的配置
    };

    const xAxis = [{ // x轴配置
      type: 'category',
      data: config.xData,
      axisLabel: {
        color: '#A2A9B0',
        fontSize: 12,
        rotate: config.rotateVal,
        interval: 0,
        textStyle: { // 轴文字样式
          color: '#A2A9B0'
        }
      },
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      splitLine: { // 分割线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      ...(config.xAxisConfig || {}), // x轴额外传入的配置
    }];
    const yAxis = [{ // y轴配置
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#A2A9B0',
        },
      },
      axisLine: { // 轴线样式
        lineStyle: {
          type: 'dashed',
          color: '#EEE',
          width: '1'
        }
      },
      ...(config.yAxisConfig || {})// y轴额外传入的配置
    }];

    const series:any = [];
    config.yData.map((item, index) => {
      series.push({
        type: 'line',
        data: item,
        name: config.xData[index],
        lineStyle: { // 折线图颜色样式
          color: colorRadio[index]
        },
        itemStyle: {
          color: colorRadio[index]
        },
        // stack: 'Total',
        smooth: true, // 是否平滑
        showSymbol: false, // 是否默认展示圆点
        ...(config.seriesConfig || {}) // 图表series额外传入的配置,一般用来配置颜色
      });
    });

    setOptions({
      tooltip,
      xAxis,
      yAxis,
      series,
      grid: config.grid
    });

  };

  return (
    <ECharts
      options={options}
      height={height}
      width={width}
      className={className}
      otherOption={{
        notMerge: true
      }}
      loadedEchartsHandle={loadedHandle} />
  );
};

export default LineCharts;
