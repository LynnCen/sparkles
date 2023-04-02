import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { Button, message } from 'antd';
import { ItemType, QueryParamsType } from './data.d';
import { deleteMoments, FiveElement, queryList, updateStatus } from './service';
import { connect, useIntl } from 'umi';
import ProTableIntl from '@/components/ProTableIntl';
import DetailView from './DetailView';
import getPermissionsAsObj from '@/utils/permissions';
import moment from 'moment';
import { ConnectState, UserModelState } from '@/models/connect';
import MediaPreview from '@/components/MediaPreview';

import pubImg from '@/assets/imgs/moment_icon_public.png'
import priImg from '@/assets/imgs/moment_icon_private.png'
import shrImg from '@/assets/imgs/moment_icon_share.png'
import dtImg from '@/assets/imgs/moment_icon_dongt.png'
import cImg from '@/assets/imgs/moment_icon_contact.png'
import { downloadAws } from '@/utils/aws';

interface PropsType {
  user?: UserModelState;
}

// const data = record.media.map(({url, width, height, id}, index) => ({url, originWidth: width,originHeight: height, key: `_${index + 1}`, id }))
// return <MediaPreview type='image' sourceList={data} />
const TableList: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [authObj, setAuthObj] = useState<{ [x: string]: boolean }>({});

  const [value, setValue] = useState<ItemType>()
  const [detailVisible, setDetailVisible] = useState<boolean>(false)

  useEffect(() => {
    // @ts-ignore
    setAuthObj(getPermissionsAsObj(props.user.currentUser.access, ['moments']));
  }, [props.user]);

  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-userID' }),
      dataIndex: 'uid',
    },
    {
      title: formatMessage({ id: 'table-username' }),
      dataIndex: 'username',
    },
    {
      title: formatMessage({ id: 'table-phone' }),
      dataIndex: 'phone',
      hideInTable: true
    },
    {
      title: formatMessage({ id: 'table-content' }),
      dataIndex: 'text',
      valueType: 'textarea',
      width: 200,
      ellipsis: true,
      hideInTable: true
    },
    {
      title: formatMessage({ id: 'table-moment-visible' }),
      dataIndex: 'auth_type',
      hideInSearch: true,
      render(val) {
        switch(val) {
          case 1: 
            return (
              [
                <img src={pubImg} key='img' />,
                <span key='text'>&nbsp;&nbsp;公开</span>
              ]
            )
          case 2: 
          return (
            [
              <img src={priImg} />,
              <span>&nbsp;&nbsp;私密</span>
            ]
          )
          case 3: 
          return (
            [
              <img src={cImg} />,
              <span>&nbsp;&nbsp;好友</span>
            ]
          )
          case 4: 
          return (
            [
              <img src={shrImg} />,
              <span>&nbsp;&nbsp;部分人可见</span>
            ]
          )
          case 5: 
          return (
            [
              <img src={dtImg} />,
              <span>&nbsp;&nbsp;部分人不可见</span>
            ]
          )
        }

        return '-'
      }
    },
    {
      title: 'Moments' + formatMessage({ id: 'table-content' }),
      dataIndex: 'content',
      hideInSearch: true,
      render(_, record) {
        switch (record.content_type) {
          case 1:
            return record.text
          default:
            return '-'
        }
      },
      ellipsis: true
    },
    {
      title: formatMessage({ id: 'table-moment-publish' }),
      dataIndex: 'create_time',
      hideInSearch: true,
      render(val) {
        return moment(val as string).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'status',
      hideInSearch: true,
      render(val) {

        if (val === 1) {
          val = '正常'
        } else if (val === -1) {
          val = '已隐藏'
        } else {
          val = '删除'
        }
        return val
      }
    },
    {
      title: formatMessage({ id: 'table-action' }),
      dataIndex: 'option',
      valueType: 'option',
      render(_, record) {
        return [
          (
          <Button 
            type='link'
            onClick={() => {handleEdit(record)}}
            key='edit'
          >
            { formatMessage({ id: 'table-moment-detail' }) }
          </Button>
          ),
        ]
      }
    }
  ];

  const handleEdit = (record: ItemType) => {
    
    setValue(record)
    setDetailVisible(true)
  }

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryParamsType>
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<ItemType>;
          if (sorterResult.field) {
            setSorter(sorterResult.order === 'ascend' ? '1' : '-1');
          }
        }}
        params={{
        }}
        search={{
          // collapsed: true,
          // collapseRender: () => null,
        }}
        request={async (params) => {
          // @ts-ignore
          const { current, pageSize, text: content, uid, phone, username } = params;
          
          const res = await queryList({
            page: current,
            row: pageSize,
            uid,
            content,
            phone,
            username
          });

          if (res) {
            const [data, err] = res
            if (!err) {
              const items: ItemType[] = []

              for(let i = 0; i < data.items.length; i++) {
                const item = data.items[i]

                const username = data.userinfo.find(user => user.id === item.uid)?.data.username

                items.push({
                  key: item.id,
                  uid: item.uid,
                  id: item.id,
                  username: username || '',
                  text: item.text,
                  media: item.media,
                  create_time: item.create_time,
                  auth_type: item.auth_type,
                  content_type: item.content_type,
                  status: item.status
                })
              }

              return {
                data: items,
                success: !data.err_code,
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
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        value={value as ItemType}
        handleUpdate={async (status, id) => {
          const hide = message.loading('操作中...')

          try {
            const res = await updateStatus({id, status})
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

export default connect(({user}: ConnectState) => ({user}))(TableList)
// export default TableList;
