import { FC } from 'react';
import { Row, Divider } from 'antd'; // Button List Divider
import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';

interface IProps {
  result: any;
}

const BusinessEnv: FC<IProps> = ({
  result,
}) => {
  return (
    <>
      <TitleTips name='商场信息' showTips={false} />
      <Row>
        <DetailInfo title='开发商名称' value={result?.operateEnvironmentAsics?.developerName} />
        <DetailInfo title='开发商等级' value={result?.operateEnvironmentAsics?.developerLevelName} />
        {
          result?.isOpenMall === 1 && (
            <>
              <DetailInfo title='商场年销售（亿元）' value={result?.operateEnvironmentAsics?.mallAnnualSales} />
              <DetailInfo title='满铺率（%）' value={result?.operateEnvironmentAsics?.fullShopRate} />
            </>
          )
        }
        <DetailInfo title='商业体量（平米）' value={result?.operateEnvironmentAsics?.commercialVolume}/>
        <DetailInfo title='停车位（个）' value={result?.operateEnvironmentAsics?.parkingNum}/>
        {
          result?.isOpenMall !== 1 && (
            <>
              <DetailInfo title='预计开业时间' value={result?.operateEnvironmentAsics?.estimatedOpeningDate} />
              <DetailInfo title='招商完成率（%）' value={result?.operateEnvironmentAsics?.investmentCompletionRate} />
            </>
          )
        }
        <DetailInfo title='是否提供特卖点位' value={result?.operateEnvironmentAsics?.hasSpecialSellSpotName} />
        <DetailInfo title='商场影响力' value={result?.operateEnvironmentAsics?.marketInfluenceName} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      {
        result?.isOpenMall === 1 && (
          <>
            <TitleTips name='商场客流' showTips={false} />
            <Row>
              <DetailInfo title='工作日客流指数（人/天）' value={result?.operateEnvironmentAsics?.flowWeekdayIndex} />
              <DetailInfo title='节假日客流指数（人/天）' value={result?.operateEnvironmentAsics?.flowWeekendIndex} />
            </Row>
          </>
        )
      }
      {
        result?.isOpenMall !== 1 && (
          <>
            <TitleTips name='商场周边' showTips={false} />
            <Row>
              <DetailInfo title='门前道路' value={result?.operateEnvironmentAsics?.roadFrontDoorName} />
              <DetailInfo title='3公里内人口数量' value={result?.operateEnvironmentAsics?.populationWithin3km} />
              <DetailInfo title='地铁站数量（个）' value={result?.operateEnvironmentAsics?.subwayStationNumName} />
              <DetailInfo title='距离地铁站（米）' value={result?.operateEnvironmentAsics?.distance2SubwayStation	} />
              <DetailInfo title='公交站数量（个）' value={result?.operateEnvironmentAsics?.busStationNumName} />
              <DetailInfo title='距离公交站（米）' value={result?.operateEnvironmentAsics?.distance2BusStation} />
              <DetailInfo title='对比周边商场' value={result?.operateEnvironmentAsics?.compare2SurrMallName} />
            </Row>
          </>
        )
      }
    </>
  );
};

export default BusinessEnv;
