import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm } from 'antd';
import { queryList, updateById, addNew, deleteById, setStatusById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import { getAllCategory, getAllProperty } from '@/pages/NearbyCategoryTrans/service';
// import ImagePreview from '@/components/MediaPreview';
import ProTableIntl from '@/components/ProTableIntl';
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
      photos: JSON.stringify(fields.photos?.map((img) => img.url || img)),
      location: JSON.stringify(fields.location),
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
      location: JSON.stringify(fields.location),
      photos: JSON.stringify(fields.photos?.map((img) => img.url || img)),
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
  const [cates, setCates] = useState<Record<string, string>[]>([]);
  const [properties, setProperties] = useState<Record<string, string>[]>([]);

  const [selectedItem, setSelectedItem] = useState<ItemType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['nearby', 'catemch']));
  }, [props.user]);

  useEffect(() => {
    getAllCategory().then(setCates, console.log);
    getAllProperty().then(setProperties, console.log);
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-name' }),
      label: formatMessage({ id: 'table-name' }),
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'menu.nearby.category' }),
      dataIndex: 'cate_name',
      filters: [],
      valueEnum: Object.keys(cates)
        .map((category) => {
          return { [category]: { text: cates[category], cate_id: category } };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
    {
      title: formatMessage({ id: 'table-property' }),
      dataIndex: 'pro_name',
      filters: [],
      valueEnum: Object.keys(properties)
        .map((property) => {
          return { [property]: { text: properties[property], pro_id: property } };
        })
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
    {
      title: formatMessage({ id: 'table-thumbnail' }),
      dataIndex: 'thumb',
      hideInSearch: true,
      render(text, record) {
        if (!record.thumb) return '-';
        // return <ImagePreview previewImage={record.thumb} />;
      },
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-introduction' }),
      dataIndex: 'intro',
      hideInSearch: true,
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
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
            name: params?.name,
            cate_id: params?.cate_name,
            pro_id: params?.pro_name,
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
          cates={cates}
          properties={properties}
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
          cates={cates}
          properties={properties}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};
export default connect(({ user }: ConnectState) => ({ user }))(TableList);
