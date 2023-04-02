import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryParamsType } from './data.d';
import { connect, useIntl } from 'umi';
import { queryList, setStatusById } from './service';
import ProTableIntl from '@/components/ProTableIntl';
import DetailModal from './components/DetailModal';
import { Button, Divider, message, Popconfirm } from 'antd';
import { ConnectState, UserModelState } from '@/models/connect';
import FormModal from './components/FormModal';
import { updateStatus } from './service';
import getPermissionsAsObj from '@/utils/permissions';

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const [id, setId] = useState<string>('')
  const [status, setStatus] = useState<number>() 

  const [formModalVisible, setFormModalVisible] = useState<boolean>(false)

  const actionRef = useRef<ActionType>();
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  useEffect(() => {
    
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['usermanager' , 'user']));
  }, [props.user]);
  const columns: ProColumns<ItemType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: formatMessage({ id: 'table-tmmID' }),
      dataIndex: 'tmm_id',
    },
    {
      title: formatMessage({ id: 'table-phone' }),
      dataIndex: 'phone',
    },
    {
      title:'用户名',
      dataIndex: 'username',
      hideInTable: true
    },
    {
      title: 'first name',
      dataIndex: 'f_name',
      hideInSearch: true
    },
    {
      title: 'last name',
      dataIndex: 'l_name',
      hideInSearch: true
    },
    {
      title: formatMessage({ id: 'table-create-time' }),
      dataIndex: 'create_time',
      valueType: 'date',
      sorter: {
        compare: (a, b) => (a.create_time - b.create_time),
        multiple: 1
      },
      hideInSearch: true,
      renderText: (text) => {
        return text;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render(val) {
        if (val === 1) {
          return '正常'
        } else if(val === -1) {
          return '已禁用'
        } else if (val === -2) {
          return '已删除'
        }
      }
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <>
          {authObj.forbidden && record.status !== -2 && record.status !== -1 && (
            <>
            <Button
              type='link'
              onClick={() => {
                  setStatus(record.status)
                  setId(record.id)
                  setFormModalVisible(true)
              }}
            >
              {formatMessage({ id: `${'table-on'}` })}
            </Button>
              {/* <Popconfirm
                placement={'left'}
                title=
                onConfirm={() => {
                  setStatusById({ id: record.id, status: record.status === 1 ? 0 : 1 }).then(
                    () => {
                      message.success('Success');
                      actionRef.current?.reload();
                    },
                    () => message.error('Failure'),
                  );
                }}
              >
                <a>{formatMessage({ id: `${record.status ? 'table-on' : 'table-off'}` })}</a>
              </Popconfirm> */}
            </>
          )}
        </>
      ),
    },
  ];


  const handleUpdate = async (vals) => {
    const hide = message.loading('操作中', 0)

    const res = await updateStatus({
      id: id,
      status: status === 1 ? -1 : 1 ,
      reason: status === 1 ? vals.content : ''
    })

    if (res) {
      const [data, err] = res
      if (!err && data.err_code === 0) {
        hide()
        message.success('设置成功')
        setFormModalVisible(false)
        if (actionRef.current) {
          actionRef.current?.reload()
        }

        return
      } 
    } 

    message.error('设置失败')
    hide()
  }

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
        search={{
          collapsed: false,
          collapseRender: () => null,
        }}
        request={async (params) => {
          // @ts-ignore
          const { current, pageSize, phone, username, tmm_id } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            phone,
            username,
            tmm_id
          });

          if (res) {

            const [data, err] = res

            if (!err) {
              return {
                data: data.items,
                success: true,
                total: data.count,
                page: data.page
              }
            }


          }

          return {
            data: [],
            success: false,
            total: 0,
            current: 0,
          };
        }}
        columns={columns}
      />
      { true && (
        <FormModal 
          formModalVisible={formModalVisible}
          onCancel={() => setFormModalVisible(false)}
          onSubmit={handleUpdate}
          status={status}
        />
      )}
      {modalVisible && <DetailModal id={selectedId} onCancel={() => setModalVisible(false)} />}
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(TableList);
