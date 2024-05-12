
// import { Image, Typography } from 'antd';
// import styles from './index.module.less';
// import V2Title from '@/common/components/Feedback/V2Title';
// import ProgressWithTitle from '@/common/components/business/ProgressWithTitleProps';
// import AssessInfo from '../../../AssessInfo';
// import { FC } from 'react';
// import { replaceEmpty } from '@lhb/func';
// import { openAMap } from '@/common/utils/ways';

// const { Text } = Typography;

// const TopBox:FC<any> = ({
//   data = {}
// }) => {

//   return (
//     <div className={styles.topContainer}>
//       <div className={styles.title}>
//         <div>
//           <V2Title text={replaceEmpty(data?.placeName)} />
//           <div className={styles.addressBox}>
//             <Text
//               ellipsis={{ tooltip: replaceEmpty(data?.address) }}
//               className={styles.address}>
//               {replaceEmpty(data?.address)}
//             </Text>
//             <Image
//               width={16}
//               height={17}
//               preview={false}
//               className={styles.infoIcon}
//               onClick={() => openAMap(data?.longitude, data?.latitude, data?.address)}
//               src='https://staticres.linhuiba.com/project-custom/pms/icon/location.png'
//             />
//           </div>
//         </div>
//         <div className={styles.progress}>
//           <ProgressWithTitle key={'城市市场'} title='城市市场' percent={data?.cityMarketRatio || 0}/>
//           <ProgressWithTitle key={'商业氛围'} title='商业氛围' percent={data?.businessClimateRatio || 0}/>
//           <ProgressWithTitle key={'客群客流'} title='客群客流' percent={data?.customerFlowRatio || 0}/>
//           <ProgressWithTitle key={'交通便利'} title='交通便利' percent={data?.trafficConvenientRatio || 0}/>
//         </div>
//       </div>
//       <div className={styles.assessInfo}>
//         <AssessInfo infoTipsNumber={6} data={data}/>
//       </div>
//     </div>
//   );
// };
// export default TopBox;
export {};
