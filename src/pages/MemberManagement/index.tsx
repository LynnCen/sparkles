import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryType } from './data.d';
import { ItemType as RoleItem } from '@/pages/RoleManagement/data';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm } from 'antd';
import {
  queryList,
  updateById,
  addNew,
  deleteById,
  setStatusById,
  updatePassword,
} from './service';
import { queryList as queryRoles } from '@/pages/RoleManagement/service';
import { PlusOutlined } from '@ant-design/icons';
import { UserModelState } from '@/models/user';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState } from '@/models/connect';
import UpdatePasswordForm, {
  FormValueType as PwdFormValueType,
} from '@/pages/MemberManagement/components/UpdatePassword';
import ProTableIntl from '@/components/ProTableIntl';

/**
 * 更新节点
 * @param fields
 * @param id
 * @param formatMessage
 */
const handleUpdate = async (
  fields: FormValueType,
  id: string,
  formatMessage: (obj: { id: string }) => string,
) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
   const res=  await updateById({
      id,
      ...fields,
    });
    if (res) {
      const [data, err] = res
      if (!err && !data.err_code) {
        hide()
        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }
    
    hide()
    return false
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 新增节点
 * @param fields
 * @param formatMessage
 */
const handleAdd = async (fields: FormValueType, formatMessage: (obj: { id: string }) => string) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await addNew({ ...fields });
    if (res) {
      const [data, err] = res
      if (!err && data.err_code === 0) {
        hide();
        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }
    
    hide()
    return false;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 删除节点
 * @param itemId
 * @param formatMessage
 */
const handleDelete = async (itemId: string, formatMessage: (obj: { id: string }) => string) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await setStatusById({
      id: itemId,
      status :-1
    });
    if (res) {
      const [data, err] = res 
      if (!err && data.err_code === 0) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }
    
    hide()
    return false
  } catch (error) {
    hide();
    return false;
  }
};

const handleUpdatePwd = async (
  fields: Partial<PwdFormValueType>,
  formatMessage: (obj: { id: string }) => string,
) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await updatePassword({
      ...fields,
    });
    console.log(res);
    
    if (res) {
      const [data, err] = res
      if (!err && !data.err_code) {
        hide();
        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }

    hide()
    return false;
  } catch (error) {
    hide();
    // message.success(formatMessage({ id: 'table-setting-failure' }));
    return false;
  }
};

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = ({ user }) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ItemType | Record<string, never>>({});
  const [selectPwdItem, setSelectPwdItem] = useState<ItemType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [roles, setRoleList] = useState<RoleItem[]>([]);
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});
  const [userInfo, setUserInfo] = useState<{ is_admin?: boolean; userId?: string }>({});

  useEffect(() => {

    // @ts-ignore
    setAuthObj(getPermissionsAsObj(user.currentUser.access, ['system', 'staff']));
    setUserInfo({ is_admin: !!user?.currentUser?.is_admin, userId: user?.currentUser?.id });
  }, [user]);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    queryRoles({ page: 1, row: 99 }).then((resArr) => {

      if (resArr) {
        const [res, err] = resArr
        
        if (!err && !res.err_code) {   
          setRoleList(res.items)
        }
      }
    }, console.log);
  }, []);

  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-username' }),
      dataIndex: 'username',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-role-name' }),
      dataIndex: 'role_name',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-staff-status' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueType: 'textarea',
      render(val) {

        switch (val) {
          case 1:
            val = '正常'
            break;
          case -1:
            val = '已删除'
            break;
          case -2:
          val = '已禁用'
          break;
        }

        return val
        
      }
    },
    {
      title: formatMessage({ id: 'table-remark' }),
      dataIndex: 'remark',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-create-time' }),
      dataIndex: 'create_time',
      valueType: 'date',
      // sorter: true,
      hideInSearch: true,
      render: (text) => {
        return text
      },
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <>
          {((authObj.edit && record.status !== -1  ) || userInfo.userId === record.id) && (
            <>
              <a onClick={() => setSelectPwdItem(record)}>
                {formatMessage({ id: 'table-restPSW' })}
              </a>
              <Divider type="vertical" />
            </>
          )}
          {authObj.edit && record.status !== -1 && (
            <>
              <a
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setSelectedItem(record);
                }}
              >
                {formatMessage({ id: 'table-edit' })}
              </a>
              <Divider type="vertical" />
            </>
          )}
          {authObj.delete && record.status !== -1 && userInfo.userId !== record.id && (
            <>
              <a
                onClick={() => {
                  Modal.confirm({
                    title: formatMessage({ id: 'table-modal-delete' }),
                    onOk: async () => {
                      const success = await handleDelete(record.id, formatMessage);
                      if (success && actionRef.current) {
                        actionRef.current.reload();
                      }
                    },
                  });
                }}
              >
                {formatMessage({ id: 'table-delete' })}
              </a>
              <Divider type="vertical" />
            </>
          )}
          {authObj.forbidden && record.status !== -1 && userInfo.userId !== record.id && (
            <Popconfirm
              placement={'left'}
              title={formatMessage({ id: `${record.status === 1  ? 'table-off-msg' : record.status === -2 ? 'table-on-msg' : 'table-on-msg'}` })}
              onConfirm={() => {
                setStatusById({ id: record.id, status: record.status === 1 ? -2 : 1 }).then(
                  () => {
                    message.success('Success');
                    actionRef.current?.reload();
                  },
                  () => message.error('Failure'),
                );
              }}
            >
              <a>{formatMessage({ id: `${record.status === 1 ? 'table-on' : record.status === -2 ? 'table-off': 'table-on-msg'}` })}</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryType>
        search={false}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        params={{
          sorttime: sorter,
        }}
        toolBarRender={() => {
          if (!authObj.insert) return [];
          return [
           <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> {formatMessage({ id: 'table-add' })}
            </Button>,
          ];
        }}
        request={async (params) => {
          // @ts-ignore
          const { current, pageSize } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            sorttime: sorter,
          });
     
          if (!res) {

            return {
              data: [],
              success: false,
              total: 0,
              current: 0
            }  
          }

          const items =  res[0].items.map(item => ({ ...item, key: item.id }))

          return {
            data: items,
            success: !res[0].err_code,
            total: res[0].count,
            current: res[0].page,
          };
        }}
        columns={columns}
      />

      {createModalVisible && (
        <UpdateForm
          isAddNew
          onCancel={() => handleModalVisible(false)}
          updateModalVisible={createModalVisible}
          onSubmit={async (value) => {
            const success = await handleAdd(value, formatMessage);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          values={{}}
          roles={roles}
        />
      )}
      {selectedItem && Object.keys(selectedItem).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value, selectedItem.id, formatMessage);
            if (success) {
              handleUpdateModalVisible(false);
              setSelectedItem({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setSelectedItem({});
          }}
          updateModalVisible={updateModalVisible}
          values={selectedItem}
          roles={roles}
        />
      ) : null}
      {selectPwdItem && Object.keys(selectPwdItem).length ? (
        <UpdatePasswordForm
          onSubmit={async (value) => {
            const success = await handleUpdatePwd(value, formatMessage);
            if (success) {
              setSelectPwdItem({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setSelectPwdItem({});
          }}
          values={{ id: selectPwdItem.id }}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
