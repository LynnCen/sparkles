/**
 * @Description  年龄分布图表
 */
import SwitchRadio from '@/common/business/SwitchRadio';
import BoardCard from '@/common/components/BoardCard';
import DoughnutEcharts from '@/common/components/EChart/DoughnutEcharts';
import { useMethods } from '@lhb/hook';
import React, { useMemo, useState } from 'react';

import styles from './index.module.less';
import { Empty } from 'antd';



const options: any[] = [
  { label: '过店', value: 'analysisAgeFlow' },
  { label: '进店', value: 'analysisIndoorAgeFlow' },
];

const AgeFlowChart: React.FC<any> = ({
  rowData = {},
}) => {
  const [type, setType] = useState<'analysisAgeFlow' | 'analysisIndoorAgeFlow'>('analysisAgeFlow');

  const methods = useMethods({
    changeResourceType(e) {
      setType(e.target.value);
    },
  });

  const data = useMemo(() => {
    return rowData[type] || [];

  }, [rowData, type]);

  const showChart = useMemo(() => {
    // 进店都无数据时不展示
    return rowData.analysisAgeFlow && rowData.analysisAgeFlow.length || rowData.analysisIndoorAgeFlow && rowData.analysisIndoorAgeFlow.length;

  }, [rowData]);

  // 图表配置
  const doughnutChartConfig = useMemo(() => {
    const isExceedCriticalValue = data.length > 4;
    return {
      data: data,
      rotateVal: isExceedCriticalValue ? 15 : 0,
      orient: 'vertical',
      legendTop: 'middle',
      legendConfig: {
        align: 'left',
        right: '16%',
      },
      seriesConfig: {
        name: '年龄分布',
        showSymbol: data.length === 1,
        itemStyle: {
          borderWidth: 6,
          borderColor: '#fff',
        },
        radius: ['60%', '80%'], // 设置该参数来控制是否是圆环
      },
      tooltipConfig: {
        formatter: '{a} <br/>{b}： {d}%'
      },
      ringColors: [
        {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{
            offset: 1, color: '#FC6076' // 0% 处的颜色
          }, {
            offset: 0, color: '#FF9A44' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{
            offset: 1, color: '#FFA450' // 0% 处的颜色
          }, {
            offset: 0, color: '#D4380D' // 100% 处的颜色
          }],
          global: false, // 缺省为 false
          opacity: 0.15
        },
        {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{
            offset: 1, color: '#73D13D' // 0% 处的颜色
          }, {
            offset: 0.5, color: '#6ECC39' // 50% 处的颜色
          }, {
            offset: 0, color: '#389E0D' // 50% 处的颜色
          }],
          global: false, // 缺省为 false
        },
        {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#36CFC9' // 0% 处的颜色
          }, {
            offset: 1, color: '#08979C' // 50% 处的颜色
          }],
          global: false, // 缺省为 false
        },
        {
          type: 'linearGradient',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#B37FED' // 0% 处的颜色
          }, {
            offset: 1, color: '#722ED1' // 50% 处的颜色
          }],
          global: false, // 缺省为 false
        },
      ]
    };
  }, [data]);


  return (
    <>
      {showChart && <BoardCard title='年龄分布'
        boardCardClassName={styles.ageFlowChartContainer}
        rightSlot={
          <SwitchRadio
            type='primary'
            defaultValue={type}
            options={options}
            onChange={methods.changeResourceType}
            config={{
              size: 'small'
            }}
          />
        }>
        <div className={styles.ageFlowChart}>
          {data.length ? <DoughnutEcharts
            config={doughnutChartConfig}
            optionVal='value'
            height={208}
          /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </BoardCard>}
    </>
  );
};


export default AgeFlowChart;
