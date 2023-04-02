import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { NearbyCategoryType, NearbyCategoryParams } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from '@/pages/NearbyCategory/components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm, Select } from 'antd';
import { queryList, updateById, addNew, deleteById, setStatusById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { getRegionList, getLangList } from '@/services/common';
import { ConnectState, UserModelState } from '@/models/connect';
import getPermissionsAsObj from '@/utils/permissions';

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
    message.error(formatMessage({ id: 'table-setting-failure' }));
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
    message.error(formatMessage({ id: 'table-setting-failure' }));
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
    message.error(formatMessage({ id: 'table-setting-failure' }));
    return false;
  }
};

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<NearbyCategoryType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [regionList, setRegionList] = useState({});
  const [langList, setLangList] = useState({});
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});
  const [statusForQuery, setStatusForQuery] = useState('1');

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['nearby', 'nearcate']));
  }, [props.user]);
  useEffect(() => {
    getRegionList().then(setRegionList, console.log);
    getLangList().then(setLangList, console.log);
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<NearbyCategoryType>[] = [
    {
      title: formatMessage({ id: 'table-id' }),
      dataIndex: '_id',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-region' }),
      dataIndex: 'region',
      render(text, record) {
        return regionList[record.region];
      },
      filters: [],
      valueEnum: Object.keys(regionList)
        .map((region, index) => {
          return { [index]: { text: regionList[region], region } };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
    {
      title: formatMessage({ id: 'table-name' }),
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-thumbnail' }),
      dataIndex: 'thumb',
      hideInSearch: true,
      render(text, record) {
        return <img style={{ width: 40, height: 40, objectFit: 'cover' }} src={record.thumb} />;
      },
    },
    {
      title: formatMessage({ id: 'table-reorder' }),
      dataIndex: 'reorder',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      filters: [],
      // valueEnum: {
      //   1: { text: formatMessage({ id: 'table-status-normal' }), status: 1 },
      //   0: { text: formatMessage({ id: 'table-status-forbidden' }), status: 0 },
      //   2: { text: formatMessage({ id: 'table-all' }), status: 0 },
      // },
      render(_, record) {
        if (record.status === 1) return formatMessage({ id: 'table-status-normal' });
        return formatMessage({ id: 'table-status-forbidden' });
      },
      renderFormItem: () => {
        return (
          <Select onChange={setStatusForQuery} value={statusForQuery}>
            <Select.Option value={'1'}>
              {formatMessage({ id: 'table-status-normal' })}
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
      <ProTableIntl<NearbyCategoryType, NearbyCategoryParams>
        actionRef={actionRef}
        rowKey="_id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<NearbyCategoryType>;
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
          const regions = Object.keys(regionList);
          // @ts-ignore
          const { current, pageSize, region, name } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            region: regions[region],
            name,
            status: statusForQuery !== '2' ? statusForQuery : undefined,
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
            region: '',
            thumb: '',
          }}
          regions={regionList}
          langList={langList}
          addNew={true}
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
          regions={regionList}
          langList={langList}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);