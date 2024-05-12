/* 用户管理表格 */
import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { post } from '@/common/request';
import { Permission, OperateButtonProps } from '@/common/components/Operate/ts-config';
import { UserTableProps, UserObjectList } from '../ts-config';
import styles from './index.module.less';
import { useClientSize, useMethods } from '@lhb/hook';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';

const UserTable: FC<UserTableProps> = ({ showOperateModal, loadData, params, onSearch }) => {
  const columns: any[] = [
    {
      key: 'id',
      title: '序号',
      width: 60,
      render: (_value: number, _record: any, index: number) => index + 1,
    },
    { key: 'username', title: '账号', width: 160 },
    { key: 'name', title: '姓名', width: 100 },
    { key: 'gender', title: '性别', width: 60 },
    { key: 'mobile', title: '手机', width: 120 },
    { key: 'department', title: '部门', width: 120 },
    { key: 'gmtCreate', title: '创建时间', width: 180 },
    { key: 'status', title: '状态', width: 60 },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (value: Permission[], record: UserObjectList) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
        />
      ),
    },
  ];

  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 316;

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      bigdataBtn('38896b76-4d07-4701-ba48-8801e685fa92', '用户管理', '编辑', '点击了编辑用户');
      showOperateModal({ visible: true, id: record.id });
    },
    // 删除
    handleDelete(record: any) {
      bigdataBtn('a821d73c-646b-41d2-b38d-18b6b9aedbc0', '用户管理', '删除', '点击了删除用户');
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '此操作将永久删除该数据, 是否继续？' });
    },
    // 重置密码
    handleRePassword(record: any) {
      bigdataBtn('94c9a740-413c-47f0-9bb8-2ea876e5cc14', '用户管理', '重置密码', '点击了重置密码');
      V2Confirm({ onSure: (modal) => onResetPasseord(modal, record.id), content: '此操作将重置用户密码, 是否继续？' });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33056
    post('/user/delete', { id }, true).then(() => {
      V2Message.success('用户删除成功');
      modal.destroy();
      onSearch();
    });
  };

  // 重置用户密码
  const onResetPasseord = (modal: any, id: number) => {
    // https://yapi.lanhanba.com/project/297/interface/api/56384
    post('/rePassword', { employeeId: id }, true).then(() => {
      V2Message.success('用户密码重置成功');
      modal.destroy();
      onSearch();
    });
  };

  return (
    <Table
      rowKey='id'
      className={styles.tableWrap}
      scroll={{ x: 'max-content', y: scrollHeight }}
      onFetch={loadData}
      filters={params}
      columns={columns}
    />
  );
};

export default UserTable;
