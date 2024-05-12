/**
 * @Description 进店分时趋势图-柱状图
 */
import BarCharts from '@/common/components/EChart/BarCharts';
import { formatNumber } from '@/common/utils/ways';
import { Empty } from 'antd';
import React, { useMemo } from 'react';


const BarChart: React.FC<any> = ({
  data = [],
  barType = 'indoorCount'
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      data: data?.find((item) => item.type === barType).data,
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '3%',
        left: '5%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
      },
      rotateVal: 35,
      xAxisConfig: {},
      yAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0',
        },
      },
      seriesConfig: {
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
      {data.length ? <BarCharts
        config={barChartConfig}
        optionVal='value'
        height={440}
        width={1000}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  );
};


export default BarChart;
