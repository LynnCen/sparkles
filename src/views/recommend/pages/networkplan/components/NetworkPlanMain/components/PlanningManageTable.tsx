// /**
//  * @Description 规划管理table，嵌套表格版本，产品设计变更暂时不用，后续可能会用到
//  */
// import { FC } from 'react';
// import { useMethods } from '@lhb/hook';

// import { Badge } from 'antd';
// import V2Table from '@/common/components/Data/V2Table';
// import { TabsEnums, PlanningStatus } from '../../../ts-config';
// import EmptyRender from './EmptyRender';

// const otherColumnConfig = {
//   width: 120
// };

// const PlanningManageTable: FC<any> = ({
//   mainHeight,
//   // type
// }) => {

//   const methods = useMethods({
//     // filter变化的时候执行请求接口的操作
//     loadData(params: any) {
//       console.log('params', params);
//       const data: any[] = [];
//       for (let i = 0; i < 3; ++i) {
//         data.push({
//           key: i.toString(),
//           name: 'Screem',
//           platform: 'iOS',
//           version: '10.3.4.5654',
//           upgradeNum: 500,
//           creator: 'Jack',
//           createdAt: '2014-12-24 23:12:00',
//         });
//       }
//       return {
//         dataSource: data,
//         count: data.length,
//       };
//     },
//   });

//   const defaultColumns: any[] = [
//     { title: '规划版本名称', dataIndex: 'name', key: 'name', dragChecked: true, ...otherColumnConfig },
//     { title: '总推荐商圈数', dataIndex: 'version', key: 'version', dragChecked: true, ...otherColumnConfig },
//     { title: '总推荐门店数', dataIndex: 'upgradeNum', key: 'upgradeNum', dragChecked: true, ...otherColumnConfig },
//     { title: '总部规划完成', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 148 },
//     { title: '分公司规划完成', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 148 },
//   ];

//   const expandedRowRender = () => {
//     const columns: any[] = [
//       { title: '分公司名称', dataIndex: 'date', key: 'date', ...otherColumnConfig },
//       {
//         title: '规划状态',
//         key: 'state',
//         whiteTooltip: true,
//         ...otherColumnConfig,
//         render: () => (
//           <Badge color={PlanningStatus['1'].color} text={PlanningStatus['1'].text} />
//         ),
//       },
//       { title: '推荐商圈数', dataIndex: 'name', key: 'name', ...otherColumnConfig },
//       { title: '推荐门店数', dataIndex: 'upgradeNum', key: 'upgradeNum', ...otherColumnConfig },
//       { title: '总部规划商圈数', dataIndex: 'upgradeNum', key: 'upgradeNum', width: 148 },
//       { title: '总部规划门店数', dataIndex: 'upgradeNum', key: 'upgradeNum', width: 148 },
//       { title: '分部规划总商圈数', dataIndex: 'upgradeNum', key: 'upgradeNum', width: 148 },
//       { title: '分部规划开店数', dataIndex: 'upgradeNum', key: 'upgradeNum', ...otherColumnConfig },
//       { title: '操作', dataIndex: 'upgradeNum', key: 'upgradeNum', fixed: 'right', ...otherColumnConfig },

//     ];

//     const childLoadData = async () => {
//       const data: any[] = [];
//       for (let i = 0; i < 3; ++i) {
//         data.push({
//           key: i.toString(),
//           date: '2014-12-24 23:12:00',
//           name: 'This is production name',
//           upgradeNum: 'Upgraded: 56',
//         });
//       }
//       return {
//         dataSource: data,
//         count: data.length,
//       };
//     };

//     return <V2Table
//       defaultColumns={columns}
//       onFetch={childLoadData}
//       hideColumnPlaceholder
//       pagination={false} />;
//   };


//   return (
//     <>

//       {true ? <V2Table
//         rowKey='key'
//         onFetch={methods.loadData}
//         defaultColumns={defaultColumns}
//         pageSize={100}
//         pagination={false}
//         // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
//         tableSortModule='consoleRecommendNetworkPlanPlanningManagement'
//         expandable={{ expandedRowRender }}
//         scroll={{ y: mainHeight - 64 - 8 }}
//       /> : <EmptyRender
//         mainHeight={mainHeight}
//         type={TabsEnums.HEAD_OFFICE}
//       />}
//     </>
//   );
// };

// export default PlanningManageTable;

// 未使用
export {};
