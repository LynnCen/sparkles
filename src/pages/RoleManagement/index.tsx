import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { QueryParamsType, ItemType } from './data.d';
import { useIntl, connect } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm } from 'antd';
import { queryList, updateById, addNew, setStatusById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState, UserModelState } from '@/models/connect';

/**
 * 更新节点
 * @param fields
 * @param id
 * @param formatMessage
 */
const handleUpdate = async (
  fields: Partial<FormValueType>,
  id: string,
  formatMessage: (obj: { id: string }) => string,
) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    const res = await updateById({id,...fields});
    if (res) {
      const [data, err] = res
      if (!err && !data.err_code) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }

    hide();
    return false
  } catch (error) {
    hide();
    // message.success(formatMessage({ id: 'table-setting-failure' }));
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
    const res = await addNew({
      ...fields,
    });

    if (res) {
      const [data, err] = res
      if (!err && !data.err_code) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
      message.error(data.err_msg)
    }

    hide();
    return false    
  } catch (error) {
    hide();
    // message.success(formatMessage({ id: 'table-setting-failure' }));
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
      status: -1
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

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ItemType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['system', 'role']));
  }, [props.user]);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-role-name' }),
      dataIndex: 'name',
      valueType: 'textarea',
    },
    // {
    //   title: formatMessage({ id: 'table-role-org' }),
    //   dataIndex: 'org_name',
    //   hideInSearch: true,
    //   valueType: 'textarea',
    // },
    {
      title: formatMessage({ id: 'table-role-status' }),
      dataIndex: 'status',
      hideInSearch: true,
      render(text) {
        switch (text) {
          case 1:
            text = '已启用'
            break;
          case -1:
            text = '已删除'
            break
          case -2:
            text = '已禁用'
            break
        }
        return text
      }
    },
    // {
    //   title: formatMessage({ id: 'table-remark' }),
    //   dataIndex: 'remark',
    //   hideInSearch: true,
    //   valueType: 'textarea',
    // },
    {
      title: formatMessage({ id: 'table-create-time' }),
      dataIndex: 'create_time',
      valueType: 'date',
      // sorter: true,
      hideInSearch: true,
      renderText: (text) => {
        return text;
      },
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => {
        return (
          <>
            {authObj.edit && record.status !== -1  && (
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
            {authObj.delete && false && record.status !== -1  && (
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
                    }
                  });
                }}
              >
                {formatMessage({ id: 'table-delete' })}
              </a>
              <Divider type="vertical" />
              </>
            )}
            {authObj.forbidden && false && record.status !== -1  && (
              <Popconfirm
                placement={'left'}
                title={formatMessage({ id: `${record.status === 1 ? 'table-off-msg' : (record.status === -2 ? 'table-on-msg' : '')}` })}
                onConfirm={async () => {
                  try {
                    const res = await setStatusById({ id: record.id, status: record.status === 1 ? -2 : 1 })
                    if (res) {
                      const [data, err] = res
                      if (!err && !data.err_code) {
                        message.success('Success');
                        actionRef.current?.reload();
                        return
                      }
                    }
                    message.error('Failure')
                  } catch (error) {
                    message.error('Failure')
                  }
                }}
              >
                <a>{formatMessage({ id: `${record.status === 1 ? 'table-on' : record.status === -2 ? 'table-off': ''}` })}</a>
              </Popconfirm>
            )}
          </>
        )
      }
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryParamsType>
        actionRef={actionRef}
        // rowKey="_id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        // params={{
        //   sorttime: sorter,
        // }}
        // search={{
        //   collapsed: false,
        //   collapseRender: () => null,
        // }}
        search={false}
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
          const { current, pageSize, name } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            // name,
            // sorttime: sorter,
          });

          if (res === null) {
            return {
              data: [],
              success: false,
              total: 0,
              current: 0
            }
          }

          const items = res[0].items.map(item => ({...item, key: item.id}))

          return {
            data: items,
            success: true,
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
          values={{
            name: '',
          }}
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
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
