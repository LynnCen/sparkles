import React, { useState } from 'react';

import FollowerModal from '@/common/components/Modal/FollowerModal';

import { useMethods } from '@lhb/hook';
import { tenantCheckSpotRecordPagesByKey } from '@/common/api/location';
import dayjs from 'dayjs';
import V2Table from '@/common/components/Data/V2Table';

const FootprintingList: React.FC<any> = ({
  params,
  onSearch,
  tenantId,
  mainHeight
}) => {
  /* data */
  // 修改跟进人
  const [editFollower, setEditFollower] = useState<any>({
    visible: false,
    id: undefined,
    follower: {},
  });
  const defaultColumns: any[] = [
    { key: 'createdAt', title: '交易时间', dragChecked: true },
    { key: 'tradeTypeName', title: '交易类型', dragChecked: true },
    { key: 'accountName', title: '操作人', dragChecked: true },
    { key: 'grantTypeName', title: '详细内容', dragChecked: true },
    { key: 'tradeValue', title: '使用次数', dragChecked: true },
    { key: 'tradeNo', title: '交易流水号', dragChecked: true },
  ];
  /* methods */
  const {
    onOk,
    loadData,
  } = useMethods({
    onOk() {
      // 确认认领-刷新页面
      onSearch({});
    },
    loadData: async (params: any) => {
      const formatParams: any = {
        page: params.page,
        size: params.size,
        tenantId,
        benefitType: 1
      };
      params.tradeType && (formatParams.tradeType = params.tradeType);
      if (params.date) {
        formatParams.createdAtMin = dayjs(params.date[0]).format('YYYY-MM-DD');
        formatParams.createdAtMax = dayjs(params.date[1]).format('YYYY-MM-DD');
      };
      const { objectList, totalNum } = await tenantCheckSpotRecordPagesByKey(formatParams);
      return {
        dataSource: objectList,
        count: totalNum
      };
    },
  });
  return (
    <>
      <V2Table
        rowKey='tradeNo'
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        tableSortModule='locSAASLocationTenantDetailTreadRecord'
        // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
        scroll={{ y: mainHeight - 48 - 42 }}
      />
      <FollowerModal editFollower={editFollower} onClose={setEditFollower} onOk={onOk} />
    </>
  );
};
export default FootprintingList;
