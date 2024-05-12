/**
 * @Description
 */
import { FC, forwardRef, useImperativeHandle, useRef } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import V2Operate from '@/common/components/Others/V2Operate';
import { get } from '@/common/request';
import dayjs from 'dayjs';
import { deepCopy, isMobile, replaceEmpty } from '@lhb/func';
import { getNoNavUrl } from '@/common/utils/ways';
import DetailDrawer from 'src/views/locxx/pages/sessionRecord/detail/component/Drawer';
import V2Tag from '@/common/components/Data/V2Tag';
import { Typography } from 'antd';
// import styles from '../entry.module.less';
import AddFollowRecord from 'src/views/locxx/pages/demandManagement/components/AddFollowRecord';
import FollowRecordDetail from 'src/views/locxx/pages/demandManagement/components/FollowRecordDetail';

const { Text } = Typography;

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
  const USER_TYPE_BRAND = 1;// 品牌用户
  const USER_ACTIVE = 1;// 用户活跃

  const tableRef = useRef<any>();
  const detailDrawerRef = useRef<any>();
  const addFollowRecordRef = useRef<any>(null);
  const followRecordDetailRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    onload: () => {
      tableRef.current.onload(true);
    },
  }));

  const methods = useMethods({
    async onFetch(_params: any) {
      const params = deepCopy(_params);
      if (params.date) {
        params.start = dayjs(params.date[0]).format('YYYY-MM-DD');
        params.end = dayjs(params.date[1]).format('YYYY-MM-DD');
      }
      delete params.date;
      if (params.latelyTime) {
        params.latelyTimeStart = dayjs(params.latelyTime[0]).format('YYYY-MM-DD');
        params.latelyTimeEnd = dayjs(params.latelyTime[1]).format('YYYY-MM-DD');
      }
      delete params.latelyTime;
      if (!params.businessMobile) {
        delete params.businessMobile;
      }
      if (!params.propertyMobile) {
        delete params.propertyMobile;
      }
      // https://yapi.lanhanba.com/project/319/interface/api/54606
      const { objectList, totalNum } = await get('/im/chatLogs', params, { needHit: true, proxyApi: '/pms-api' });
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    // 刷新当前页面列表
    onRefresh(isCurPage = true) {
      // setSelectedRowKeys([]);
      // setSelectedRows([]);
      tableRef.current.onload(isCurPage);
    },
    view(record) {
      if (isMobile()) { // 兼容手机端展示
        window.location = getNoNavUrl(`/locxx/sessionRecord/detail?id=${record.id}`);
      } else {
        detailDrawerRef.current.init(record.id);
      }
    },
    renderUserName(value, record, type) {
      const activeBusiness = type === 'business' && record.firstCustomType === USER_TYPE_BRAND && record.firstActive === USER_ACTIVE;
      const activeProperty = type === 'property' && record.secondActive === USER_ACTIVE;

      const content = <span>{value}{(activeBusiness || activeProperty) ? <V2Tag className='inline-block'>活跃</V2Tag> : ''}</span>;
      return (
        <Text ellipsis={{ tooltip: { title: content } }} >
          {content}
        </Text>
      );
    },
    // 打开添加跟进记录的弹窗
    addFollowRecord(data) {
      data.id && addFollowRecordRef.current?.init(data);
    },
    // 打开跟进记录详情的弹窗
    openFollowRecordDetail(id) {
      id && followRecordDetailRef.current?.init(id);
    },
  });

  const defaultColumns = [
    // 王健要求默认宽度是320
    { key: 'businessName', title: '发起方', dragChecked: true, width: 320, render: (value, record) => methods.renderUserName(value, record, 'business') },
    { key: 'propertyName', title: '接收方', dragChecked: true, width: 320, render: (value, record) => methods.renderUserName(value, record, 'property') },
    {
      key: 'lastFollowRecord',
      title: '跟进记录',
      dragChecked: true,
      width: '220px',
      render: (value) => <span>{replaceEmpty(value)}</span>,
      rightOperateSlot: [
        { icon: 'icon-ic_history', onClick: (val, record) => methods.openFollowRecordDetail(record.id) },
        { icon: 'pc-common-icon-ic_edit', onClick: (val, record) => methods.addFollowRecord({ id: record.id }) }
      ]
    },
    { key: 'createdAt', title: '创建时间', dragChecked: true },
    { key: 'latelyTime', title: '最近会话时间', dragChecked: true },
    { key: 'isReplyStr', title: '是否回复', dragChecked: true, width: 100 },
    { key: 'follower', title: '跟进人', dragChecked: true, width: 140 },
    { key: 'operator', title: '操作', dragChecked: true, dragDisabled: true, fixed: 'right', render: (_, record) => {
      const permission: any = [];
      permission.push({ event: 'view', name: '查看记录' });
      return <V2Operate operateList={permission} onClick={(btn: any) => methods[btn.event](record)} />;
    } },
  ];

  return (
    <>
      <V2Table
        ref={tableRef}
        filters={params}
        rowKey='id'
        // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
        scroll={{ y: mainHeight - 64 - 42 }}
        defaultColumns={defaultColumns}
        tableSortModule='sessionRecordList'
        useResizable
        onFetch={methods.onFetch}
      />

      <DetailDrawer ref={detailDrawerRef} onRefresh={methods.onRefresh}/>

      {/* 添加跟进记录 */}
      <AddFollowRecord ref={addFollowRecordRef} provideFor='sessionRecord' onRefresh={methods.onRefresh}/>
      {/* 跟进记录详情 */}
      <FollowRecordDetail ref={followRecordDetailRef} provideFor='sessionRecord'/>

    </>
  );
});

export default TableList;
