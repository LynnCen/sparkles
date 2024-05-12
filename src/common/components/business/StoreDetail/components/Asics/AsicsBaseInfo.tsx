import DetailInfo from '@/common/components/business/DetailInfo';
// import { approvalStatusClass } from '@/common/utils/ways';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Divider, Row } from 'antd';
import { FC } from 'react';
import DetailImage from '@/common/components/business/DetailImage';


interface IProps {
  result: any;
}

const BaseInfo: FC<IProps> = ({
  result
}) => {
  return (
    <>
      <TitleTips name='基本信息' showTips={false} />
      <Row gutter={[16, 0]}>
        <DetailInfo title='店铺名称' value={result?.shopInformationAsics?.shopName} />
        <DetailInfo title='店铺类型' value={result?.shopInformationAsics?.shopCategoryName} />
        <DetailInfo title='商场名称' value={result?.shopInformationAsics?.mallName} />
        <DetailInfo title='商场是否开业' value={result?.shopInformationAsics?.isOpenMallName} />
        <DetailInfo title='店铺地址' value={result?.shopInformationAsics?.shopAddress} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='城市信息' showTips={false} />
      <Row>
        <DetailInfo title='城市级别' value={result?.shopInformationAsics?.cityLevelName} />
        <DetailInfo title='人口规模(万人)' value={result?.shopInformationAsics?.populationSize} />
        <DetailInfo title='GDP水平（亿元）' value={result?.shopInformationAsics?.gdpLevel} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='店铺结构' showTips={false} />
      <Row>
        <DetailInfo title='楼层方案' value={result?.shopInformationAsics?.floorPlanName} />
        <DetailInfo title='店招宽度(米)' value={result?.shopInformationAsics?.shopSignWidth} />
        <DetailInfo title='店铺净层高(米)' value={result?.shopInformationAsics?.shopNetHeight} />
        <DetailInfo title='实用面积(平米)' value={result?.shopInformationAsics?.usableArea} />
        <DetailInfo title='开口(米)' value={result?.shopInformationAsics?.openHole} />
        <DetailInfo title='进深(米)' value={result?.shopInformationAsics?.depth} />
        <DetailInfo title='是否同行聚集楼层' value={result?.shopInformationAsics?.isPeersGatherName	} />
        {
          result?.isOpenMall !== 1 && <DetailInfo title='是否儿童服饰楼层' value={result?.shopInformationAsics?.isOnKidClothingFloorName} />
        }
        <DetailInfo title='店铺备注信息' value={result?.shopInformationAsics?.shopRemark} row={3} />
        <DetailInfo span={24} title='店铺照片' value={result?.shopInformationAsics?.frontImageUrls}>
          <DetailImage imgs={result?.shopInformationAsics?.frontImageUrls}/>
        </DetailInfo>
        <DetailInfo span={24} title='楼层平面图' value={result?.shopInformationAsics?.planImageUrls}>
          <DetailImage imgs={result?.shopInformationAsics?.planImageUrls}/>
        </DetailInfo>
        <DetailInfo span={24} title='左右邻居照片' value={result?.shopInformationAsics?.neighborsPics}>
          <DetailImage imgs={result?.shopInformationAsics?.neighborsPics}/>
        </DetailInfo>
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='可见性' showTips={false} />
      <Row gutter={16}>
        <DetailInfo title='外立面可视性' value={result?.shopInformationAsics?.facadeVisibilityName} />
        <DetailInfo title='距离入口/扶梯' value={result?.shopInformationAsics?.distance2EntranceName} />
        <DetailInfo title='有无广告位/指引牌' value={result?.shopInformationAsics?.hasAdSpaceName} />
      </Row>
      {
        result?.isOpenMall === 1 && (
          <>
            <Divider style={{ marginTop: 14 }} />
            <TitleTips name='店铺客流' showTips={false} />
            <Row gutter={16}>
              <DetailInfo title='工作日过店客流（人/天）' value={result?.shopInformationAsics?.flowWeekday} />
              <DetailInfo title='节假日过店客流（人/天）' value={result?.shopInformationAsics?.flowWeekend} />
            </Row>
          </>
        )
      }
    </>
  );
};

export default BaseInfo;
