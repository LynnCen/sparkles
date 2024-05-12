/* eslint-disable react-hooks/exhaustive-deps */
// 停留数据/关注数据
import React, { useEffect, useMemo, useState } from 'react';
import CustomerTabs from '@/common/components/business/CustomerTabs';
import Table from '@/common/components/FilterTable';
import { get } from '@/common/request/index';
import { AreaModuleProps } from '@/views/analysis/pages/index/ts-config';

const TABS = [
  { label: '停留数据', value: 'retention' },
  // { label: '关注数据', value: 'attention' },
];

// 关注数据columns
const FocusColumn = [
  { key: 'name', title: '区域名称' },
  { key: 'duration', title: '平均关注时长' },
  { key: 'personTime', title: '停留总人次' },
  { key: 'notice', title: '注意人次' },
  { key: 'interest', title: '感兴趣人次' },
  { key: 'tendToBuy', title: '倾向购买人次' },
];

const AreaModule: React.FC<AreaModuleProps> = React.memo(({
  filters,
  store
}) => {
  const [activeTab, setActiveTab] = useState<string>('retention');
  const [columns, setColumns] = useState<any[]>([]);
  const { start, end, storeIds } = filters;
  const tableParams = { start, end, storeId: storeIds };

  // 停留数据columns
  const stopColumn = useMemo(() => {
    let duration = 30;
    if (store && store.duration) {
      duration = store.duration;
    }
    return [
      { key: 'name', title: '区域名称' },
      { key: 'durationAvg', title: '平均停留时长' },
      { key: 'flowDurationCount', title: '停留总人次' },
      { key: 'flowGeCount', title: `>${duration}s停留人次` },
      { key: 'flowLeCount', title: `<${duration}s停留人次` },
    ];
  }, [store]);

  useEffect(() => {
    if (start && end) {
      switch (activeTab) {
        case 'retention':
          setColumns(stopColumn);
          break;
        case 'attention':
          setColumns(FocusColumn);
          break;
      }
    }
  }, [start, end, activeTab, store]);

  // 获取客流统计表格数据
  const loadData = async (params: any) => {
    if (!params.start) return { dataSource: [] };
    let result: any[] = [];
    switch (activeTab) {
      case 'retention':
        // https://yapi.lanhanba.com/project/297/interface/api/33359
        result = await get('/store/durations', params);
        break;
      case 'attention':
        //  https://yapi.lanhanba.com/project/297/interface/api/33358
        result = await get('/store/attentions', params);
        break;
    }
    return {
      dataSource: result || [],
    };
  };

  return (
    <>
      <CustomerTabs tabs={TABS} onChange={(value) => setActiveTab(value)} />
      <Table
        rowKey='index'
        columns={columns}
        filters={tableParams}
        onFetch={loadData}
        pagination={false}
      />
    </>
  );
});

export default AreaModule;
