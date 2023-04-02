import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, message, Modal, Popconfirm } from 'antd';
import {
  queryList,
  updateById,
  addNew,
  deleteById,
  queryAllCategory,
  setStatusById,
} from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { ConnectState, UserModelState } from '@/models/connect';
import getPermissionsAsObj from '@/utils/permissions';
// import ImagePreview from '@/components/MediaPreview';

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
      start_time: fields.start_time.format('YYYY-MM-DD HH:mm:ss'),
      end_time: fields.end_time.format('YYYY-MM-DD HH:mm:ss'),
      resource: JSON.stringify(fields.resource),
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
  const [allCategory, setAllCategory] = useState({});
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['moments', 'ad']));
  }, [props.user]);
  useEffect(() => {
    queryAllCategory().then(setAllCategory, console.log);
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-icon' }),
      dataIndex: 'resource',
      hideInSearch: true,
      width: 40,
      render(text, record) {
        if (record.resource[0]) {
          // return <ImagePreview previewImage={record.resource[0].url} />;
          return ''
        }
        return '-';
      },
    },
    {
      title: formatMessage({ id: 'table-userID' }),
      dataIndex: 'uid',
      width: 200,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-content' }),
      dataIndex: 'body',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-start-time' }),
      dataIndex: 'start_time',
      width: 150,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-end-time' }),
      dataIndex: 'end_time',
      width: 150,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-ad-position' }),
      dataIndex: 'num',
      valueType: 'textarea',
      width: 150,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <>
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
              title={formatMessage({ id: 'table-modal-delete' })}
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
              <a>{formatMessage({ id: 'table-delete' })}</a>
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
          // 这里更新请求参数
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
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
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
