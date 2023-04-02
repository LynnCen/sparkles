import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemParamsType, ItemType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Popconfirm } from 'antd';
import { queryList, updateById, addNew, setStatusById } from './service';
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
  id: number,
  formatMessage: (obj: { id: string }) => string,
) => {
  const hide = message.loading(formatMessage({ id: 'table-setting-loading' }));
  try {
    await updateById({
      id,
      name: fields.name,
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
      name: fields.name,
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

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['nearby', 'nearcate']));
  }, [props.user]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-category-name' }),
      dataIndex: 'name',
      valueType: 'textarea',
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
      <ProTableIntl<ItemType, ItemParamsType>
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
          // @ts-ignore
          const { current, pageSize, name } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            name,
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
          values={{
            name: '',
          }}
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
