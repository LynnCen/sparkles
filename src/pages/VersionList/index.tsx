import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, ItemParamsType } from './data.d';
import { connect, useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Popconfirm } from 'antd';
import { queryList, updateById, addNew, deleteById, setStatusById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { getLangList } from '@/services/common';
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
      ...fields,
      id,
      // android_log: fields.android_log?.length ? JSON.stringify(fields.android_log) : '',
      // ios_log: fields.ios_log?.length ? JSON.stringify(fields.ios_log) : '',
    });
    if (res) {
      const [data, err] = res
      if (!err && !data.err_msg) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;

      }
    }
    
    hide()
    return false;
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
    const res = await addNew({...fields});
    
    if (res) {
      const [data, err] = res
      if (!err && !data.err_msg) {
        hide();
        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
        
      }
    }
    
    hide();
    return false;
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
    const res = await deleteById({
      id: itemId,
    });
    if (res) {
      const [data, err] = res 
      if (!err && data.err_code === 0) {
        hide();

        message.success(formatMessage({ id: 'table-setting-finished' }));
        return true;
      }
    }

    hide()
    return false
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
  const [langObj, setLangObj] = useState({});
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['setting', 'version']));
  }, [props.user]);
  useEffect(() => {
    getLangList().then(
      (resArr) => {
        if (resArr) {
          const [ res, err ] = resArr
          if (!err && res.err_code === 0) {
            const data = res.items.reduce((res, nex) => {
              return {...res, [nex.id]: [nex.name]}
            }, {})
            setLangObj(data)
          }
        }
        
      },
      (e) => console.log(e),
    );
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-lang' }),
      dataIndex: 'lang',
      valueType: 'textarea',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
      render(_, record) {
        return langObj[record.lang];
      },
    },
    {
      title: formatMessage({ id: 'table-version' }),
      dataIndex: 'version',
      valueType: 'textarea',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'table-type' }),
      dataIndex: 'type',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
      render(_, record) {
        if (record.type === 1) return <span>{formatMessage({ id: 'platform.IOS' })}</span>;
        if (record.type === 2) return <span>{formatMessage({ id: 'platform.Android' })}</span>;
        if (record.type === 3) return 'Window'
        return <span>Mac</span>;
      },
    },
    {
      title: '是否强制更新',
      dataIndex: 'is_forced',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
      render(_, record) {
        if (record.is_forced === 1) return formatMessage({ id: 'word.yes' });
        return formatMessage({ id: 'word.no' });
      },
    },
    {
      title: '日志记录',
      dataIndex: 'logs',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
      render(text, record) {
        return record.logs?.map((item, i) => {
          return <p key={i}>{`${item.title}:${item.log.join(',')}`}</p>;
        });
      },
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      width: 100,
      ellipsis: true,
      render(_, record) {
        if (record.status === 1) return formatMessage({ id: 'table-status-normal' });
        if (record.status === -1) return formatMessage({ id: 'table-status-deleted' });
        return formatMessage({ id: 'table-status-forbidden' });
      },
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <>
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
          {authObj.delete && record.status !== -1 && (
            <>
              <Popconfirm
                placement={'left'}
                title={formatMessage({ id: 'table-modal-delete' })}
                onConfirm={async () => {
                  const success = await handleDelete(record.id, formatMessage);
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
          {authObj.forbidden && record.status !== -1 && (
            <Popconfirm
              placement={'left'}
              title={formatMessage({ id: `${record.status === 1 ? 'table-off-msg' : 'table-on-msg'}` })}
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
              <a>{formatMessage({ id: `${record.status === 1 ? 'table-on' : 'table-off'}` })}</a>
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
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        // params={{
        //   sorttime: sorter,
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
          //这里更新请求参数
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
          });
          if (res) {
            const [data, err] = res
            if (!err) {

              const items = data.items.map(item => ({...item, key: item.id}))

              return {
                data: items,
                success: !data.err_code,
                total: data.count,
                current: data.page,
              };
            }

          }
          
          return {
            data: [],
            success: false,
            total: 0,
            current: 0
          }
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
          langObj={langObj}
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
          langObj={langObj}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
