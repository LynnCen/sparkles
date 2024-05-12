/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 该组件作为一个children传入tabs组件中，每次切换tab都相当于传入一个新的组件
 */
import React, { useEffect, useState } from 'react';
import Table from '@/common/components/FilterTable';
import { get } from '@/common/request/index';
import { valueFormat } from '@/common/utils/ways';
import { CustomTableProps } from '../ts-config';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { Button } from 'antd';
import { refactorPermissions } from '@lhb/func';

const defaultColumnsConfig = {
  render: (value: number) => valueFormat(value, '人'),
};

const CustomTable: React.FC<CustomTableProps> = ({ filters, activeTab, tenantStatus, setVisible }) => {
  const [columns, setColumns] = useState<any>([]);
  const analysisColumns = [
    { title: '店铺名称', key: 'name', width: 300, render: (_, record) => <Button type='link' onClick={() => methods.handleToDetail(record.id)}>{_}</Button> },
    { title: '所在城市', key: 'cityName', width: 88 },
    { title: '门店类型', key: 'typeName', width: 88 },
    { title: '营业日期', key: 'openDate', width: 210, render: (_, __) => `${_}-${__.closeDate}` },
    { title: '日均过店客流', key: 'passby', ...defaultColumnsConfig },
    { title: '日均进店客流', key: 'indoor', ...defaultColumnsConfig },
    { title: '日均留资人数', key: 'stayInfo', ...defaultColumnsConfig },
    { title: '日均试驾人数', key: 'testDrive', ...defaultColumnsConfig },
    { title: '日均大定人数', key: 'order', ...defaultColumnsConfig },
    {
      title: '监控视频',
      key: 'permissions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Operate operateList={refactorPermissions([{ event: 'flow:enableView', name: '查看监控' }])} onClick={() => methods.handleEnableView(record.cameraId)} />
      ),
    },
  ];
  const costColumns = [
    { title: '店铺名称', key: 'name', width: 300, render: (_, record) => <Button type='link' onClick={() => methods.handleToDetail(record.id)}>{_}</Button> },
    { title: '所在城市', key: 'cityName', width: 88 },
    { title: '门店类型', key: 'typeName', width: 88 },
    { title: '营业日期', key: 'openDate', width: 210, render: (_, __) => `${_}-${__.closeDate}` },
    { title: '单位过店成本', key: 'passbyCost', render: (_) => `${_}元` },
    { title: '单位进店成本', key: 'indoorCost', render: (_) => `${_}元` },
    { title: '单位留资成本', key: 'stayInfoCost', render: (_) => `${_}元` },
    { title: '单位试驾成本', key: 'testDriveCost', render: (_) => `${_}元` },
    { title: '单位大定成本', key: 'orderCost', render: (_) => `${_}元` },
    { title: '租金', key: 'rent', render: (_) => `${_}/天` },
    {
      title: '监控视频',
      key: 'cameraId',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Operate operateList={refactorPermissions([{ event: 'flow:enableView', name: '查看监控' }])} onClick={() => methods.handleEnableView(record.cameraId)} />
      ),
    },
  ];

  useEffect(() => {
    setColumns(activeTab === 'passengerflow' ? [...analysisColumns] : [...costColumns]);
  }, [filters]);

  const methods = useMethods({
    handleEnableView(id: number) {
      // tenantStatus 0:试用企业，1：正式企业； 默认1
      if (tenantStatus === 0) {
        setVisible(true);
        return;
      }
      dispatchNavigate(`/monitoring?id=${id}`);
    },
    handleToDetail(id: number) {
      dispatchNavigate(`/car/analysis?id=${id}`);
    },
  });

  // 获取客流统计表格数据
  const loadData = async (param: any) => {
    if (!param.start) return { dataSource: [] };
    // https://yapi.lanhanba.com/project/455/interface/api/44351
    const url = `/carStore/${activeTab === 'passengerflow' ? 'carStoreFlowList' : 'carStoreCostList'}`;
    const result: any = await get(url, param);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  return (
    <>
      <Table
        rowKey='id'
        scroll={{ x: 'max-content', y: 500 }}
        columns={columns}
        filters={filters}
        onFetch={loadData}
      />
    </>
  );
};

export default CustomTable;
