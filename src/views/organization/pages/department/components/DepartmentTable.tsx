/* 部门管理表格内容 */
import { FC } from 'react';
import { Typography, message } from 'antd';
import Operate from '@/common/components/Operate';
import { post } from '@/common/request';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { DepartmentTableProps } from '../ts-config';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Table from '@/common/components/Data/V2Table';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';

const DepartmentTable: FC<DepartmentTableProps> = ({
  setOperateDepartment,
  loadData,
  params,
  onSearch,
  mainHeight,
}) => {
  const columns = [
    { key: 'id', title: '序号', fixed: 'left', width: 240,
      render: (value) => <Typography.Paragraph
        className={styles.content}
        ellipsis={{ tooltip: value }}
      >
        {value}
      </Typography.Paragraph>
    },
    { key: 'name', title: '名称' },
    { key: 'encode', title: '编码', width: 160 },
    { key: 'manager', title: '部门主管', width: 120 },
    { key: 'desc', title: '备注' },
    { key: 'gmtCreate', title: '创建时间', width: 200 },
    {
      key: 'permissions',
      title: '操作',
      render: (value: Permission, record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      bigdataBtn('7c3906a2-789a-4392-8665-8e0829ed1d00', '部门管理', '编辑', '点击了编辑部门');
      setOperateDepartment({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      bigdataBtn('6722b184-c05e-4df8-a221-cefade15f400', '部门管理', '删除', '点击了删除部门');
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '此操作将永久删除该数据, 是否继续？' });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33067
    post('/department/delete', { id }, true).then(() => {
      message.success('部门删除成功');
      modal.destroy();
      onSearch();
    });
  };

  return (
    <V2Table
      rowKey='id'
      filters={params}
      className={styles.tableWrap}
      onFetch={loadData}
      pagination={false}
      defaultColumns={columns}
      scroll={{ y: mainHeight - 40 }}
      hideColumnPlaceholder
    />
  );
};

export default DepartmentTable;
