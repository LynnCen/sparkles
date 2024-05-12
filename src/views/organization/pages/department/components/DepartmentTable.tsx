/* 部门管理表格内容 */
import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import { message } from 'antd';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { OperateButtonProps, FormattingPermission } from '@/common/components/Operate/ts-config';
import { DepartmentTableProps } from '../ts-config';
import styles from './index.module.less';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const DepartmentTable: FC<DepartmentTableProps> = ({ setOperateDepartment, loadData, params, onSearch }) => {
  const columns = [
    { key: 'id', title: '序号', fixed: 'left' },
    { key: 'name', title: '名称' },
    { key: 'encode', title: '编码' },
    { key: 'manager', title: '部门主管', render: (text:any) => <div style={{ minWidth: 60 }}>{text}</div> },
    { key: 'desc', title: '备注' },
    { key: 'gmtCreate', title: '创建时间', width: 200 },
    {
      key: 'permissions',
      fixed: 'right',
      title: '操作',
      render: (value: OperateButtonProps, record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      setOperateDepartment({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      V2Confirm({
        onSure: (modal) => onDelete(modal, record.id),
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33067
    post('/department/delete', { id }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('部门删除成功');
      modal.destroy();
      onSearch();
    });
  };

  return (
    <Table
      rowKey='id'
      filters={params}
      className={styles.tableWrap}
      onFetch={loadData}
      pagination={false}
      columns={columns}
    />
  );
};

export default DepartmentTable;
