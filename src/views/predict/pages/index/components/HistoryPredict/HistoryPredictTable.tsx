/* eslint-disable react-hooks/exhaustive-deps */
// 历史预测表格

import React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Table from '@/common/components/FilterTable';
import { isNotEmpty } from '@lhb/func';
import { predictList } from '@/common/api/predict';
import { HistoryTableProps, PredictHistoryListResult, ObjectList } from '@/views/predict/pages/index/ts-config';

const HistoryPredictTable: React.FC<HistoryTableProps> = ({ filters, changeUploadStatus }) => {
  const columns = [
    { title: '门店名称', key: 'storeName' },
    {
      title: '实际过店客流/预估日均过店',
      key: 'actualPassbyCount',
      render: (value: number, record: ObjectList) =>
        renderData(value, record, 'predictPassbyCount', 'passbyCountStatus'),
    },
    {
      title: '实际进店客流/预估日均进店',
      key: 'actualIndoorCount',
      render: (value: number, record: ObjectList) =>
        renderData(value, record, 'predictIndoorCount', 'indoorCountStatus'),
    },
    {
      title: '实际进店率（%）/预估日均进店率（%）',
      key: 'actualIndoorRate',
      render: (value: number, record: ObjectList) =>
        renderData(value, record, 'predictIndoorRate', 'indoorRateStatus', '%'),
    },
    {
      title: '实际日均订单（笔）/预估日均订单（笔）',
      key: 'actualOrder',
      render: (value: number, record: ObjectList) => renderData(value, record, 'predictOrder', 'orderStatus'),
    },
    {
      title: '实际日均销售额（元）/预估日均销售额（元）',
      key: 'actualSaleAmount',
      render: (value: number, record: ObjectList) =>
        renderData(value, record, 'predictSaleAmount', 'saleAmountStatus', '¥'),
    },
  ];

  const dealWithValue = (value, unit?: string) => {
    if (!isNotEmpty(value)) {
      return '-';
    }
    switch (unit) {
      case '%':
        return `${value}%`;
      case '¥':
        return `¥${value}`;
      default:
        return value;
    }
  };

  const renderData = (value: number, record: ObjectList, actualKey: string, status: string, unit?: string) => {
    const actualValue = dealWithValue(value, unit);
    const predictValue = dealWithValue(record[actualKey], unit);
    const statusValue = record[status];
    const data = `${actualValue}/${predictValue}`;
    return (
      <>
        {statusValue === -1 && <CaretDownOutlined style={{ color: '#52C41A', marginRight: '4px' }} />}
        {statusValue === 1 && <CaretUpOutlined style={{ color: '#F5222D', marginRight: '4px' }} />}
        {data}
      </>
    );
  };

  // 获取客流统计表格数据
  const loadData = async (params: any) => {
    if (!params.storeIds || !params.month) return { dataSource: [], count: 0 };
    const result: PredictHistoryListResult = await predictList(params);
    changeUploadStatus();
    return {
      dataSource: result.objectList || [],
      count: result.totalNum || 0,
    };
  };

  return <Table rowKey='storeName' filters={filters} columns={columns} onFetch={loadData} />;
};

export default HistoryPredictTable;
