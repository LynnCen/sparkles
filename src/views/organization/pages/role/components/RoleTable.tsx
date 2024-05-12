/* 角色管理表格内容 */
import { FC, useState } from 'react';
import Table from '@/common/components/FilterTable';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import Operate from '@/common/components/Operate';
import { message } from 'antd';
import RolePermission from './RolePermission';
import { post } from '@/common/request';
import { useMethods } from '@lhb/hook';
import { userSearch } from '@/common/api/user';
import { OperateButtonProps, FormattingPermission } from '@/common/components/Operate/ts-config';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { RoleTableProps, RoleListRecords } from '../ts-config';
import styles from './index.module.less';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const RoleTable: FC<RoleTableProps> = ({ setOperateRole, loadData, params, onSearch }) => {
  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [],
    id: undefined,
    name: '',
  });

  // 个人权限设置
  const [rolePermission, setRolePermission] = useState<any>({
    visible: false,
    record: {},
    title: '',
  });

  const columns: any[] = [
    { key: 'id', title: '序列', width: 60, fixed: 'left', render: (_value: number, _record: any, index: number) => index + 1, },
    { key: 'name', title: '名称' },
    { key: 'encode', title: '编码' },
    { key: 'desc', title: '描述' },
    { key: 'gmtCreate', title: '创建时间' },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      render: (value: OperateButtonProps, record: RoleListRecords) => (
        <Operate
          operateList={refactorPermissions(value || [])}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      setOperateRole({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      V2Confirm({
        onSure: (modal) => onDelete(modal, record.id),
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
    // 角色成员
    handleMember(record: any) {
      // 获取当前角色下的用户
      userSearch({ roleId: record.id, exceptStatus: 4 }).then((result) => {
        setChooseUserValues({ visible: true, users: result, id: record.id, name: record.name });
      });
    },
    // 角色权限
    handlePermission(record: any) {
      setRolePermission({ visible: true, id: record.id, title: record.name });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33079
    post('/role/delete', { id }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('角色删除成功');
      modal.destroy();
      onSearch();
    });
  };

  // 确定选择成员
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    const params = { id: chooseUserValues.id, userIds: users.map((item) => item.id) };
    post('/role/joinUser', params, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('角色成员修改成功');
      setChooseUserValues({ users, visible });
    });
  };

  const onClose = () => {
    setRolePermission({ ...rolePermission, visible: false });
  };

  return (
    <>
      <Table
        className={styles.tableWrap}
        rowKey='id'
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
      <RolePermission rolePermission={rolePermission} onClose={onClose} />
      <PermissionSelector
        title={`角色成员-${chooseUserValues.name}`}
        type='MORE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </>
  );
};

export default RoleTable;
