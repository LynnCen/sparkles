import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryType } from './data.d';
import { queryList, updateStatus } from './service';
import { connect, useIntl } from 'umi';
import ProTableIntl from '@/components/ProTableIntl';
import DetailView, { ValueType } from './DetailView';
import getPermissionsAsObj from '@/utils/permissions';
import { ConnectState, UserModelState } from '@/models/connect';
import { Button, message } from 'antd';
import moment from 'moment';
import { FiveElement } from '../MomentManagement/service';

interface PropsType {
  user?: UserModelState;
}

const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [detialVisible, setDetailVisible] = useState<boolean>(false)
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  const columns: ProColumns<ItemType>[] = [
    {
      title: '用户id',
      dataIndex: 'uid',
      hideInTable: true
    },
    {
      title: '用户昵称',
      dataIndex: 'username',
      hideInTable: true
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      hideInTable: true
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInTable: true
    },
    {
      title: '举报人ID',
      dataIndex: 'uid',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '举报人昵称',
      dataIndex: 'username',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '被举报人ID',
      dataIndex: 'uid_by',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '被举报人昵称',
      dataIndex: 'username_by',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '举报内容',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: false
    },
    {
      title: '发布时间',
      dataIndex: 'create_time',
      hideInSearch: true,
      render(val) {
        if (typeof val !== 'number') return val
        
        return moment(Number(val)).format('YYYY-MM-DD HH:mm:ss')

      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        if (val === 1) {
          val = '已处理'
        } else if (val === -1) {
          val = '未处理'
        } else if (val === 2) {
          val = '处理并隐藏'
        }

        return val
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'blak',
      render(_, record) {
        return [
          true && (
            <Button key='edit' onClick={() => handleEidt(record)} type='link'>查看详情</Button>
          )
        ]
      }
    }

  ];

  const [value, setValue] = useState<ValueType>()

  const handleEidt = (record: ItemType) => {
    setValue({
      id: record.key,
      uid: record.uid,
      uid_by: record.uid_by,
      username: record.username,
      username_by: record.username_by,
      content: record.content,
      auth_type: record.auth_type,
      text: record.text,
      media: record.media,
      status: record.status,
      content_type: record.content_type
    })
    setDetailVisible(true)
  }

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['system']));
  }, [props.user]);

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryType>
        search={true}
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        request={async (params) => {
          let param: typeof params = {}
          if (params) {
            Object.keys(params).forEach(key => {
              if (key !== '_timestamp') {
                if (param) param[key] = params[key]
              }
            })
          }
          
          // 这里更新请求参数
          const res = await queryList({
            ...param,
            page: param?.current,
            row: param?.pageSize,
          });

          if (res) {
            const [data, err] = res
            if (!err) {
              const { items, moments, userinfo } = data
              
              const finData: ItemType[] = items.map(item => {
                const key = item.id

                const uid = item.uid
                const username = userinfo.find(user => uid === user.id)?.data.username

                const mid = item.mid
                const moment = moments.find(moment => mid === moment.id)
                const uid_by = moment?.data.uid
                const username_by = userinfo.find(user => uid_by === user.id)?.data.username
               
                const content = item.content
                const create_time = item.create_time
                const status = item.status

                return {
                  key,
                  uid,
                  username: username || '',
                  uid_by: uid_by || '',
                  username_by: username_by || '',
                  content,
                  create_time,
                  status,
                  media: moment?.data.media || [],
                  content_type: moment?.data.content_type as number,
                  auth_type: moment?.data.auth_type as number,
                  text: moment?.data.text || ''
                }
              })
              
              return {
                data: finData,
                success: true,
                total: data.count,
                current: data.page
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

      <DetailView
        visible={detialVisible}
        onCancel={() => setDetailVisible(false)}
        value={value as ValueType}
        handleUpdate={async (id, status) => {
          const hide = message.loading('操作中...')

          try {
            const res = await updateStatus(id, status)
            if (res) {
              const [data, err] = res
              if (!err && !data.err_msg) {
                hide();
                message.success('操作成功！')
                setDetailVisible(false)
                if (actionRef.current) {
                  actionRef.current.reload()
                }
                return
              }
            }

            hide() 
          } catch (error) {
            hide()
          }
        }}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({user}: ConnectState) => ({user}))(TableList);
