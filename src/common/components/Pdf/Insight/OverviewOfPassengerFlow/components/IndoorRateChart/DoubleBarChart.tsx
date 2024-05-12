/**
 * @Description 进店分时趋势图-双柱状图
 */
import MultiBarCharts from '@/common/components/EChart/MultiBarCharts';
import { formatNumber } from '@/common/utils/ways';
import { getKeysFromObjectArray } from '@lhb/func';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const DoubleBarChart: React.FC<any> = ({
  data = [],
}) => {

  const xAxisData = useMemo(() => {
    return getKeysFromObjectArray(data?.find((item) => item.type === 'passbyCount').data, 'name');
  }, [data]);


  const indoorCountData = useMemo(() => {
    return data?.find((item) => item.type === 'indoorCount').data;
  }, [data]);

  const passbyCountData = useMemo(() => {
    return data?.find((item) => item.type === 'passbyCount').data;
  }, [data]);


  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '5%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
      },
      rotateVal: 35,
      xAxisData: xAxisData,
      yAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0'
        },
      },
      seriesConfig: [
        {
          name: '过店总数',
          type: 'bar',
          barWidth: 10,
          data: passbyCountData,
          tooltip: { // tooltip样式修改
            valueFormatter: function (value) {
              return formatNumber(value);
            }
          },
          itemStyle: {
            color: {
              type: 'linearGradient',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(53, 138, 255, 1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(53, 138, 255, 0.50)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
        },
        {
          name: '进店总数',
          type: 'bar',
          barWidth: 10,
          data: indoorCountData,
          tooltip: { // tooltip样式修改
            valueFormatter: function (value) {
              return formatNumber(value);
            }
          },
          itemStyle: {
            color: {
              type: 'linearGradient',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(57, 211, 249, 1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(57, 211, 249, 0.50)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
        },
      ],
      otherOptions: {
        legend: {
          show: true,
          icon: 'roundRect', // 设置为默认的圆形图标
          itemWidth: 8, // 图例宽度
          itemHeight: 8, // 图例高度
          textStyle: {
            color: '#FFF',
          },
          y: 'bottom',
        }
      }
    };
  }, [data]);

  return (
    <div style={{ marginTop: 60 }}>
      {data.length ? <MultiBarCharts
        config={barChartConfig}
        optionVal='value'
        height={440}
        width={1000}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  );
};


export default DoubleBarChart;
