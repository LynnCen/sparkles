import { FC } from 'react';
import Tables from '@/common/components/FilterTable';
import { dispatchNavigate } from '@/common/document-event/dispatch';
const Table:FC<any> = ({
  loadData
}) => {
  const columns = [
    {
      title: '同商场历史开店情况',
      key: 'name',
      render: (value, record) => (
        <span
          className='c-244'
          onClick={() => dispatchNavigate(`/car/analysis?id=${record.id}`)}>
          {value}
        </span>
      )
    },
    {
      title: '营业日期',
      key: 'date',
      render: (_, record) => (record.openDate && record.closeDate ? (record.openDate + '-' + record.closeDate) : '-')
    },
    {
      title: '日均过店客流(人)',
      key: 'passby',
    },
    {
      title: '日均进店客流(人)',
      key: 'indoor',
    },
    {
      title: '日均留资人数(人)',
      key: 'stayInfo',
    },
    {
      title: '日均大定人数(人)',
      key: 'order',
    }
  ];
  return (
    <div className='mt-16'>
      <Tables
        pagination={false}
        columns={columns}
        onFetch={loadData}
        rowKey='id'
      />
    </div>
  );
};
export default Table;
