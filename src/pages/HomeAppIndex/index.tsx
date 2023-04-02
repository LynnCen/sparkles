import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Popconfirm } from 'antd';
import {
  queryList,
  updateById,
  addNew,
  deleteById,
  queryAllCategory,
  setStatusById,
  queryAllMerchant,
} from './service';
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
    await updateById({
      id,
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
 * 新增节点
 * @param fields
 * @param formatMessage
 */
const handleAdd = async (fields: FormValueType, formatMessage: (obj: { id: string }) => string) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    await addNew({
      ...fields,
      rank: fields.rank || 0,
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
      id: itemId,
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
  const [allCategory, setAllCategory] = useState({});
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});
  const [allMerchant, setAllMerchant] = useState({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['miniprogram', 'miniapp']));
  }, [props.user]);
  useEffect(() => {
    queryAllCategory().then(setAllCategory, console.log);
    queryAllMerchant().then(setAllMerchant, console.log);
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-appID' }),
      dataIndex: '_id',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-name' }),
      dataIndex: 'title',
      hideInSearch: true,
      width: 100,
      // ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-category' }),
      dataIndex: 'type',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        if (record.type === 1) return 'Game';
        return 'App';
      },
    },
    {
      title: formatMessage({ id: 'table-rank-position' }),
      dataIndex: 'rank',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      // hideInSearch: true,
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        if (record.status === 1) return formatMessage({ id: 'table-status-normal' });
        return formatMessage({ id: 'table-status-forbidden' });
      },
      valueEnum: {
        0: { text: formatMessage({ id: 'table-status-forbidden' }) },
        1: { text: formatMessage({ id: 'table-status-normal' }) },
      },
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
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
          {authObj.delete && (record.status === 1 || record.status === 0) && (
            <>
              <Popconfirm
                placement={'left'}
                title={formatMessage({ id: 'table-modal-delete' })}
                onConfirm={async () => {
                  const success = handleDelete(record._id, formatMessage);
                  if (success && actionRef.current) {
                    actionRef.current.reload();
                  }
                }}
              >
                <a>{formatMessage({ id: 'table-delete' })}</a>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          )}
          {authObj.forbidden && (record.status === 1 || record.status === 0) && (
            <Popconfirm
              placement={'left'}
              title={formatMessage({
                id: `${record.status === 1 ? 'table-off-msg' : 'table-on-msg'}`,
              })}
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
              <a>{formatMessage({ id: `${record.status === 1 ? 'table-on' : 'table-off'}` })}</a>
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryType>
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
            name: params?.name,
            app_id: params?._id,
            rank_position: params?.rank_position,
            status: params?.status !== '' ? params?.status : undefined,
            is_top: params?.is_top,
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
          allCategory={allCategory}
          allMerchant={allMerchant}
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
          allCategory={allCategory}
          allMerchant={allMerchant}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
