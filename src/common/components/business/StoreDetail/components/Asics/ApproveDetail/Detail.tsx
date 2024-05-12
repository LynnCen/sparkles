import { FC, forwardRef, useState, useImperativeHandle } from 'react';
import { getApprovalRecordsAsics } from '@/common/api/storemanage';
import V2Title from '@/common/components/Feedback/V2Title';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import Table from 'antd/es/table';

/*
  审批流水详情
*/
const Detail: FC<any> = forwardRef(({
  id,
}, ref) => {
  useImperativeHandle(ref, () => ({
    onload: () => {
      getDetail();
    },
  }));

  const [records, setRecords] = useState<any>([]);

  const getDetail = async () => {
    const { records } = await getApprovalRecordsAsics({ id });
    Array.isArray(records) && setRecords(records);
  };

  const columns = [
    { title: '审批结果', dataIndex: 'statusName', },
    { title: '审批人', dataIndex: 'employeeName', },
    { title: '审批时间', dataIndex: 'operateTime', },
    { title: '审批意见', dataIndex: 'reason', },
  ];

  const transferRecords = (records: any) => {
    return Array.isArray(records) ? records.map((rcd: any, index: any) => ({ ...rcd, index })) : [];
  };

  return (
    <>
      <V2Title text='审批结果'/>
      {Array.isArray(records) ? records.map((rcd: any, idx: number) => (<div key={idx}>
        <TitleTips name={rcd.title} showTips={false}/>
        <Table
          className='mt-20'
          pagination={false}
          columns={columns}
          dataSource={transferRecords([rcd])}
          rowKey='index'
        />
      </div>)) : <div className='mt-20 fs-14'>暂无审批数据</div>
      }
    </>
  );
});

export default Detail;
