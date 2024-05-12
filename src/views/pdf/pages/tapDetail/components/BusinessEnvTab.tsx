import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';
import TabTitle from './TabTitle';

const BusinessEnvTab:FC<any> = ({ data, isOpen }) => {

  return (
    <div className={styles.tabInfoContent}>
      <TabTitle name='经营环境' />
      <TitleTips className={styles.secondTitle} name='商场信息' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='开发商名称' value={data.developerName} />
        <DetailInfo title='开发商等级' value={data.developerLevelName} />
        { isOpen && <DetailInfo title='商场年销售额(亿元)' value={data.mallAnnualSales} /> }
        <DetailInfo title='商业体量(平米)' value={data.commercialVolume} />
        { isOpen && <DetailInfo title='满铺率' value={data.fullShopRate} /> }
        <DetailInfo title='停车位(个)' value={data.parkingNum} />
        { !isOpen && <DetailInfo title='预计开业时间' value={data.estimatedOpeningDate} /> }
        { !isOpen && <DetailInfo title='招商完成率(%)' value={data.investmentCompletionRate} /> }
        <DetailInfo title='是否提供特卖点位' value={data.hasSpecialSellSpotName} />
        <DetailInfo title='商场影响力' value={data.marketInfluenceName} />
      </Row>
      { isOpen && (
        <>
          <TitleTips className={styles.secondTitle} name='商场客流' showTips={false} />
          <Row className={styles.infoContent} gutter={[16, 0]}>
            <DetailInfo title='工作日客流指数(人次)' value={data.flowWeekdayIndex} />
            <DetailInfo title='节假日客流指数(人次)' value={data.flowWeekendIndex} />
          </Row>
        </>
      ) }
      { !isOpen && (
        <>
          <TitleTips className={styles.secondTitle} name='商场周边' showTips={false} />
          <Row className={styles.infoContent} gutter={[16, 0]}>
            <DetailInfo title='门前道路' value={data.roadFrontDoorName} />
            <DetailInfo title='3公里内人口指数(人)' value={data.populationWithin3km} />
            <DetailInfo title='地铁站数量(个)' value={data.subwayStationNumName} />
            <DetailInfo title='距离地铁站(m)' value={data.distance2SubwayStation} />
            <DetailInfo title='公交站数量(个)' value={data.busStationNumName} />
            <DetailInfo title='距离公交站(m)' value={data.distance2BusStation} />
            <DetailInfo title='对比周边商场' value={data.compare2SurrMallName} />
          </Row>
        </>
      ) }
    </div>
  );
};

export default BusinessEnvTab;
