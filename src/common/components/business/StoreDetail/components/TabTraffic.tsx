import { FC } from 'react';
import { Row, Divider } from 'antd';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailInfo from '@/common/components/business/DetailInfo';

const TabTraffic: FC<any> = ({
  result,
  isTargetShop,
  isFood
}) => {

  return (
    <>
      { isFood ? (<>
        <TitleTips name='交通概况' showTips={false} />
        <Row>
          <DetailInfo title='道路性质' value={result?.trafficOverview?.roadNatureName} />
          <DetailInfo title='地铁线路数量（条）' value={result?.trafficOverview?.subwayLineNum} />
          <DetailInfo title='距离地铁站（米）' value={result?.trafficOverview?.subwayStationDistance} />
          <DetailInfo title='公交线路数量（条）' value={result?.trafficOverview?.busLineNum} />
          <DetailInfo title='距离公交站（米）' value={result?.trafficOverview?.busStationDistance} />
        </Row>
        <Divider style={{ marginTop: 14 }} />
        <TitleTips name='到店便利性' showTips={false} />
        <Row>
          <DetailInfo title='门前台阶数量' value={result?.trafficOverview?.stepName} />
          <DetailInfo title='门前停车条件' value={result?.trafficOverview?.parkingConditionName} />
          <DetailInfo title='对面到店便利性' value={result?.trafficOverview?.oppositeConvenienceName} />
          <DetailInfo title='同侧到店便利性' value={result?.trafficOverview?.sideConvenienceName} />
        </Row>
      </>) : (<>
        { isTargetShop ? (
          <>
            <TitleTips name='可达性' showTips={false} />
            <Row>
              <DetailInfo title='道路性质' value={result?.trafficOverview?.roadNatureName} />
              <DetailInfo title='地铁线路数量（条）' value={result?.trafficOverview?.subwayLineNum} />
              <DetailInfo title='距离地铁站（米）' value={result?.trafficOverview?.subwayStationDistance} />
              <DetailInfo title='公交线路数量（条）' value={result?.trafficOverview?.busLineNum} />
              <DetailInfo title='距离公交站（米）' value={result?.trafficOverview?.busStationDistance} />
            </Row>
          </>) : (
          <>
            <TitleTips name='交通性' showTips={false} />
            <Row>
              <DetailInfo title='道路构造' value={result?.trafficOverview?.roadConstructionName} />
              <DetailInfo title='道路性质' value={result?.trafficOverview?.roadNatureName} />
              <DetailInfo title='道路坡度' value={result?.trafficOverview?.roadSpaceName} />
              <DetailInfo title='道路塞车' value={result?.trafficOverview?.roadTrafficJamName} />
              <DetailInfo title='道路斑马线' value={result?.trafficOverview?.roadZebraLineName} />
              <DetailInfo title='红绿灯' value={result?.trafficOverview?.trafficLightName} />
            </Row>
            <Divider style={{ marginTop: 14 }} />

            <TitleTips name='便利性' showTips={false} />
            <Row>
              <DetailInfo title='门前台阶数量' value={result?.trafficOverview?.stepName} />
              <DetailInfo title='门前停车条件' value={result?.trafficOverview?.parkingConditionName} />
              <DetailInfo title='对面到店便利性' value={result?.trafficOverview?.oppositeConvenienceName} />
              <DetailInfo title='同侧到店便利性' value={result?.trafficOverview?.sideConvenienceName} />
              <DetailInfo title='有无上下货通道' value={result?.trafficOverview?.hasUnloadingChannelName} />
            </Row>
          </>
        )
        }
      </>)
      }
    </>
  );
};

export default TabTraffic;
