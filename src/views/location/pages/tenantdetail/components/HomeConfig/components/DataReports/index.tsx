/**
 * @Description 数据报表
 */
import React, { useEffect, useMemo, useState } from 'react';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { CardLayout } from '../CardLayout';
import { isArray } from '@lhb/func';
import Personal from './Personal';
import Depart from './Depart';

interface DataReportsProps {
  data?: any;
  title: string;
}

const TAB_ID_PERSONNAL = 23; // '个人绩效报表'id固定
const TAB_ID_DEPART = 24; // '开发部绩效报表'id固定

const DataReports: React.FC<DataReportsProps> = (props) => {
  const { data, title } = props;

  const [tabItems, setTabItems] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const items = isArray(data) && data.length ? data.map((itm, idx) => ({
      key: `${idx}`,
      label: itm.title,
      id: itm.id,
    })) : [];
    setTabItems(items);
    setActiveKey(items.length ? items[0].key : '');
    setFilters({});
  }, [data]);

  const curTabItem = useMemo(() => {
    if (!activeKey) return {};
    const targetTab = tabItems.find(itm => itm.key === activeKey);
    return targetTab || {};
  }, [activeKey]);

  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  return <CardLayout title={title}>
    <V2Tabs
      type='fullCard'
      items={tabItems}
      activeKey={activeKey}
      onChange={onTabChange}
    />
    {curTabItem.id === TAB_ID_PERSONNAL ? <Personal
      filters={filters}
      className='mt-20'
    /> : <></>}
    {curTabItem.id === TAB_ID_DEPART ? <Depart
      filters={filters}
      className='mt-20'
    /> : <></>}
  </CardLayout>;
};

export default DataReports;
