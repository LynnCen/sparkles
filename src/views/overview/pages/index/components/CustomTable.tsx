/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 该组件作为一个children传入tabs组件中，每次切换tab都相当于传入一个新的组件
 */
import React, { useEffect, useState } from 'react';
// import Table from '@/common/components/FilterTable';
import { post } from '@/common/request/index';
import { checkIndustry } from '@/common/api/store';
import { valueFormat } from '@/common/utils/ways';
import { CustomTableProps } from '../ts-config';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import IconFont from '@/common/components/IconFont';
import ModalExport from '@/common/components/business/ModalExport';
import { message } from 'antd';
import Operate from '@/common/components/Operate';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';
import V2Table from '@/common/components/Data/V2Table';

const defaultColumnsConfig = {
  sorter: true,
  width: 150,
  render: (value: number) => valueFormat(value),
};

// 基本信息列，总是显示
const basicColumns = [
  { title: '门店名称', key: 'storeName', fixed: 'left', sorter: true, width: 200 },
  { title: '营运状态', key: 'statusName', width: 160 },
  { title: '进店客流量', key: 'indoorCount', defaultSortOrder: 'descend', ...defaultColumnsConfig },
  { title: '过店客流量', key: 'passByCount', ...defaultColumnsConfig },
  { title: '进店顾客数（人）', key: 'customerCount', ...defaultColumnsConfig },
  { title: '进店客户组（个）', key: 'customerBatchCount', ...defaultColumnsConfig },
  { title: '进店率（%）', key: 'indoorPercentage', ...defaultColumnsConfig },
];

// 订单相关列
const orderColumns = [
  { title: '店内订单（笔）', key: 'storeOrderCount', ...defaultColumnsConfig },
  { title: '转化率（%）', key: 'conversionPercentage', ...defaultColumnsConfig },
  { title: '店内销售额（元）', key: 'storeSaleAmount', ...defaultColumnsConfig, width: 160 },
];

// 行业相关列
const industryColumns = [
  { title: '美团订单（笔）', key: 'mtOrderCount', ...defaultColumnsConfig },
  { title: '饿了么订单（笔）', key: 'elOrderCount', ...defaultColumnsConfig, width: 160 },
];

// 订单总计相关列
const orderTotalColumns = [
  { title: '总订单（笔）', key: 'orderCount', ...defaultColumnsConfig },
  { title: '总销售额（元）', key: 'saleAmount', ...defaultColumnsConfig },
];

const CustomTable: React.FC<CustomTableProps> = ({ filters, hasOrderPermission }) => {
  const [params, setParams] = useState<any>({ orderBy: 'indoorCount', order: 'desc' });
  const [columns, setColumns] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { start, end, storeIds, strStoredIds } = filters;
  // 是否显示导出按钮
  const [showExport, setShowExport] = useState<boolean>(false);

  // 右侧列
  const rightColumns = [
    { title: '平均停留时长', key: 'durationAvg', ...defaultColumnsConfig },
    {
      title: '监控视频',
      key: 'permissions',
      fixed: 'right',
      width: 100,
      render: (value, record) => (
        <Operate operateList={refactorPermissions(value)} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];

  const { ...methods } = useMethods({
    handleEnableView(record: any) {
      dispatchNavigate(`/monitoring?id=${record.storeId}`);
    },
    handleExportData() {
      setShowModal(true);
    },
  });

  useEffect(() => {
    if (hasOrderPermission && start && end) {
      const getCheckIndustry = async () => {
        let arr: any[] = [
          ...basicColumns,
          ...orderColumns,
          ...orderTotalColumns,
          ...rightColumns,
        ];
        try {
          const result = await checkIndustry({ ids: strStoredIds });
          result && (arr = [
            ...basicColumns,
            ...orderColumns,
            ...industryColumns,
            ...orderTotalColumns,
            ...rightColumns,
          ]);
        } catch (error) {}
        setColumns(arr);
        setParams({ storeIds, start, end });
      };
      getCheckIndustry();
    } else {
      const arr: any[] = [
        ...basicColumns,
        ...rightColumns,
      ];
      setColumns(arr);
      setParams({ storeIds, start, end });
    }
  }, [start, end, storeIds, strStoredIds]);

  // 获取客流统计表格数据
  const loadData = async (param: any) => {
    if (!param.start) return { dataSource: [] };
    // https://yapi.lanhanba.com/project/297/interface/api/33383
    const result: any = await post('/store/data/analysis', param);
    const permissions = result?.meta?.permissions || [];
    setShowExport(permissions.filter((item) => item.event === 'flow:storeStatistic:exportData').length);
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  const uploadStore = async (values: any) => {
    const { start, end, storeIds, strStoredIds } = filters;
    post('/store/data/analysis/export', { start, end, storeIds: strStoredIds ? storeIds : [], ...values }).then(() => {
      message.success('正在发送报表，请稍后前往邮箱查看。');
      setShowModal(false);
    });
  };

  return (
    <>
      <TitleTips name='数据明细' tips='如数值显示“—”，请检查是否导入对应日期订单明细。'>
        {!!showExport && (
          <IconFont iconHref='icondownload' className='color-primary-operate' onClick={() => setShowModal(true)} />
        )}
      </TitleTips>
      {/* <Table
        rowKey='storeId'
        scroll={{ x: 'max-content', y: 500 }}
        columns={columns}
        filters={params}
        onFetch={loadData}
      /> */}

      <V2Table
        rowKey='storeId'
        key={columns}
        defaultSorter={{
          order: 'desc',
          orderBy: 'indoorCount'
        }}
        scroll={{ x: 'max-content', y: 500 }}
        defaultColumns={columns}
        filters={params}
        emptyRender={true}
        hideColumnPlaceholder
        onFetch={loadData}
      />
      <ModalExport visible={showModal} onOk={uploadStore} onClose={() => setShowModal(false)} />
    </>
  );
};

export default CustomTable;
