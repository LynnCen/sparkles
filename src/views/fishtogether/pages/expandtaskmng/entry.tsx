/**
 * @Description 拓店任务列表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import { useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import { Typography } from 'antd';
import FranchiseeDrawer from './components/FranchiseeDrawer';
import { franchiseeList } from '@/common/api/fishtogether';

const { Link } = Typography;
const ExpendTaskMng = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [curInfo, setCurInfo] = useState<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const [statusOptions, setCustomerStatusOptions] = useState<any[]>([]);

  const onSearch = (values: any) => {
    setParams({ ...values });
  };

  const onClick = (record) => {
    setOpen(true);
    setCurInfo(record);
  };

  const loadData = async (params) => {
    const searchParams: any = { ...params };

    const result: any = await franchiseeList(searchParams);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0
    };
  };

  const defaultColumns = [
    {
      title: '加盟商姓名',
      key: 'name',
      render: (text, record) => <Link onClick={() => onClick(record)}>{text}</Link>,
    },
    {
      title: '授权号',
      key: 'authNo',
    },
    {
      title: '加盟日期',
      key: 'franchiseeStart',
    },
    {
      title: '开发人员',
      key: 'developName',
    },
    {
      title: '当前状态',
      key: 'statusName',
      width: 80,
    },
    {
      title: '匹配点位总数',
      key: 'pointCount',
    },
  ];

  return (
    <V2Container
      className={cs(styles.container, 'bg-fff', 'pd-20', 'pb-0')}
      style={{ height: 'calc(100vh - 80px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: (
          <>
            <Filter onSearch={onSearch} setCustomerStatusOptions={setCustomerStatusOptions} />
          </>
        ),
      }}
    >
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        rowKey='id'
        scroll={{ y: mainHeight - 64 - 42 - 16 }}
      />
      <FranchiseeDrawer
        open={open}
        setOpen={setOpen}
        franchiseeId={curInfo?.taskId}
        statusOptions={statusOptions}
        onRefresh={onSearch}
      />
    </V2Container>
  );
};

export default ExpendTaskMng;
