/**
 * @Description 2016-2022人口变化一览图表
 */
import React, { useMemo } from 'react';
import { Empty } from 'antd';

import LineBarCharts from '@/common/components/EChart/LineBarCharts';
import { formatNumber } from '@/common/utils/ways';


const DemographicChangesCharts: React.FC<any> = ({
  data = [],
  height = '100%',
  width = '100%',
  title = ''
}) => {

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      lineData: data?.find((item) => item.name === '同比增长'),
      barData: data?.find((item) => item.name === '常住人口'),
      lineYAxisConfig: {
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE',
            width: '1',
            opacity: 0.2
          }
        },
      },
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '16%',
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true,
      },
      barYAxisConfig: {
        axisLabel: {
          formatter: (val) => {
            return formatNumber(val);
          },
          color: '#A2A9B0'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE',
            width: '1',
            opacity: 0.2
          }
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
              offset: 0, color: 'rgba(57, 211, 249, 1)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(57, 211, 249, 0.50)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
      },
      otherOptions: {
        title: {
          text: `2016-2022${title}人口变化一览`,
          textStyle: {
            // 主标题文本样式
            fontFamily: 'PingFangSC-Medium, PingFang SC',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '500',
            color: '#FFF',
          }
        },
        legend: {
          show: true,
          icon: 'circle', // 设置为默认的圆形图标
          itemWidth: 8, // 图例宽度
          itemHeight: 10, // 图例高度
          x: 'right',
          top: 2,
          textStyle: {
            color: '#FFF',
          }
        }
      }
    };
  }, [data]);

  return (
    <>
      {data.length ? <LineBarCharts
        config={barChartConfig}
        optionVal='value'
        height={height}
        width={width}
      /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </>
  );
};


export default DemographicChangesCharts;
