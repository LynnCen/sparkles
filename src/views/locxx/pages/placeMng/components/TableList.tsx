/*
* 资源管理table列表
*/
import { FC } from 'react';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';

interface TableList {
  filters?: any;
  mainHeight?: number;
  refreshCurrent?: boolean; // 当前页刷新
  onFetch?: () => void;
  /**
   * @description 从1页重新加载
   */
  reload?: () => void;
  /**
   * @description 从当前页重新加载
   */
  currentReload?: () => void;
  /**
   * @description 详情抽屉
   */
  gotoDetail: (val: any) => void;
  /**
   * @description 跟进记录抽屉
   */
  gotoRecordDrawer: (id: any, tenantId:any, title:any) => void;
  /**
   * @description 二维码弹出框
   */
  openCode:(id:number) => void;
}

const PlaceTableList:FC<TableList> = ({
  filters,
  mainHeight = 0,
  refreshCurrent,
  onFetch,
  gotoDetail,
  gotoRecordDrawer,
  openCode,
  ...props
}) => {

  const methods = useMethods({
    /**
     * 前往详情
     */
    handleDetail: (id: any) => gotoDetail(id),

    /**
     * 前往跟进记录详情
     */
    handleRecordDetail: (id: any, tenantId:any, title:any) => gotoRecordDrawer(id, tenantId, title),
    /**
     * 供应商提示
     */
    renderEmployeeName(record:any) {
      const { tenantName, userName, userMobile } = record;
      const arr:any = [];
      tenantName && arr.push(tenantName);
      userName && arr.push(userName);
      userMobile && arr.push(userMobile);
      return arr.length ? arr.join('-') : '-';
    },
    /**
     * 跟进记录提示
     */
    renderRecord(record) {
      return <span>{record.lastRecord?.createTime || ''}-{record.lastRecord?.content || ''}</span>;
    }
  });

  const columns = [
    {
      title: '资源ID',
      key: 'id',
      dataIndex: 'id',
      width: 200,
      dragChecked: true,
      render: (values: any, record: any) => {
        return <a onClick={() => methods.handleDetail(record.id as number)}>{record.id}</a>;
      },
    },
    {
      title: '项目名称',
      key: 'name',
      dataIndex: 'name',
      width: 200,
      dragChecked: true,
      render: (values: any, record: any) => {
        return <a onClick={() => methods.handleDetail(record.id as number)}>{record.name || '-'}</a>;
      },
    },
    {
      title: '铺位类型',
      key: 'categoryName',
      dataIndex: 'categoryName',
      width: 200,
      dragChecked: true,
    },
    {
      title: '供应商',
      key: 'tenantName',
      dataIndex: 'tenantName',
      width: 200,
      dragChecked: true,
      rightOperateSlot: [
        { icon: 'icon-ic_history', onClick: (val, record) => methods.handleRecordDetail({ tenantPlaceTntId: record.tenantId, title: '供应商跟进记录' }) },
      ],
      render: (values: any, record: any) => methods.renderEmployeeName(record),
      staticTooltipTitle: (value:any, record:any) => methods.renderEmployeeName(record),
    },
    {
      title: '二维码',
      key: 'codeUrl',
      dataIndex: 'codeUrl',
      width: 200,
      dragChecked: true,
      noTooltip: true,
      rightOperateSlot: [
        { icon: 'icon-erweima1', onClick: (val, record) => openCode(Number(record.id)) },
      ],
      render: () => { return ''; }
    },
    {
      title: '城市',
      key: 'cityName',
      dataIndex: 'cityName',
      width: 200,
      dragChecked: true,
    },
    {
      title: '地址',
      key: 'address',
      dataIndex: 'address',
      width: 200,
      dragChecked: true,
    },
    {
      title: '跟进记录',
      width: 200,
      dragChecked: true,
      rightOperateSlot: [
        { icon: 'icon-ic_history', onClick: (val, record) => methods.handleRecordDetail({ tenantPlaceId: record.id, tenantPlaceTntId: record.tenantId, title: '资源跟进记录' }) },
      ],
      render: (values: any, record: any) => methods.renderRecord(record),
      staticTooltipTitle: (value:any, record:any) => methods.renderRecord(record),
    }
  ];

  return (
    <V2Table
      rowKey='id'
      filters={filters}
      voluntarilyEmpty
      defaultColumns={columns}
      scroll={{ x: 'max-content', y: mainHeight - 64 - 42 - 18 }}
      refreshCurrent={refreshCurrent}
      tableSortModule='saasLocxxPlaceMngTableList10000'
      useResizable
      onFetch={onFetch}
      {...props}
    />
  );
};

export default PlaceTableList;
