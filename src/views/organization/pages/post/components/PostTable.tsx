/* 岗位管理表格 */
import { FC, useState } from 'react';
import { message } from 'antd';
import Operate from '@/common/components/Operate';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';

import { post } from '@/common/request';
import { userSearch } from '@/common/api/brief';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { PostTableProps } from '../ts-config';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Table from '@/common/components/Data/V2Table';
import { refactorPermissions } from '@lhb/func';

const PostTable: FC<PostTableProps> = ({ setOperatePost, loadData, params, onSearch, mainHeight }) => {
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [],
  });

  const columns = [
    {
      key: 'id',
      title: '序号',
      fixed: 'left',
      width: 100,
      render: (_value: number, _record: any, index: number) => index + 1,
    },
    { key: 'name', title: '岗位名称' },
    { key: 'encode', title: '岗位编码' },
    { key: 'desc', title: '岗位说明' },
    { key: 'gmtCreate', title: '创建时间', width: 200 },
    {
      key: 'permissions',
      title: '操作',
      render: (value: Permission, record: any) => (
        <Operate
          operateList={refactorPermissions(value || [])}
          onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
        />
      ),
    },
  ];

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      setOperatePost({ visible: true, ...record });
    },
    // 删除
    handleDelete(record: any) {
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '此操作将永久删除该数据, 是否继续？' });
    },
    // 角色成员
    handleMember(record: any) {
      // http://yapi.lanhanba.com/project/289/interface/api/33207
      // 获取当前岗位下的角色成员
      userSearch({ positionId: record.id }).then((result) => {
        setChooseUserValues({ visible: true, users: result || [], id: record.id });
      });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33073
    post('/position/delete', { id }, true).then(() => {
      message.success('岗位删除成功');
      modal.destroy();
      onSearch();
    });
  };

  // 确定选择成员
  const onOkSelector = ({ users }: PermissionSelectorValues) => {
    const params = {
      id: chooseUserValues.id,
      userIds: users.map((item) => item.id),
    };
    // http://yapi.lanhanba.com/project/289/interface/api/33074
    post('/position/joinUser', params, true).then(() => {
      setChooseUserValues({ visible: false, users: [] });
      onSearch();
      message.success('岗位成员修改成功');
    });
  };

  return (
    <div className={styles.tablesWrap}>
      <V2Table
        rowKey='id'
        onFetch={loadData}
        filters={params}
        defaultColumns={columns}
        scroll={{ y: mainHeight - 80 }}
      />
      <PermissionSelector
        title='选择用户'
        type='MORE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </div>
  );
};

export default PostTable;
