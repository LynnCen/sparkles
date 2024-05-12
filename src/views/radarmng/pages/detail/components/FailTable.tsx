import React, { useMemo } from 'react';
import { Table } from 'antd';
import styles from './index.module.less';
import { urlParams } from '@lhb/func';

const FailTable: React.FC<any> = ({ detail }) => {
  // console.log('FailTable', detail);
  const columns = [
    { key: 'name', dataIndex: 'name', title: '参数值' },
    { key: 'reason', dataIndex: 'reason', title: '失败原因' },
  ];

  const dataSource = useMemo(() => {
    const dataSource = Array.isArray(detail.failureSubTasks) ? detail.failureSubTasks.map((itm, idx) => {
      const address = itm.address.name || '-';
      const category = itm.category?.categoryName || '-';
      const brand = itm.brand?.brandName || '-';
      const taskTypeAndName = urlParams(location.search)?.taskType === 'CATEGORY_TASK' ? `POI类别：${category}` : `品牌名称：${brand}`;
      return {
        id: idx,
        key: idx,
        name: `地址：${address}；${taskTypeAndName}`,
        reason: itm.errorMessage || '-',
      };
    }) : [];
    return dataSource;
  }, [detail]);

  return (
    <div className={styles.sectionTable}>
      <div className={styles.sectionTitle}>失败任务</div>
      <Table
        rowKey='id'
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default FailTable;
