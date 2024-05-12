import { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { brandReviewList } from '@/common/api/brand-center';
import Status from './Status';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styles from './index.module.less';

/*
  品牌审核列表
*/
interface TableListProps {
  params: any;
  mainHeight?: any;
  openDetail?: Function; // 打开详情
  ref: any;
}

// 状态映射 'warning/processing/success/error/default'
export const statusMap = new Map([
  [0, { type: 'warning', text: '待处理' }],
  [1, { type: 'success', text: '审核通过' }],
  [2, { type: 'default', text: '已拒绝' }],
]);

const TableList: FC<TableListProps> = forwardRef(({
  params,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  openDetail,
}, ref) => {
  const tableRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    onload: () => {
      tableRef.current.onload(true);
    },
  }));

  const methods = useMethods({
    async onFetch(_params: any) {
      const { objectList, totalNum } = await brandReviewList(_params);
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
  });

  const defaultColumns = [
    { key: 'reviewName', title: '审核任务名称', dragChecked: true, dragDisabled: true, render: (_, item) => (
      <span style={{ color: '#006AFF' }} onClick={() => openDetail?.(item.reviewId, item.brandId)}>
        {item.reviewName}
      </span>
    ) },
    { key: 'reviewContent', title: '审核内容', dragChecked: true },
    { key: 'commitTime', title: '提交时间', dragChecked: true, sorter: (a, b) => {
      return +new Date(a.submitTime) - (+new Date(b.submitTime));
    } },
    { key: 'reviewer', title: '审核人', dragChecked: true, },
    { key: 'reviewTime', title: '审核时间', dragChecked: true, sorter: (a, b) => {
      return +new Date(a.approveTime) - (+new Date(b.approveTime));
    } },
    { key: 'reviewStatus', title: '审核状态', dragChecked: true, dragDisabled: true, fixed: 'right', render: (_, item) => {
      const { reviewStatus, reason } = item;
      const statusNode = <Status type={(statusMap.get(reviewStatus) as any).type as any}>{(statusMap.get(reviewStatus) as any).text}</Status>;

      return reason ? <div className={styles.rejectReason}>
        {statusNode}
        <Tooltip placement='top' title={`拒绝原因：${reason}`}>
          <InfoCircleOutlined style={{ color: '#999', marginLeft: 2 }}/>
        </Tooltip>
      </div> : statusNode;
    } },
  ];

  return (
    <V2Table
      ref={tableRef}
      filters={params}
      rowKey='reviewId'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={defaultColumns}
      tableSortModule='brandCenterApproveList'
      onFetch={methods.onFetch}
    />
  );
});

export default TableList;
