import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Filter from './components/Filter';
import V2Table from '@/common/components/Data/V2Table';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import V2Operate from '@/common/components/Others/V2Operate';
import Drawer from './components/Drawer';
import { post } from '@/common/request';
import { refactorPermissions } from '@lhb/func';

const Migration: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams({ ...params, ...values });
  };
  const [open, setOpen] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<any>(-1);

  const loadData = async (params) => {
    // 过滤掉空字符串
    if (!params.phone) {
      delete params.phone;
    }
    if (!params.name) {
      delete params.name;
    }
    // https://yapi.lanhanba.com/project/497/interface/api/51127
    const result: any = await post('/yn/employee/page', params, {
      isMock: false,
      mockId: 497,
      mockSuffix: '/api',
    });
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  const { ...methods } = useMethods({
    handleMigrate(record) {
      setOpen(true);
      setEmployeeId(record.employeeId);
    },
  });

  const defaultColumns = [
    {
      title: '员工手机号',
      key: 'phone',
      width: 80,
    },
    {
      title: '员工姓名',
      key: 'name',
      width: 130,
    },
    {
      title: '状态',
      key: 'statusName',
      width: 130,
    },
    {
      title: '部门',
      key: 'department',
      width: 180,
    },
    {
      title: '职位',
      key: 'position',
      width: 180,
    },
    {
      title: '待迁移任务数量',
      key: 'taskCount',
      width: 180,
    },
    {
      title: '操作',
      key: 'operation',
      width: 180,
      render: (value: any, record) => (
        <V2Operate
          operateList={refactorPermissions([{ name: '数据迁移', event: 'migrate' }])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];

  return (
    <>
      <V2Container
        className={cs(styles.container, 'bg-fff', 'pd-20')}
        style={{ height: 'calc(100vh - 84px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <Filter onSearch={onSearch} />
            </>
          ),
        }}
      >
        <V2Table
          onFetch={loadData}
          filters={params}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
          rowKey='employeeId'
          // scroll={{ x: 'max-content', y: 250 }}
          // 64是分页模块的总大小， 42是table头部
          scroll={{ y: mainHeight - 64 - 42 - 16 }}
        />
      </V2Container>
      <Drawer open={open} setOpen={setOpen} employeeId={employeeId} onHomeSearch={onSearch} />
    </>
  );
};
export default Migration;
