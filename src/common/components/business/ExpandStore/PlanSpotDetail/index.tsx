/**
 * @Description 审批工作台--审批集客点类型
 */

import { FC } from 'react';
import Title from './components/Title';
import CityInfo from './components/CityInfo';
import CollectionPointInfo from './components/CollectionPointInfo';

interface Props {
  refresh?;
  aprDetail;
  detail;
  isApproval?: boolean; // // 是否为审批信息
  mainHeight?: number;
}
const PlanSpotDetail: FC<Props> = ({
  aprDetail,
  detail,
  isApproval = false,
  // mainHeight
}) => {
  // 在这里编写组件的逻辑和渲染
  return (
    <div
      // style={{
      //   height: mainHeight || 'auto',
      //   overflowY: 'scroll',
      //   overflowX: 'hidden',
      // }}
    >
      {/* 审批信息 */}
      {isApproval && <Title aprDetail={aprDetail} planSpotsCount={detail.planSpots.length} />}

      <CityInfo detail={detail} />
      <CollectionPointInfo detail={detail} />
    </div>
  );
};

export default PlanSpotDetail;
