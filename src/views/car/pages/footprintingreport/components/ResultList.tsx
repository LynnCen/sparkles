// import { FC } from 'react';
// import Table from '@/common/components/FilterTable';
// import { post } from '@/common/request/index';
// import { useClientSize } from '@lhb/hook';
// // import { valueFormat } from '@/common/utils/ways';
// import dayjs from 'dayjs';
// // import { Typography } from 'antd';
// // const { Link } = Typography;

// // const defaultRender = { width: 130, render: (value: number | string) => valueFormat(value) };

// const ResultList: FC<any> = ({ searchParams, refreshCurrent = false }) => {
//   const scrollHeight = useClientSize().height - 260;

//   const formatTimeStr = (secondTime: number) => {
//     let minuteTime = 0; // 分
//     let hourTime = 0; // 小时
//     if (secondTime > 60) {
//       // 如果秒数大于60，将秒数转换成整数
//       // 获取分钟，除以60取整数，得到整数分钟
//       minuteTime = Math.floor(secondTime / 60);
//       // 获取秒数，秒数取佘，得到整数秒数
//       secondTime = Math.floor(secondTime % 60);
//       // 如果分钟大于60，将分钟转换成小时
//       if (minuteTime >= 60) {
//         // 获取小时，获取分钟除以60，得到整数小时
//         hourTime = Math.floor(minuteTime / 60);
//         // 获取小时后取佘的分，获取分钟除以60取佘的分
//         minuteTime = Math.floor(minuteTime % 60);
//         return `${hourTime}小时${minuteTime}分${secondTime}秒`;
//       }
//       return `${minuteTime}分${secondTime ? `${secondTime}秒` : ''}`;
//     }
//     return `${secondTime}秒`;
//   };

//   const renderTimeRange = (value: string, record: any) => {
//     return `${value}-${dayjs(record.endTime).format('HH:mm:ss')}`;
//   };

//   // 部分子页面访问时上报归属的父级页面 https://confluence.lanhanba.com/pages/viewpage.action?pageId=67530354
//   const playVideoHandle = (url: string) => {
//     if (!url) return;
//     window.open(url);
//     window.LHBbigdata.send({
//       msg: {
//         url: '/car/footprintingpanel'
//       }
//     });
//   };

//   const columns = [
//     {
//       title: '时间段',
//       key: 'startTime',
//       width: 240,
//       fixed: 'left',
//       render: (value: string, record: any) => renderTimeRange(value, record),
//     },
//     {
//       title: '视频URL',
//       key: 'videoUrl',
//       render: (value: string) =>
//         (value && (
//           // <Link href={value} target='_blank'>
//           //   {value}
//           // </Link>
//           <div onClick={() => playVideoHandle(value)} className='c-006 pointer'>
//             {value}
//           </div>
//         )) ||
//         '-',
//     },
//     {
//       title: '时长',
//       key: 'duration',
//       width: 130,
//       render: (value: number) => formatTimeStr(value),
//     },
//     { title: '总人数', key: 'flow', sorter: true, width: 130, render: (_, record) => record.flowReview || record.flow },
//   ];

//   const loadData = async (params) => {
//     // https://yapi.lanhanba.com/project/329/interface/api/33876
//     if (params && params.id) {
//       const { data, meta } = await post('/checkSpot/reviews/pages', params);
//       return {
//         dataSource: data || [],
//         count: meta.total || 0,
//       };
//     } else {
//       return {
//         dataSource: [],
//         count: 0,
//       };
//     }
//   };

//   return (
//     <>
//       <Table
//         rowKey='id'
//         size='small'
//         refreshCurrent={refreshCurrent}
//         filters={searchParams}
//         scroll={{ x: 'max-content', y: scrollHeight }}
//         columns={columns}
//         onFetch={loadData}
//       />
//     </>
//   );
// };

// export default ResultList;
export default {};
