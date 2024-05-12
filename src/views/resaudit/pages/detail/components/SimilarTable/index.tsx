import Table from '@/common/components/FilterTable';
import { useMethods } from '@lhb/hook';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
// import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
// import styles from './index.module.less';
import { getSimilarPlace, getSimilarSpot } from '@/common/api/audit';
import { urlParams } from '@lhb/func';

const AuditTable: FC<any> = ({ onSelectChange }) => {
  const { examineOrderId, resourceType } = urlParams(location.search);
  const [columns, setColumns]: any[] = useState([]);
  const [selectedId, setSelectedId] = useState<number>(0);

  /* hooks */
  useEffect(() => {
    setColumns([
      { key: 'name', title: resourceType === '0' ? '场地名称' : '点位名称' },
      { key: 'categoryName', title: '类目' },
      { key: 'address', title: '详细地址' },
      // {
      //   key: 'permissions',
      //   title: '操作',
      //   width: 160,
      //   fixed: 'right',
      //   render: (_, record: any) => {
      //     return (
      //       <Button
      //         type='link'
      //         className={styles.operationBtns}
      //         onClick={() => { console.log(record); }}
      //       >查看</Button>
      //     );
      //   },
      // }
    ]);
  }, [resourceType]);

  /* methods */
  const { loadData } = useMethods({
    loadData: async (values: any) => {
      const func = resourceType === '0' ? getSimilarPlace : getSimilarSpot; // 区分场地/展位
      const params = { ...values, examineOrderId };
      const result = await func(params);
      return {
        dataSource: result.objectList,
        count: result.totalNum,
      };
    },
  });

  return (
    <>
      <Table
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedId ? [selectedId] : [],
          onChange: (selectedRowKeys: React.Key[], selectedRows?: any) => {
            const id = selectedRowKeys.length ? Number(selectedRowKeys[selectedRowKeys.length - 1]) : 0;
            const rows = selectedRows.length ? selectedRows[selectedRows.length - 1] : {};
            setSelectedId(id);
            onSelectChange(rows);
          }
        }}
        rowKey='id'
        onFetch={loadData}
        pagination={true}
        columns={columns}
      />
    </>
  );
};

export default AuditTable;
