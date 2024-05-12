import React, { useEffect, useState } from 'react';
import DataBox from './DataBox';
import { Row, Col } from 'antd';
import Empty from '@/common/components/Empty';
import { AgeBarChart, GenderBarChart } from '../components/BarChart';
import { ContrastChartsProps } from '../ts-config';
import styles from './index.module.less';
import Trent from './Charts/Trent';
import { isArray } from '@lhb/func';

const yUnitConfig: any = {
  nameLocation: 'start',
  // name: `人数`,
  nameTextStyle: { align: 'center', verticalAlign: 'center', fontSize: 10, color: `#666666`, padding: [0, 40, 0, 0] },
};

const ContrastCharts: React.FC<ContrastChartsProps> = ({ params, result }) => {
  const [legendData, setLegendData] = useState<{
    trentData: string[]; // 趋势图需要的legend
    barData: string[]; // 柱状图需要的legend
    storeInfos: any[]; // 合并了id start end的数组
  }>({ trentData: [], barData: [], storeInfos: [] });

  useEffect(() => {
    if (params.stores) {
      const { stores, dateScope } = params;
      const trentData: string[] = [];
      const barData: string[] = [];
      const storeInfos: any[] = [];
      // 组合tooltips显示的门店
      stores.map((store: any) => {
        const storeName: string =
          dateScope === 1 ? `${store.name}—${store.start}` : `${store.name}—${store.start}-${store.end}`;

        barData.push(storeName);
        const otherStoreName: string = params.moreStores ? `${store.name}` : storeName;
        trentData.push(otherStoreName);
        storeInfos.push({ id: store.id, start: store.start, end: store.end });
      });
      setLegendData({ trentData, barData, storeInfos });
    }
  }, [params, result]);

  /**
   * @description 是否展示图表
   * @param data
   * @return 是否展示true/false
   */
  const showChartData = (data: any) => {
    const res = data.some(itm => isArray(itm.chartData) && itm.chartData.length);
    console.log('showChartData', data, res);
    return res;
  };

  return (
    <div className={styles.chartContainer}>
      {showChartData(result?.passbyFlow) ? <DataBox title='过店客流'>
        <Trent
          tooltipFormatterUnit='人'
          yAxisConfig={yUnitConfig}
          legendData={legendData.trentData}
          data={result?.passbyFlow || []}
          storeInfos={legendData.storeInfos}
        />
      </DataBox> : <></>}

      {showChartData(result?.indoorFlow) ? <DataBox title='进店客流' className='mt-24'>
        <Trent
          tooltipFormatterUnit='人'
          yAxisConfig={yUnitConfig}
          legendData={legendData.trentData}
          data={result?.indoorFlow || []}
          storeInfos={legendData.storeInfos}
        />
      </DataBox> : <></>}

      {showChartData(result?.customerFlow) ? <DataBox title='进店顾客数' className='mt-24'>
        <Trent
          tooltipFormatterUnit='人'
          yAxisConfig={yUnitConfig}
          legendData={legendData.trentData}
          data={result?.customerFlow || []}
          storeInfos={legendData.storeInfos}
        />
      </DataBox> : <></>}

      {showChartData(result?.customerBatchFlow) ? <DataBox title='进店客户组数' className='mt-24'>
        <Trent
          tooltipFormatterUnit='组'
          yAxisConfig={yUnitConfig}
          legendData={legendData.trentData}
          data={result?.customerBatchFlow || []}
          storeInfos={legendData.storeInfos}
        />
      </DataBox> : <></>}

      {showChartData(result?.indoorRate) ? <DataBox title='进店率' className='mt-24'>
        <Trent
          tooltipFormatterUnit='%'
          yAxisConfig={{
            axisLabel: {
              color: `#666666`,
              formatter: '{value} %',
            },
          }}
          legendData={legendData.trentData}
          data={result?.indoorRate || []}
          storeInfos={legendData.storeInfos}
        />
      </DataBox> : <></>}

      {/* 停留时长为小时不显示停留时长 */}
      {params?.dateScope !== 1 && (
        <DataBox title='平均停留时长' className='mt-24'>
          <Trent
            tooltipFormatterUnit='s'
            yAxisConfig={{
              axisLabel: {
                // y轴文字样式
                color: `#666666`,
                formatter: '{value} %',
              },
            }}
            legendData={legendData.trentData}
            data={result?.durationAvg || []}
            storeInfos={legendData.storeInfos}
          />
        </DataBox>
      )}

      <Row gutter={24}>
        <Col span={12}>
          <DataBox title='性别分布' tip='每个门店的客流性别的平均分布' className='mt-24'>
            {(result?.genderRate || []).length ? (
              <GenderBarChart
                dataList={result.genderRate}
                legendData={legendData.barData}
                storeInfos={legendData.storeInfos}
              />
            ) : (
              <div style={{ height: '400px', padding: '80px 0' }}>
                <Empty />
              </div>
            )}
          </DataBox>
        </Col>
        <Col span={12}>
          <DataBox title='年龄分布' tip='每个门店的客流年龄的平均分布' className='mt-24'>
            {(result?.ageRate || []).length ? (
              <AgeBarChart
                dataList={result.ageRate}
                legendData={legendData.barData}
                storeInfos={legendData.storeInfos}
              />
            ) : (
              <div style={{ height: '400px', padding: '80px 0' }}>
                <Empty />
              </div>
            )}
          </DataBox>
        </Col>
      </Row>
    </div>
  );
};

export default ContrastCharts;
