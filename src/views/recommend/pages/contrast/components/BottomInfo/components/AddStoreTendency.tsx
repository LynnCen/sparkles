/**
 * @Description  新增门店趋势/关闭门店趋势
 */

import { FC } from 'react';
import LineChart from './LineChart';
import styles from '../index.module.less';
import { DataType } from '../../../ts-config';
import { Table } from 'antd';
const AddStoreTendency:FC<any> = ({
  data,
  yData,
  xData,
  type,
  columns,
  tableData,
  selectedInfo,
  curSelected,
  valueName
}) => {
  return <div >
    {(type === DataType.CHART && data.length) ? <LineChart
      valueName={valueName}
      config={{
        data,
        yData,
        xData,
        grid: {
          left: 80,
          right: 30,
          top: 18,
          bottom: 40,
        },
      }}
      curSelected={curSelected}
      selectedInfo={selectedInfo}
      className={styles.echarts}
    /> : <></>
    }
    {
      (type === DataType.TABLE && data.length) ? <Table
        sticky={true}
        pagination={false}
        columns={columns}
        dataSource={tableData}
        className={styles.tableInfo}
        rowKey='brand'
      /> : <></>
    }
  </div>;
};
export default AddStoreTendency;
