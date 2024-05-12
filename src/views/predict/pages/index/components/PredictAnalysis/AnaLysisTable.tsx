// 预测分析表格

import React from 'react';
import Table from '@/common/components/FilterTable';
import { predictList } from '@/common/api/predict';
import { HistoryTableProps, PredictHistoryListResult } from '@/views/predict/pages/index/ts-config';

const columns = [
  { title: '门店名称', key: 'storeName' },
  { title: '预估日均过店', key: 'predictPassbyCount' },
  { title: '预估日均进店', key: 'predictIndoorCount' },
  { title: '预估日均进店率（%）', key: 'predictIndoorRate' },
  { title: '预估日均订单数（笔）', key: 'predictOrder' },
  { title: '预估日均销售额（元）', key: 'predictSaleAmount' },
];

const AnaLysisTable: React.FC<HistoryTableProps> = ({ filters, changeUploadStatus, isCheckDone }) => {
  // 获取客流统计表格数据
  const loadData = async (params: any) => {
    // 检验通过且有参数才进行请求
    if (!params.month || !isCheckDone) return { dataSource: [] };
    const result: PredictHistoryListResult = await predictList(params);
    changeUploadStatus();
    return {
      dataSource: result.objectList || [],
      count: result.totalNum || 0,
    };
  };

  return <Table rowKey='storeName' filters={filters} columns={columns} onFetch={loadData} />;
};

export default AnaLysisTable;
