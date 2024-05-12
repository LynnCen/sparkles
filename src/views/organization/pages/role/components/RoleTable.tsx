/* 角色管理表格内容 */
import { FC, useState } from 'react';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import Operate from '@/common/components/Operate';
import { message } from 'antd';
import RolePermission from './RolePermission';
import { post } from '@/common/request';
import { userSearch } from '@/common/api/brief';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { RoleTableProps, RoleListRecords } from '../ts-config';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Table from '@/common/components/Data/V2Table';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import ModalOfBindPosition from './BindPost';

const RoleTable: FC<RoleTableProps> = ({
  setOperateRole,
  loadData,
  params,
  onSearch,
  mainHeight,
  departmentListData, // 部门列表
  postListData, // 岗位列表
}) => {
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
  const [bindPost, setBindPost] = useState<any>({ // 部门岗位绑定
    visible: false,
    roleId: '' // 角色id
  });

  const columns: any[] = [
    {
      key: 'id',
      title: '序列',
      width: 100,
      fixed: 'left',
      render: (_value: number, _record: any, index: number) => index + 1,
    },
    { key: 'name', title: '名称' },
    { key: 'encode', title: '编码' },
    { key: 'desc', title: '描述' },
    { key: 'gmtCreate', title: '创建时间' },
    {
      key: 'permissions',
      title: '操作',
      width: 200,
      render: (value: Permission[], record: RoleListRecords) => (
        <Operate
          operateList={refactorPermissions(value || [])}
          onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
        />
      )
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      bigdataBtn('e1b604ab-092d-4030-90f5-4ea2da075941', '角色管理', '编辑', '点击了编辑角色');
      setOperateRole({ ...record, visible: true });
    },
    // 删除
    handleDelete(record: any) {
      bigdataBtn('7629ff24-c02e-4361-a6de-77bab1abf6f1', '角色管理', '删除', '点击了删除角色');
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '此操作将永久删除该数据, 是否继续？' });
    },
    // 角色成员
    handleMember(record: any) {
      // 获取当前角色下的用户
      userSearch({ roleId: record.id }).then((result) => {
        setChooseUserValues({ visible: true, users: result, id: record.id, name: record.name });
      });
    },
    // 角色权限
    handlePermission(record: any) {
      setRolePermission({ visible: true, id: record.id, title: record.name });
    },
    // 部门岗位绑定
    handleBindRule(record: any) {
      const { id } = record;
      id && setBindPost({
        visible: true,
        roleId: id
      });
    }
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33079
    post('/role/delete', { id }, true).then(() => {
      message.success('角色删除成功');
      modal.destroy();
      onSearch();
    });
  };

  // 确定选择成员
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    const params = { id: chooseUserValues.id, userIds: users.map((item) => item.id) };
    post('/role/joinUser', params, true).then(() => {
      message.success('角色成员修改成功');
      setChooseUserValues({ users, visible });
    });
  };

  const onClose = () => {
    setRolePermission({ ...rolePermission, visible: false });
  };

  return (
    <>
      <V2Table
        className={styles.tableWrap}
        rowKey='id'
        pagination={false}
        onFetch={loadData}
        filters={params}
        defaultColumns={columns}
        scroll={{ y: mainHeight - 60 }}
      />
      <RolePermission rolePermission={rolePermission} onClose={onClose} />
      <PermissionSelector
        title={`角色成员-${chooseUserValues.name}`}
        type='MORE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
      {/* 部门岗位绑定弹窗 */}
      <ModalOfBindPosition
        modalData={bindPost}
        departmentListData={departmentListData}
        postListData={postListData}
        // 不用更新列表
        onCancel={() => setBindPost({ visible: false, roleId: '' })}/>
    </>
  );
};

export default RoleTable;
