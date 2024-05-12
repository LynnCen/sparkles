// /**
//  * @Description 分公司应用table
//  */
// import { FC, useState } from 'react';
// import { useMethods } from '@lhb/hook';

// import V2Table from '@/common/components/Data/V2Table';
// import Operate from '@/common/components/Operate';
// import { OperateButtonProps } from '@/common/components/Others/V2Operate';
// import { refactorPermissions } from '@lhb/func';
// import BranchPlanningModal from './BranchPlanningModal';

// const otherColumnConfig = {
//   width: 120
// };

// const BranchApplicationTable: FC<any> = ({
//   mainHeight,
// }) => {
//   const [modalData, setModalData] = useState<any>({ visible: false });// 分公司规划管理弹窗

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
//     handleEdit(record: any) {
//       setModalData({
//         ...modalData,
//         visible: true,
//         id: record.id,
//         name: record.name,
//       });
//     }
//   });

//   const defaultColumns: any[] = [
//     { title: '分公司', dataIndex: 'name', key: 'name', dragChecked: true, ...otherColumnConfig },
//     { title: '应用版本', dataIndex: 'platform', key: 'platform', dragChecked: true, ...otherColumnConfig },
//     { title: '总推荐商圈数', dataIndex: 'version', key: 'version', dragChecked: true, ...otherColumnConfig },
//     { title: '总推荐门店数', dataIndex: 'upgradeNum', key: 'upgradeNum', dragChecked: true, ...otherColumnConfig },
//     { title: '总部规划商圈数', dataIndex: 'creator', key: 'creator', dragChecked: true, width: 148 },
//     { title: '总部规划门店数', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 148 },
//     { title: '分公司规划总商圈数', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 166 },
//     { title: '分公司规划开店数', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 148 },
//     {
//       title: '操作', dataIndex: 'createdAt', key: 'createdAt', dragChecked: true, width: 148, fixed: 'right',
//       render: (value: any[], record: any) => (
//         <Operate
//           // operateList={refactorPermissions(value)}
//           operateList={refactorPermissions([{ event: 'department:edit', name: '选择应用版本' }])}
//           onClick={(btn: OperateButtonProps) => methods[btn.func || ''](record)}
//         />
//       ),
//     },
//   ];


//   return (
//     <>
//       <V2Table
//         rowKey='key'
//         onFetch={methods.loadData}
//         defaultColumns={defaultColumns}
//         // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
//         tableSortModule='consoleRecommendNetworkPlanBranchApplication'
//         scroll={{ y: mainHeight - 64 - 8 }}
//         pagination={false}
//         pageSize={100}
//       />
//       <BranchPlanningModal
//         modalData={modalData}
//         setModalData={setModalData}
//       />
//     </>
//   );
// };

// export default BranchApplicationTable;

// 未使用
export {};
