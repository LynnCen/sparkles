/**
 * @Description 客流分布图表
 */
import { Empty } from 'antd';
import React, { useMemo } from 'react';
import { getKeysFromObjectArray } from '@lhb/func';
import { formatNumber } from '@/common/utils/ways';
import BoardCard from '@/common/components/BoardCard';

import styles from './index.module.less';
import MultiBarCharts from '@/common/components/EChart/MultiBarCharts';

const HourFlowChart: React.FC<any> = ({
  data = []
}) => {

  const xAxisData = useMemo(() => {
    return getKeysFromObjectArray(data, 'hour');
  }, [data]);

  const indoorFlowData = useMemo(() => {
    return getKeysFromObjectArray(data, 'indoorFlow');
  }, [data]);

  const outdoorFlowData = useMemo(() => {
    return getKeysFromObjectArray(data, 'outdoorFlow');
  }, [data]);

  const bagFlowData = useMemo(() => {
    return getKeysFromObjectArray(data, 'bagFlow');
  }, [data]);

  // 图表配置
  const barChartConfig = useMemo(() => {
    return {
      grid: { // https://www.echartsjs.com/zh/option.html#grid.id
        top: '18%',
        left: '3%',
        right: '3%',
        bottom: '6%',
        containLabel: true,
      },
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
          name: '过店客流',
          type: 'bar',
          barWidth: 10,
          data: outdoorFlowData,
          tooltip: { // tooltip样式修改
            valueFormatter: function (value) {
              return formatNumber(value);
            }
          },
        },
        {
          name: '进店客流',
          type: 'bar',
          barWidth: 10,
          data: indoorFlowData,
          tooltip: { // tooltip样式修改
            valueFormatter: function (value) {
              return formatNumber(value);
            }
          },
        },
        {
          name: '提袋客流',
          type: 'bar',
          barWidth: 10,
          data: bagFlowData,
          tooltip: { // tooltip样式修改
            valueFormatter: function (value) {
              return formatNumber(value);
            }
          },
        },
      ],
      otherOptions: {
        color: ['#FF8C00', '#0097BF', '#2FC25B'],
        legend: {
          icon: 'rect', // 图例样式
          left: 36,
          top: 10,
          itemWidth: 10, // 图例宽度
          itemHeight: 10, // 图例高度
        }
      }
    };
  }, [data]);

  return (
    <BoardCard title='客流分布' boardCardClassName={styles.hourFlowChartContainer}>
      {data.length ? <div className={styles.hourFlowChart}>
        <MultiBarCharts
          config={barChartConfig}
          optionVal='value'
          height={224}
        />
      </div> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </BoardCard>
  );
};


export default HourFlowChart;

