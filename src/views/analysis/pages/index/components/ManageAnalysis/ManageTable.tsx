// 经营分析-明细表
import React, { useEffect, useMemo, useState } from 'react';
import Table from '@/common/components/FilterTable';
import { get } from '@/common/request/index';
import { valueFormat } from '@/common/utils/ways';
import { FiltersProps, StoreFormData } from '@/views/analysis/pages/index/ts-config';

const defaultRender = { width: 170, render: (value: number) => valueFormat(value) };

// 基本信息列，总是显示
const basicColumns = [
  { title: '日期', key: 'date', width: 170, fixed: 'left' },
  { title: '进店客流量', key: 'indoorCount', ...defaultRender },
  { title: '过店客流量', key: 'passByCount', ...defaultRender },
  { title: '进店顾客数（人）', key: 'customerCount', ...defaultRender },
  { title: '进店客户组（个）', key: 'customerBatchCount', ...defaultRender },
  { title: '进店率（%）', key: 'indoorPercentage', ...defaultRender },
];

// 订单相关列
const orderColumns = [
  { title: '店内订单（笔）', key: 'storeOrderCount', ...defaultRender },
  { title: '转化率（%）', key: 'conversionPercentage', ...defaultRender },
  { title: '店内销售额（元）', key: 'storeSaleAmount', ...defaultRender, width: 140 },
];

// 详情中所属行业为非“餐饮美食”“快销品“时，隐藏
const industryColumns = [
  { title: '美团订单（笔）', key: 'mtOrderCount', ...defaultRender, width: 150 },
  { title: '饿了么订单（笔）', key: 'elOrderCount', ...defaultRender, width: 150 },
];

// 订单总计相关列
const orderTotalColumns = [
  { title: '总订单（笔）', key: 'orderCount', ...defaultRender },
  { title: '总销售额（元）', key: 'saleAmount', ...defaultRender },
];

interface Props {
  industry: boolean;
  filters: FiltersProps;
  store: any;
  hasOrderPermission?: boolean;
}

const ManageTable: React.FC<Props> = React.memo(({ filters, industry, store, hasOrderPermission }) => {
  const { start, end, dateScope, storeIds: storeId } = filters;
  const [columns, setColumns] = useState<any[]>([]);

  // 停留数据columns
  const stopColumns = useMemo(() => {
    let duration = 30;
    if (store && store.duration) {
      duration = store.duration;
    }
    return [
      { key: 'numberOfGtCount', title: `>${duration}s停留人次`, ...defaultRender },
      { key: 'numberOfLeCount', title: `<${duration}s停留人次`, ...defaultRender },
    ];
  }, [store]);

  useEffect(() => {
    if (hasOrderPermission) {
      setColumns(industry ? [
        ...basicColumns,
        ...stopColumns,
        ...orderColumns,
        ...industryColumns,
        ...orderTotalColumns,
      ] : [
        ...basicColumns,
        ...stopColumns,
        ...orderColumns,
        ...orderTotalColumns,
      ]);
    } else {
      setColumns([
        ...basicColumns,
        ...stopColumns,
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry, stopColumns]);

  // 获取客流统计表格数据
  const loadData = async (params: any) => {
    if (!params.start || !params.end) return;
    const result: StoreFormData = await get('/store/formData', params);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  return (
    <Table
      rowKey='date'
      scroll={{ x: 'max-content', y: 500 }}
      columns={columns}
      filters={{ start, end, dateScope, storeId }}
      onFetch={loadData}
    />
  );
});

export default ManageTable;
