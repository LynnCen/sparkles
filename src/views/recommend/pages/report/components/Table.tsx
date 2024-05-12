import { FC } from 'react';
// import { refactorPermissions } from '@/common/utils/ways';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import Tables from '@/common/components/FilterTable';
// import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { message, Modal, Space, Tooltip } from 'antd';
import { deleteReport } from '@/common/api/recommend';
const Table: FC<any> = ({ loadData, searchParams, onSearch }) => {
  const columns = [
    {
      title: '目标区域',
      key: 'id',
      width: 200,
      render: (value, record) => {
        const { areaName } = record;
        return areaName;
      }
    },
    { title: '推荐模型', key: 'modelName' },
    { title: '申请日期', key: 'createDate' },
    {
      title: '当前进度',
      key: 'statusName',
      render: (_) => <span style={{ color: _ === '分析中' ? '#FF861D' : '#132144' }}>
        {_}
      </span>
    },
    { title: '申请人', key: 'creator' },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (value, record) => {
        return <Space size='middle'>
          { record.statusName === '已完成' ? <a onClick={() => methods['handleDetail'](record)}>
            查看详情</a> : <Tooltip placement='bottomLeft' title={`${record.statusName}的状态暂不支持查看详情`}>
            <a style={{ color: '#9EA5B0' }} >查看详情</a>
          </Tooltip> }
          <a style={{ color: 'red' }} onClick={() => methods['deleteDetail'](record)}>删除</a>
        </Space>;
      }
    },
  ];

  const { ...methods } = useMethods({
    // 详情
    handleDetail(record: any) {
      const { id, modelName } = record;
      if (modelName === '自定义指标推荐') {
        dispatchNavigate(`/recommend/map?id=${id}`);
      } else {
        dispatchNavigate(`/recommend/reportdetail?id=${id}`);
      };
    },
    deleteDetail(record: any) {
      Modal.confirm({
        title: '提示',
        content: '确认删除该开店区域推荐报告吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await deleteReport({ id: record.id });
            if (res) {
              onSearch();
              message.success('删除成功！');
            } else {
              message.error('删除失败！');
            };
          } catch (error) {}
        },
      });
    }
  });

  return (
    <>
      <Tables
        columns={columns}
        onFetch={loadData}
        filters={searchParams}
        className='mt-20'
        rowKey='id'
        bordered={true} />
    </>
  );
};

export default Table;
