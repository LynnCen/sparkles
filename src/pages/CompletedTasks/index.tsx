/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryParamsType } from './data.d';
import { useIntl } from 'umi';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { Button, Divider, message, Modal, Popconfirm } from 'antd';
import { queryList, addNew, deleteById, updateById, cancelCompleted } from './service';
import { PlusOutlined } from '@ant-design/icons';
import ProTableIntl from '@/components/ProTableIntl';
import { UserModelState } from '@/models/user';

/**
 * 更新节点
 * @param fields
 * @param id
 */
const handleUpdate = async (
  fields: FormValueType,
  id: string,
) => {
  const hide = message.loading("正在配置");
  try {
    hide();
    await updateById({
      id,
      ...fields,
    });

    message.success("配置成功");
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 新增节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {
  const hide = message.loading("正在配置...");
  try {
    hide();
    await addNew({ ...fields });
    message.success("配置成功");
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 删除节点
 * @param itemId
 */
const handleDelete = async (itemId: string) => {
  const hide = message.loading("正在配置...");
  try {
    hide();
    await deleteById({
      id: itemId,
    });
    message.success("配置成功	");
    return true;
  } catch (error) {
    hide();
    return false;
  }
};
/**
 * 取消已完成
 * @param itemId
 */
const handleCancelCompleted = async (itemId: string, status: number = 1) => {
  const hide = message.loading("正在配置...");
  try {
    hide();
    const res = await cancelCompleted({
      id: itemId,
      status
    });

    message.success("配置成功	");
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = () => {
  const [selectedItem, setSelectedItem] = useState<ItemType | Record<string, never>>({});
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ItemType>[] = [
    {
      title: '终端',
      dataIndex: 'os',
      filters: [],
      hideInSearch: true,
      valueEnum: {
        "4": { text: 'pc', status: 4 },
        "3": { text: 'ios', status: 3 },
        "2": { text: 'android ', status: 2 },
        "1": { text: '服务端', status: 1 },
      },
      render(_, record) {
        let text: string[] = [];
        record.os.forEach((v, i) => {
          switch (v) {
            /* eslint no-case-declarations:0 */
            case 1:
              text.push('服务端');
              break;
            case 2:
              text.push('android');
              break;
            case 3:
              text.push('ios');
              break;
            case 4:
              text.push('pc');
              break;
            default:
              break;
          }
        });
        return text.toString();
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '优先级',
      dataIndex: 'level',
      hideInSearch: true,
      filters: [],
      valueEnum: {
        "3": { text: '高', status: 3 },
        "2": { text: '中  ', status: 2 },
        "1": { text: '低 ', status: 1 },
      },
      render(_, record) {
        switch (record.level) {
          case 1:
            return '低';
          case 2:
            return '中';
          case 3:
            return '高';
          default:
            break;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [],
      hideInSearch: true,
      valueEnum: {
        "2": { text: '已完成', status: 3 },
        "1": { text: '开发中', status: 2 },
        // "1": { text: '等待处理', status: 1 },
      },
      render(_, record) {
        switch (record.status) {
          // case 1:
          //   return '等待处理';
          case 1:
            return '开发中';
          case 2:
            return '已完成';
          default:
            break;
        }
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      hideInSearch: true,
      valueType: 'date',
    },
    {
      title: '更新时间',
      dataIndex: 'create_time',
      hideInSearch: true,
      valueType: 'date',

    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <>
            <a
              onClick={() => {
                setSelectedItem(record);
                const success = handleCancelCompleted(record._id)
                if (success && actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              取消已完成
            </a>
            {/* <Divider type="vertical" /> */}
          </>

          {/* <a
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure you want to delete this row of data?',
                onOk: async () => {
                  const success = handleDelete(record._id);
                  if (success && actionRef.current) {
                    actionRef.current.reload();
                  }
                },
              });
            }}
          >
            删除
          </a> */}
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryParamsType>
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        request={async (params) => {
          // @ts-ignore
          const { current, pageSize, status, os, level } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            status: 2,
            os,
            level
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
            const success = await handleAdd(value);
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
            Reflect.set(value, 'start_time', value.start_time ? value.start_time.valueOf() : null)
            Reflect.set(value, 'end_time', value.end_time ? value.end_time.valueOf() : null)

            // const start_time = value.start_time ? value.start_time.valueOf() : null;
            // const end_time = value.end_time ? value.end_time.valueOf() : null;

            const success = await handleUpdate(value, selectedItem._id);
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
export default TableList;

// export default connect(({ user }: ConnectState) => ({ user }))(TableList);
