import { FC } from 'react';
import { Row } from 'antd';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailInfo from '@/common/components/business/DetailInfo';

const ShopInfo: FC<any> = ({
  result,
  isTargetShop,
  isFood
}) => {
  return (
    <>
      {
        isTargetShop ? (
          <>
            <TitleTips name='商场信息' showTips={false} />
            <Row>
              <DetailInfo title='是否开业' value={result?.mallInformation?.isOpenName} />
              {
                result?.mallInformation?.isOpen === 1 ? (<>
                  <DetailInfo title='运营年限（年）' value={result?.mallInformation?.openingYears} />
                  <DetailInfo title='快消品牌数' value={result?.mallInformation?.fastBrandNumName} />
                  <DetailInfo title='商场年销售额（万元）' value={result?.mallInformation?.mallAnnualSales} />
                  <DetailInfo title='满铺率（%）' value={result?.mallInformation?.fullCoverageRate} />
                  <DetailInfo title='餐饮门店数量（个）' value={result?.mallInformation?.restaurantsNum} />
                  <DetailInfo title='娱乐门店数量（个）' value={result?.mallInformation?.entertainmentStoreNum} />
                </>) : null
              }
              {
                result?.mallInformation?.isOpen === 2 ? (<>
                  <DetailInfo title='预计开业时间' value={result?.mallInformation?.estimatedOpeningDate} />
                  <DetailInfo title='招商完成率（%）' value={result?.mallInformation?.investmentCompletionRate} />
                  <DetailInfo title='已签快消/奢侈品牌' value={result?.mallInformation?.fastSalesLuxuryBrandNumName} />
                  <DetailInfo title='已签超市品牌' value={result?.mallInformation?.superMarketNumName}/>
                </>) : null
              }
              <DetailInfo title='停车位（个）' value={result?.mallInformation?.parkingNum}/>
              <DetailInfo title='消费档次' value={result?.mallInformation?.consumptionLevelName}/>
              <DetailInfo title='小区数量（个）' value={result?.mallInformation?.communityNum}/>
              <DetailInfo title='距离附近核心企业（米）' value={result?.mallInformation?.coreBusinessDistance}/>
              <DetailInfo title='商业体量排名' value={result?.mallInformation?.businessRankName}/>
              <DetailInfo title='运营商等级' value={result?.mallInformation?.operatorLevelName}/>
            </Row>
          </>
        ) : null
      }
      {
        isFood && !isTargetShop ? (<>
          <TitleTips name='商业氛围' showTips={false} />
          <Row>
            <DetailInfo title='周边房价（元/㎡）' value='18819' />
            <DetailInfo title='所属商圈' value='良渚商圈' />
            <DetailInfo title='商圈等级' value='A级' />
            <DetailInfo title='聚客场所数量（个）' value='391' />
            <DetailInfo title='聚客场所备注' value='附近游乐设施和场所较多' />
            <DetailInfo title='周边店铺开业率（%）' value='92' />
            <DetailInfo title='连锁快餐品牌数（个）' value='12' />
            <DetailInfo title='低端餐饮品牌占比（%）' value='60' />
            <DetailInfo title='同品类失败案例' value='无' />
          </Row>
        </>) : null
      }
    </>
  );
};

export default ShopInfo;
