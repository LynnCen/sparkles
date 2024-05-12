import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import Filter from './components/Filter';
import V2Table from '@/common/components/Data/V2Table';
import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import V2Operate from '@/common/components/Others/V2Operate';
import TaskListDrawer from './components/TaskListDrawer';
import { isArray, isNotEmptyAny, refactorPermissions } from '@lhb/func';
import { getEmployeeList } from '@/common/api/system';
import { Form } from 'antd';

const MigrationStandard: FC<any> = () => {

  const [searchForm] = Form.useForm();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<any>(-1);


  const loadData = async (params) => {
    const result = await getEmployeeList(params);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  const onSearch = () => {

    const params = searchForm.getFieldsValue();
    const { departmentId } = params || {};
    const departmentIds:any[]|undefined = isArray(departmentId) && departmentId.length ? Array.from(departmentId.flat(Infinity)) : undefined;
    console.log('params', params);
    setParams({
      ...params,
      departmentIds,
      departmentId: undefined
    });
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
      width: 130,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '员工姓名',
      key: 'name',
      width: 130,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '状态',
      key: 'statusName',
      width: 130,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '部门',
      key: 'department',
      width: 200,
      importWidth: true,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '职位',
      key: 'position',
      width: 200,
      importWidth: true,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '待迁移任务数量',
      key: 'taskCount',
      sorter: true,
      width: 130,
      render: (value) => isNotEmptyAny(value) ? value : '-',
    },
    {
      title: '操作',
      key: 'operation',
      width: 130,
      fixed: 'right',
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
          top: (<Filter form={searchForm} onSearch={onSearch} />)
        }}
      >
        <V2Table
          onFetch={loadData}
          filters={params}
          defaultColumns={defaultColumns}
          hideColumnPlaceholder
          rowKey='employeeId'
          defaultSorter={{
            order: 'asc',
            orderBy: 'taskCount'
          }}
          // 64是分页模块的总大小， 42是table头部
          scroll={{ y: mainHeight - 64 - 42 - 16 }}
        />
      </V2Container>
      <TaskListDrawer
        open={open}
        setOpen={setOpen}
        employeeId={employeeId}
        onHomeRefresh={() => setParams({})} // 表格刷新
      />
    </>
  );
};
export default MigrationStandard;
