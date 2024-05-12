/**
 * @Description
 */

import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
import Histogram from './Histogram';
import { isNotEmptyAny } from '@lhb/func';
import { DataType, barChartColor } from '../../../ts-config';
import { Table } from 'antd';
//  横轴展示
const CityTypeHis: FC<any> = ({ data, type, selectedBrand = [] }) => {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    selectedBrand.length && setWidth(100 / selectedBrand.length);
  }, [selectedBrand]);

  // 处理成chart需要的yData数据
  const handleData = (data, idx) => {
    const arr = data[idx]?.dataList?.map((val) => val.value);
    return arr;
  };
  // 处理成chart需要的xData数据
  const getChartTitle = (data, idx) => {
    const arr: any = [];
    data[idx]?.dataList?.map((item) => {
      arr.push(item.title);
    });
    return arr;
  };

  const formatterText = (e, index) => {
    let str = `
    <span style="
      display: inline-block;
      height: 10px;
      margin-right:5px;
      width: 10px;
      background-color: ${barChartColor[index][0]};"></span>
      ${data[index].name} <br/>`;

    data[index]?.dataList
      // ?.slice().sort((a, b) => b.value - a.value)
      ?.map((item) => {
        if (e[0]?.axisValueLabel === item.title) {
          // console.log('item.title ', e[0]?.axisValueLabel, item.title);
        }
        str += ` <span style="
          color: ${e[0]?.axisValueLabel === item.title ? barChartColor[index][0] : '#fff'};
          "
          >${item.title}：${item.value} ${item.rate ? `| ${item.rate}` : ''}</span><br/>`;
      });
    return str;
  };

  // 在这里编写组件的逻辑和渲染
  return (
    <div className={styles.cityTypeHis}>
      {/*  省市门店数量对比 */}
      {type === DataType.CHART ? (
        isNotEmptyAny(selectedBrand) ? (
          selectedBrand.map((itm, idx) => (
            <div className={styles.singleChart} key={selectedBrand[idx]} style={{ width: `${width}%` }}>
              <div className={styles.chartName}>{data[idx]?.shortName || data[idx]?.name}</div>
              <Histogram
                width={width}
                className={styles.echarts}
                xData={getChartTitle(data, idx)}
                yData={[handleData(data, idx)]}
                direction='horizontal'
                // formatterText={() => formatterText(idx)}
                data={data}
                chartColor={barChartColor[idx]}
                config={{
                  yAxisConfig: {
                    show: false,
                  },
                  xAxisConfig: {
                    inverse: true,
                    axisLabel: {
                      color: '#666',
                      fontSize: 12,
                      interval: 0,
                      show: idx === 0, // 将这里设置为 false，即可隐藏横坐标文字
                    },
                    axisTick: {
                      show: false, // 隐藏横坐标刻度
                    },
                  },
                  seriesConfig: {
                    label: {
                      show: true, // 显示标签
                      position: 'right',
                      valueAnimation: true, // 开启值动画
                      textStyle: {
                        // 数值样式
                        color: '#666',
                        fontSize: 12,
                      },
                    },
                  },
                  otherOptions: {
                    formatter: (e) => formatterText(e, idx)
                  }
                }}
              />
            </div>
          ))
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {type === DataType.TABLE ? (
        isNotEmptyAny(selectedBrand) ? (
          <div className={styles.cityTypeBox}>
            {selectedBrand.map((_, idx) => (
              <div className={styles.tableBox} style={{ width: `${width}%` }}>
                <div className={styles.storeNumTitle}>{data[idx]?.shortName || data[idx]?.name}</div>
                <Table
                  sticky={true}
                  pagination={false}
                  columns={[
                    {
                      title: '城市类型',
                      dataIndex: 'title',
                      key: 'title',
                    },
                    {
                      title: '数量',
                      dataIndex: 'value',
                      key: 'value',
                    },
                    {
                      title: '占比',
                      dataIndex: 'rate',
                      key: 'rate',
                    },
                  ]}
                  dataSource={data[idx]?.dataList}
                  className={styles.cityTypeTable}
                  rowKey='name'
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default CityTypeHis;
