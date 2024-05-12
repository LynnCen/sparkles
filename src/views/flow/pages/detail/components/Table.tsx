import { FC, useState } from 'react';
// import { refactorPermissions } from '@/common/utils/ways';
import { Button, Tooltip, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useMethods } from '@lhb/hook';
import { deviceStatusCheck } from '@/common/api/flow';
import Tables from '@/common/components/FilterTable';
// import Operate from '@/common/components/Operate';

const Table: FC<any> = ({
  loadData,
  searchParams,
  setSearchParams
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const columns = [
    {
      title: '店铺名称',
      key: 'storeName',
    },
    { title: '摄像头品牌', key: 'sourceName' },
    { title: '设备名称', key: 'name' },
    { title: '序列号', key: 'sn' },
    { title: '设备型号', key: 'typeName' },
    {
      // title: '画面状态',
      title: () => (
        <>
          <span className='pr-6'>画面状态</span>
          <Tooltip placement='top' title='只有视频设备有画面状态'>
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      key: 'liveStatusName',
      width: 120,
      render: (cur: string, record: any) => {
        const { liveStatus, type } = record;
        if (type !== 3) { // type = 3 (视频设备) 的时候才展示画面状态
          return '-';
        }
        // 异常时要红色提示
        return (
          <span className={ liveStatus ? '' : 'color-danger' }>{cur}</span>
        );
      }
    },
    {
      title: '当前状态',
      key: 'statusName',
      width: 100,
      render: (cur: string, record: any) => {
        const { status } = record;
        if (!status) { // 异常时要红色提示
          return (
            <span className='color-danger'>{cur}</span>
          );
        }
        return cur;
      }
    },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (value, record) => (
        <Button
          type='link'
          onClick={() => handleDetection(record.id)}>
          立即检测
        </Button>
        // <Operate
        //   operateList={refactorPermissions(value)}
        //   onClick={(btn: any) => methods[btn.func](record)}/>
      ),
    },
  ];

  const handleDetection = (id: number) => {
    setLoading(true);
    deviceStatusCheck({ id }).then(() => {
      setSearchParams({ isCurPage: true });
    }).finally(() => {
      setSearchParams({ isCurPage: true });
      setLoading(false);
    });
  };

  return (
    <Spin spinning={loading} tip='检测中...'>
      <Tables
        columns={columns}
        onFetch={loadData}
        filters={searchParams}
        className='mt-20'
        rowKey='id'
        bordered={true}/>
    </Spin>
  );
};

export default Table;
