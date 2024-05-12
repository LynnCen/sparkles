/**
 * @Description 性别分布图表
 */
import SwitchRadio from '@/common/business/SwitchRadio';
import BoardCard from '@/common/components/BoardCard';
import DoughnutEcharts from '@/common/components/EChart/DoughnutEcharts';
import { useMethods } from '@lhb/hook';
import React, { useMemo, useState } from 'react';

import styles from './index.module.less';
import { Empty } from 'antd';



const options: any[] = [
  { label: '过店', value: 'analysisSexFlow' },
  { label: '进店', value: 'analysisIndoorSexFlow' },
];

const GenderChart: React.FC<any> = ({
  rowData = {},
}) => {
  const [type, setType] = useState<'analysisSexFlow' | 'analysisIndoorSexFlow'>('analysisSexFlow');

  const data = useMemo(() => {
    return rowData[type] || [];

  }, [rowData, type]);

  const showChart = useMemo(() => {
    // 进店都无数据时不展示
    return rowData.analysisSexFlow && rowData.analysisSexFlow.length || rowData.analysisIndoorSexFlow && rowData.analysisIndoorSexFlow.length;

  }, [rowData]);


  const methods = useMethods({
    changeResourceType(e) {
      setType(e.target.value);
    },
  });



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
        name: '性别分布',
        showSymbol: data.length === 1,
        // tooltip: { // tooltip样式修改
        //   valueFormatter: function (value) {
        //     return floorKeep(value, 100, 3, 1) + '%';
        //   }
        // },

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
      ]
    };
  }, [data]);


  return (
    <>
      {showChart && <BoardCard title='性别分布'
        boardCardClassName={styles.genderChartContainer}
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
        <div className={styles.genderChart}>
          { data.length ? <DoughnutEcharts
            config={doughnutChartConfig}
            optionVal='value'
            height={208}
          /> : <Empty style={{ marginTop: 80 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </BoardCard> }
    </>
  );
};


export default GenderChart;
