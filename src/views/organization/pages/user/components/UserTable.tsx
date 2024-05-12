/* 用户管理表格 */
import { FC } from 'react';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { message, Modal } from 'antd';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { useMethods, useClientSize } from '@lhb/hook';
import { post } from '@/common/request';
import { Permission, FormattingPermission } from '@/common/components/Operate/ts-config';
import { UserTableProps, UserObjectList } from '../ts-config';
import styles from './index.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { refactorPermissions } from '@lhb/func';

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
    { key: 'gender', title: '性别', width: 80 },
    { key: 'mobile', title: '手机', width: 120 },
    { key: 'department', title: '部门' },
    { key: 'position', title: '岗位', width: 180 },
    { key: 'gmtCreate', title: '创建时间', width: 180 },
    { key: 'status', title: '状态', width: 60 },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      render: (value: Permission[], record: UserObjectList) => {
        return (
          <Operate
            operateList={refactorPermissions(value)}
            onClick={(btn: FormattingPermission) => methods[btn.func](record)}
          />
        );
      }
      ,
    },
  ];

  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 300;

  const { ...methods } = useMethods({
    // 编辑
    handleUpdate(record: any) {
      showOperateModal({ visible: true, id: record.id });
    },
    // 删除
    handleDelete(record: any) {
      ConfirmModal({ onSure: (modal) => onDelete(modal, record.id) });
    },
    // 重置密码
    async handleResetPasswordByAdmin(record: any) {
      const { id, name } = record;
      Modal.confirm({
        title: '重置密码',
        icon: <ExclamationCircleOutlined />,
        content: `确定为「${name}」重置密码?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return resetPasswordByAdmin(id);
        }
      });
    }
  });

  const resetPasswordByAdmin = async (id: number) => {
    const success = await post('/account/resetPasswordByAdmin', { id }, {
      proxyApi: '/mirage',
      needHint: true
    });
    if (success) {
      message.success('重置密码已发送，请让联系人及时修改密码');
    }
  };



  // 确定删除
  const onDelete = (modal: any, id: number) => {
    // http://yapi.lanhanba.com/project/289/interface/api/33056
    post('/employee/delete', { id }, {
      needHint: true,
      proxyApi: '/mirage'
    }).then(() => {
      message.success('用户删除成功');
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
