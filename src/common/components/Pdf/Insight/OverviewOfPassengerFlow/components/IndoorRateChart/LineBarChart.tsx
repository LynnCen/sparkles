/**
 * @Description 进店分时趋势图-柱状+折现图
 */
import LineBarCharts from '@/common/components/EChart/LineBarCharts';
import { formatNumber } from '@/common/utils/ways';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const LineBarChart: React.FC<any> = ({
  data = [],
  barType = 'indoorCount'
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      lineData: data?.find((item) => item.type === 'indoorRate'),
      barData: data?.find((item) => item.type === barType),
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '5%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
      },
      rotateVal: 35,
      xAxisConfig: {},
      barYAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0',
        },
      },
      lineSeriesConfig: {
        itemStyle: {
          color: '#F2993D'
        }
      },
      barSeriesConfig: {
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
      {data.length ? <LineBarCharts
        config={barChartConfig}
        optionVal='value'
        height={440}
        width={1000}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  );
};


export default LineBarChart;
