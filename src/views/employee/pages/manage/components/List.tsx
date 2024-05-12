import React from 'react';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { updateEmployeeStatus } from '@/common/api/employee';
import styles from './index.module.less';
import { ListProps } from '../ts-config';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const List: React.FC<ListProps> = ({
  params,
  loadData,
  addEmployee,
  onRefresh
}) => {
  const columns = [
    { key: 'name', title: '姓名' },
    { key: 'mobile', title: '手机号' },
    { key: 'created_at', title: '创建时间' },
    { key: 'permissions', title: '操作', align: 'center', render: (value, record) => (
      <Operate
        operateList={refactorPermissions(value)}
        onClick={(btn: any) => methods[btn.func](record)}
      />
    ) },
  ];

  const { handleAdd, disableEmployee, ...methods } = useMethods({
    handleDisable(record: any) {
      // 停用按钮处理
      disableEmployee(record, true);
    },
    handleEnable(record: any) {
      // 启用按钮处理
      disableEmployee(record, false);
    },

    disableEmployee(record: any, isDisable: boolean) {
      Modal.confirm({
        title: `${isDisable ? '禁用' : '启用'}员工`,
        content: `${isDisable ? '禁用后员工将无法登录企业客流宝后台，您还要继续吗？' : '启用后员工将可以登录企业客流宝后台，您还要继续吗？'}`,
        icon: <ExclamationCircleOutlined/>,
        okText: '确定',
        cancelText: '取消',
        onOk: (close) => {
          const params = {
            account_id: record.account_id,
            disable: isDisable ? 1 : 0
          };
          console.log('操作', params);
          updateEmployeeStatus(params).then(() => {
            message.success(`${isDisable ? '禁用' : '启用'}成功`);
            close && close();
            onRefresh();
          });
        },
      });

    },

    handleAdd() {
      addEmployee();
    }
  });

  return (
    <div className={styles.container}>
      <Button type='primary' className={styles.add} onClick={handleAdd}>新增员工</Button>
      <Table
        rowKey='id'
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
    </div>
  );
};

export default List;
