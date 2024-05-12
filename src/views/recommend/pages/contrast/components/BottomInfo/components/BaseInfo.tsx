/**
 * @Description 省市门店数量对比
 */
import { FC, useMemo } from 'react';
import { DataType, barChartColor } from '../../../ts-config';
import styles from '../index.module.less';
import cs from 'classnames';
import BarCharts from '@/common/components/business/ECharts/components/BarCharts';
import { Table } from 'antd';
import { isArray } from '@lhb/func';

// x轴标题最大可显示字数。剩余部分用省略号
const XAxisTitleLength = 8;

const BaseInfo:FC<any> = ({
  type,
  data
}) => {
  /**
   * @description 将每两项数据作为数组的一项
   */
  const dataGroups = useMemo(() => {
    if (!isArray(data) || !data.length) return [];

    const groups: any = [];
    let items: any = [];
    const rowItemCount = 2;
    data.forEach((itm: any, index: number) => {
      if (index % rowItemCount === 0) {
        items = [itm];
      } else {
        items.push(itm);
      }
      // 已满一行或者是全部数据的最后一个
      if (index % rowItemCount === rowItemCount - 1 || index === data.length - 1) {
        groups.push(items);
      }
    });
    return groups;
  }, [data]);

  const BarChart = (params) => {
    let data = [];
    const { dataList } = params;
    if (isArray(data) && dataList.length) {
      data = dataList.map((item) => {
        const extractedString = item.shortName || item.name; // 获取 shortName 或者 name
        const result = extractedString.length > XAxisTitleLength ? extractedString.substring(0, XAxisTitleLength) + '...' : extractedString;
        return { ...item, name: result };
      });
    }
    return (<BarCharts
      config={{
        data,
        grid: {
          left: 50,
          right: 30,
          top: 18,
          bottom: 40,
        },
        // 柱状图渐变颜色
        seriesConfig: {
          itemStyle: {
            normal: {
              color: function(params) {
                const index = params.dataIndex;
                return {
                  type: 'linear',
                  y: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: barChartColor[index][0]
                  }, {
                    offset: 1, color: barChartColor[index][0]
                  }],
                };
              }
            }
          },
        },
        // x轴换行显示
        xAxisConfig: {
          // 原本样式
          axisLabel: {
            color: '#A2A9B0',
            fontSize: 12,
            interval: 0,
            textStyle: { // 轴文字样式
              color: '#666'
            },
            // 换行显示
            formatter: function (params) {
              let newParamsName = ''; // 拼接后的新字符串
              const paramsNameNumber = params.length; // 实际标签数
              const provideNumber = XAxisTitleLength + 3; // 每行显示的字数，+3显示省略号
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 如需换回，算出要显示的行数

              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */

                for (let i = 0; i < rowNumber; i++) {
                  let tempStr = ''; // 每次截取的字符串
                  const start = i * provideNumber; // 截取位置开始
                  const end = start + provideNumber; // 截取位置结束

                  // 最后一行的需要单独处理

                  if (i === rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }

              return newParamsName;
            }
          }
        },
        yAxisConfig: {
          axisLabel: {
            textStyle: { // 轴文字样式
              color: '#666'
            },
          }
        }
      }}
      optionVal='value'
      className={styles.storeNumCharts}
    />);
  };

  return <div>
    {/*  省市门店数量对比 */}
    {type === DataType.CHART && isArray(dataGroups) ? dataGroups.map((grp, grpIndex) => <div key={grpIndex} className={cs(styles.storeNumBox, grpIndex && 'mt-30')}>
      {grp.map((item, idx) => <div key={idx} className={styles.storeNumItem}>
        <div className={styles.storeNumTitle}>{item.title}</div>
        <BarChart dataList={item.dataList}/>
      </div>) }
    </div>) : <></>}

    { type === DataType.TABLE ? <div className={styles.storeNumBox}>
      {data.map((item) => <div className={styles.tableBox}>
        <div className={styles.storeNumTitle}>{item.title}</div>
        <Table
          sticky={true}
          pagination={false}
          columns={[{
            title: '品牌名称',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => value ? record.shortName || value : value
          },
          {
            title: item.title,
            dataIndex: 'value',
            key: 'value',
          }]}
          dataSource={item.dataList}
          className={styles.storeNumTable}
          rowKey='name'
        />
      </div>
      )}
    </div> : <></>}
  </div>;
};
export default BaseInfo;
