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
      // https://yapi.lanhanba.com/project/307/interface/api/54830
      const { objectList, totalNum } = await postLocxxMsgPageList({
        ..._params,
        inviteType: 2
      });
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
  });

  const defaultColumns = [
    { key: 'mobile', title: '微信号	', dragChecked: true },
    { key: 'tenantName', title: '客户名称', dragChecked: true },
    { key: 'contactName', title: '联系人', dragChecked: true },
    { key: 'gmtCreate', title: '邀请时间', dragChecked: true },
    { key: 'firstLoginAt', title: '用户首次登录时间', dragChecked: true },
  ];

  return (
    <V2Table
      ref={tableRef}
      filters={params}
      rowKey='id'
      // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
      scroll={{ y: mainHeight - 64 - 42 }}
      defaultColumns={defaultColumns}
      tableSortModule='inviteCustomerWechatList'
      useResizable
      onFetch={methods.onFetch}
    />
  );
});

export default TableList;
