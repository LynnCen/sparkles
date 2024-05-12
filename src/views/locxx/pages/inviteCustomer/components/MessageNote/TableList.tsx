/**
 * @Description 邀请客户列表
 */
import { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { postLocxxMsgPageList } from '@/common/api/locxx';

/*
  品牌审核列表
*/
interface TableListProps {
  params: any;
  mainHeight?: any;
  ref: any;
}

const TableList: FC<TableListProps> = forwardRef(({
  params,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}, ref) => {
  const tableRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    onload: () => {
      tableRef.current.onload(true);
    },
  }));

  const methods = useMethods({
    async onFetch(_params: any) {
      const { objectList, totalNum } = await postLocxxMsgPageList({
        ..._params,
        inviteType: 1
      });
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
  });

  const defaultColumns = [
    { key: 'mobile', title: '手机号	', dragChecked: true },
    { key: 'tenantName', title: '租户名称', dragChecked: true },
    { key: 'contactName', title: '联系人', dragChecked: true },
    { key: 'gmtCreate', title: '邀请时间', dragChecked: true },
    { key: 'isClick', title: '链接点击', dragChecked: true, render: (value) => value ? '是' : '否' },
    { key: 'isChat', title: '会话处理', dragChecked: true, render: (value) => value ? '是' : '否' },
  ];

  return (
    <V2Table
      ref={tableRef}
      filters={params}
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={defaultColumns}
      tableSortModule='inviteCustomerList'
      useResizable
      onFetch={methods.onFetch}
    />
  );
});

export default TableList;
