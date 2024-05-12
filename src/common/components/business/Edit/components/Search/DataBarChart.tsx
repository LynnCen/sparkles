import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import { CanvasRenderer } from 'echarts/renderers';
import {
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import ECharts from '@/common/components/business/ECharts';
import SupplementText from './SupplementText';
import { useMethods } from '@lhb/hook';
import { floorKeep, isArray } from '@lhb/func';
import { getStoreChart } from '@/common/api/networkplan';
import { Form, Slider } from 'antd';
echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
  TitleComponent
]);
const DataBarChart: FC<any> = ({
  min,
  max,
  cutBin,
  enName,
  detail,
  form,
  name,
  isOpen,
  explainText // 指标说明
}) => {
  const value:any = Form.useWatch(name[0][0], form);

  const [marksValue, setMarksValue] = useState<any>([0, 0]);
  const [options, setOptions] = useState<any>(null);
  const [marks, setMarks] = useState<any>({ 0: min });
  const [ins, setIns] = useState<any>(null);
  const methods = useMethods({
    loadedHandle(ins: any) {
      ins && setIns(ins);
    },
    initOptions(dataList) {
      const source = [
        ['product', '成功门店', '失败门店']
      ];
      dataList.forEach((item: any) => {
        source.push([item.name, item.value1, item.value2]);
      });
      setOptions({
        legend: { // 顶部成功、失败 标签
          // right: '5%',
          selectedMode: false // 关掉点击显示隐藏成功或失败柱形合集
        },
        grid: {
          bottom: 30
        },
        tooltip: { // 提示框
          trigger: 'axis',
          backgroundColor: '#222',
          borderColor: '#222',
          formatter: (params) => {
            const total = floorKeep(params[0].value[1], params[0].value[2], 2);
            return `
              <div class='data-car-chart-c1c4ba3a'>
                <div class='data-car-chart-c1c4ba3a-item'>
                  <div class='data-car-chart-c1c4ba3a-item-left'>
                    <div class='data-car-chart-c1c4ba3a-left-wrapper'>
                      <div class='data-car-chart-c1c4ba3a-left-icon'></div>
                      <div>${params[0].seriesName}</div>
                    </div>
                  </div>
                  <div class='data-car-chart-c1c4ba3a-item-right'>
                    ${params[0].value[1]}/${total}
                  </div>
                </div>
                <div class='data-car-chart-c1c4ba3a-item data-car-chart-c1c4ba3a-item-2'>
                  <div class='data-car-chart-c1c4ba3a-item-left'>
                    <div class='data-car-chart-c1c4ba3a-left-wrapper'>
                      <div class='data-car-chart-c1c4ba3a-left-icon data-car-chart-c1c4ba3a-left-icon-2'></div>
                      <div>${params[1].seriesName}</div>
                    </div>
                  </div>
                  <div class='data-car-chart-c1c4ba3a-item-right'>
                    ${params[0].value[2]}/${total}
                  </div>
                </div>
              </div>
            `;
          }
        },
        // title: {
        //   text: '奶茶氛围数'
        // },
        dataset: {
          source
        },
        xAxis: { type: 'category' },
        yAxis: {
          // axisLabel: {
          //   formatter: '{value}%'
          // }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#358AFF' },
                { offset: 1, color: 'rgba(53,138,255,0.5)' }
              ])
            }
          },
          {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F2993D' },
                { offset: 1, color: 'rgba(242,153,61,0.5)' }
              ])
            }
          }
        ]
      });
    },
    handleChange(value) {
      const res = value.map((item) => marks[item]);
      form.setFieldsValue({ [name[0][0]]: res });
    }
  });

  useEffect(() => {
    setTimeout(() => {
      isOpen && ins && ins.resize(); // Popover隐藏后页面宽高变化时，再显示Popover时图表异常
    }, 0);
  }, [isOpen, ins]);

  useEffect(() => {
    if (!(isArray(value) && value.length)) return;
    const _value :any = [];
    let flag = 0;
    // eslint-disable-next-line guard-for-in
    for (const i in marks) {
      if (marks[i] === value[0]) {
        _value.push(i);
        flag += 1;
      }
      if (marks[i] === value[1]) {
        _value.push(i);
        flag += 1;
      }
    }
    // 确保value两个值都存在 才进行 setMarksValue_value，否则设为[0,0]
    setMarksValue(flag === 2 ? _value : [0, 0]);
  }, [value]);

  useEffect(() => {
    if (ins) {
      getStoreChart({
        cutBin,
        enName,
        branchCompanyId: detail.branchCompanyId,
        // cityIds: detail.cities?.map(item => item.id)
        cityIds: detail.cities?.map(item => {
          // 兼容历史数据
          if (isArray(item)) {
            const len = item.length;
            if (len === 3) return item[2].id; // 1026改为筛选项为省市区了
            return item[1].id; // 兼容历史数据（省市）
          }
          return null;
        }),
      }).then((res) => {
        methods.initOptions(res.lineDataList || []);
        let arrRes:any = marks;
        res?.lineDataList?.forEach((item, index) => {
          if (index === res?.lineDataList?.length - 1) return;
          const value = item.name.split('~')[1] || item.name.split('<')[1] || item.name.split('>')[1];
          arrRes = {
            ...arrRes,
            [index + 1]: +value
          };
        });
        arrRes = {
          ...arrRes,
          [res?.lineDataList.length]: max
        };
        setMarks(arrRes);
      });
    }
  }, [ins]);

  return (
    <>
      {/* // 宽度太小放不下？？ */}
      <div style={{ width: 500, height: 326 }}>
        {/* <div style={{ width: 376, height: 326 }}> */}
        <ECharts
          options={options}
          className={styles.dataBarChart}
          loadedEchartsHandle={methods.loadedHandle} />
      </div>
      <div className={styles.sliderBox}>
        {marks && value?.length ? <Slider
          min={Math.min(...Object.keys(marks).map((item) => +item))}
          max={Math.max(...Object?.keys(marks).map((item) => +item))}
          range
          marks={marks}
          included
          step={null}
          dots
          defaultValue={value}
          value={marksValue}
          tooltip={{
            open: false
          }}
          onChange={methods.handleChange}
        /> : <></>}
      </div>
      {
        explainText ? <SupplementText text={explainText}/> : <></>
      }
    </>
  );
};

export default DataBarChart;
