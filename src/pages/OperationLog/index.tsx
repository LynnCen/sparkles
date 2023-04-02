import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { ItemType, QueryParams } from './data.d';
import { queryList } from './service';
import { useIntl } from 'umi';
import ProTableIntl from '@/components/ProTableIntl';

const TableList: React.FC<{}> = () => {
  const { formatMessage } = useIntl();
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ItemType>[] = [
    {
      title: formatMessage({ id: 'table-itime' }),
      dataIndex: 'itime',
      valueType: 'date',
      sorter: true,
      renderText: (text) => {
        return text * 1000;
      },
    },
    {
      title: formatMessage({ id: 'table-requestMethod' }),
      dataIndex: 'method',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-name' }),
      dataIndex: 'u_name',
      valueType: 'textarea',
    },
    {
      title: formatMessage({ id: 'table-ip' }),
      dataIndex: 'ip',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-respStatus' }),
      dataIndex: 'is_suc',
      hideInSearch: true,
      render(_, record) {
        if (record.is_suc) return formatMessage({ id: 'word.yes' });
        return formatMessage({ id: 'word.no' });
      },
    },
    {
      title: 'URL',
      dataIndex: 'ctr',
      hideInSearch: true,
    },
    {
      title: formatMessage({ id: 'table-description' }),
      dataIndex: 'm_desc',
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTableIntl<ItemType, QueryParams>
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
          // @ts-ignore
          const { current, pageSize, itime, u_name, method, m_desc } = params;
          const res = await queryList({
            page: current,
            row: pageSize,
            itime,
            u_name,
            method,
            m_desc,
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
