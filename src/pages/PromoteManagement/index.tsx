import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryParamsType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm, Select } from 'antd';
import { queryList, updateById, addNew, deleteById, setStatusById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { UserModelState } from '@/models/user';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState } from '@/models/connect';

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
    const res = await updateById({
      id,
      ...fields,
    });
    console.log(res);
    hide();
    message.success(formatMessage({ id: 'table-setting-finished' }));
    return true;
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
    await addNew({
      ...fields,
    });
    hide();

    message.success(formatMessage({ id: 'table-setting-finished' }));
    return true;
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
    await deleteById({
      _id: itemId,
    });
    hide();

    message.success(formatMessage({ id: 'table-setting-finished' }));
    return true;
  } catch (error) {
    hide();
    // message.success(formatMessage({ id: 'table-setting-failure' }));
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
  const [statusForQuery, setStatusForQuery] = useState('1');

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['setting', 'promote']));
  }, [props.user]);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-appID' }),
      dataIndex: '_id',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-secret' }),
      dataIndex: 'secret',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'table-machID' }),
      dataIndex: 'mch_id',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-machname' }),
      dataIndex: 'mch_name',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      filters: [],
      render(_, record) {
        if (record.status === 1) return formatMessage({ id: 'table-status-normal' });
        if (record.status === -1) return formatMessage({ id: 'table-status-deleted' });
        return formatMessage({ id: 'table-status-forbidden' });
      },
      renderFormItem: () => {
        return (
          <Select onChange={setStatusForQuery} value={statusForQuery}>
            <Select.Option value={'1'}>
              {formatMessage({ id: 'table-status-normal' })}
            </Select.Option>
            <Select.Option value={'-1'}>
              {formatMessage({ id: 'table-status-deleted' })}
            </Select.Option>
            <Select.Option value={'0'}>
              {formatMessage({ id: 'table-status-forbidden' })}
            </Select.Option>
            <Select.Option value={'2'}>{formatMessage({ id: 'table-all' })}</Select.Option>
          </Select>
        );
      },
    },
    {
      title: formatMessage({ id: 'table-itime' }),
      dataIndex: 'itime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
      renderText: (text) => {
        return text * 1000;
      },
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <>
          {authObj.edit && (
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
          {authObj.delete && false && (
            <a
              onClick={() => {
                Modal.confirm({
                  title: formatMessage({ id: 'table-modal-delete' }),
                  onOk: async () => {
                    const success = handleDelete(record._id, formatMessage);
                    if (success && actionRef.current) {
                      actionRef.current.reload();
                    }
                  },
                });
              }}
            >
              {formatMessage({ id: 'table-delete' })}
            </a>
          )}
          {authObj.forbidden && (
            <Popconfirm
              placement={'left'}
              title={formatMessage({ id: `${record.status ? 'table-off-msg' : 'table-on-msg'}` })}
              onConfirm={() => {
                setStatusById({ id: record._id, status: record.status === 1 ? 0 : 1 }).then(
                  () => {
                    message.success('Success');
                    actionRef.current?.reload();
                  },
                  () => message.error('Failure'),
                );
              }}
            >
              <a>{formatMessage({ id: `${record.status ? 'table-on' : 'table-off'}` })}</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryParamsType>
        actionRef={actionRef}
        rowKey="_id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        params={{
          sorttime: sorter,
        }}
        search={{
          collapsed: false,
          collapseRender: () => null,
        }}
        onReset={() => {
          setStatusForQuery('1');
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
          // 这里更新请求参数
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
            // status: params?.status,
            status: statusForQuery !== '2' ? statusForQuery : undefined,
            name: params?.name,
            sorttime: sorter,
          });
          return {
            data: res.data,
            success: true,
            total: res.count,
            current: res.page,
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
        />
      )}
      {selectedItem && Object.keys(selectedItem).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value, selectedItem._id, formatMessage);
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
