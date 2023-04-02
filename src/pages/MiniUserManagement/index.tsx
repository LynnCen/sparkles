import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { useIntl } from 'umi';
import ProTableIntl from '@/components/ProTableIntl';
import request from '@/utils/request';

export interface ItemType {
  _id: string;
  app_id: string;
  uid: string;
  openid: string;
  session_key: string;
  expires: number;
  itime: number;
  utime: number;
}

export interface QueryType {
  page?: number;
  row?: number;
  app_id?: string;
  uid?: string;
  sorttime?: string;
}

const queryList = (params?: QueryType) => {
  return request('/applet/user/list', {
    params,
    method: 'GET',
  });
};

const TableList: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-appID' }),
      dataIndex: 'app_id',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-userID' }),
      dataIndex: 'uid',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-user-openID' }),
      dataIndex: 'openid',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-expires' }),
      dataIndex: 'expires',
      valueType: 'date',
      hideInSearch: true,
      renderText: (text) => {
        return text * 1000;
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
        request={async (params) => {
          // 这里更新请求参数
          const res = await queryList({
            page: params?.current,
            row: params?.pageSize,
            app_id: params?.app_id,
            uid: params?.uid,
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
    </PageHeaderWrapper>
  );
};

export default TableList;
