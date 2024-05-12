import DetailInfo from '@/common/components/business/DetailInfo';
// import { approvalStatusClass } from '@/common/utils/ways';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row } from 'antd';
import { FC } from 'react';
import LocationMap from './LocationMap';
import DetailImage from '@/common/components/business/DetailImage';


interface IProps {
  result: any;
  isFood?: boolean;
}

const BaseInfo: FC<IProps> = ({
  result,
  isFood
}) => {
  // const { Link } = Typography;
  return (
    <>
      <TitleTips name='基本信息' showTips={false} />
      <Row gutter={[16, 0]}>
        {
          isFood ? <DetailInfo title='店铺名称' value='庆丰川鱼头火锅' /> : null
        }
        <DetailInfo title='店铺类型' value={result?.shopInformation?.shopCategoryName} />
        {
          isFood ? null : <DetailInfo title='店铺等级' value={result?.shopInformation?.shopTypeName} />
        }
        {
          isFood ? null : (
            <>
              {
                // 1商场 2 街铺
                result?.shopInformation?.shopCategory === 2 ? (
                  <>
                    <DetailInfo title='项目名称' value={result?.shopInformation?.projectName} />
                    <DetailInfo title='门牌号' value={result?.shopInformation?.shopNo} />
                  </>
                ) : (
                  <>
                    <DetailInfo title='商场名称' value={result?.shopInformation?.mallName} />
                    <DetailInfo title='店铺编号' value={result?.shopInformation?.shopCode} />
                  </>
                )
              }
            </>
          )
        }
        <DetailInfo title='所属楼层' value={result?.shopInformation?.shopFloor ? result.shopInformation.shopFloor + '层' : undefined} />
        <DetailInfo title='店铺定位' value={result?.shopInformation?.shopAddress} />
        <DetailInfo title='店铺净层高(米)' value={result?.shopInformation?.shopHeight} />
        <DetailInfo title='合同面积(平米)' value={result?.shopInformation?.contractArea} />
        <DetailInfo title='实用面积(平米)' value={result?.shopInformation?.usableArea} />
        {
          isFood ? <DetailInfo title='外摆面积(m²)' value={20} /> : null
        }
        <DetailInfo title='展面数' value={result?.shopInformation?.exhibitionNumName} />
        <DetailInfo title='店铺门宽(米)' value={result?.shopInformation?.shopWidth} />
        <DetailInfo title='门头宽度(米)' value={result?.shopInformation?.doorWidth} />
        <DetailInfo title='店铺进深(米)' value={result?.shopInformation?.shopDepth} />
        <DetailInfo title='店铺形状' value={result?.shopInformation?.shopShapeName} />
        {
          isFood ? null : (
            <>
              <DetailInfo title='承重墙' value={result?.shopInformation?.loadWallNumName} />
              <DetailInfo title='承重柱' value={result?.shopInformation?.loadColumnNumName} />
            </>
          )
        }
        <DetailInfo title='店铺目前状态' value={result?.shopInformation?.shopBusinessStatusName} />
        <DetailInfo title='原店铺品牌' value={result?.shopInformation?.originalShopBrand} />
        <DetailInfo title='原商户合约到期时间' value={result?.shopInformation?.originalExpireDate} />
        <DetailInfo title='店铺备注信息' value={result?.shopInformation?.shopRemark} row={3} />

        <DetailInfo span={24} title='楼层平面图' value={result?.shopInformation?.planImageUrls}>
          <DetailImage imgs={result?.shopInformation?.planImageUrls}/>
        </DetailInfo>
        <DetailInfo span={24} title='店铺正面图' value={result?.shopInformation?.frontImageUrls}>
          <DetailImage imgs={result?.shopInformation?.frontImageUrls}/>
        </DetailInfo>

        <DetailInfo title='所在位置' span={24}>
          <LocationMap lng={result.lng} lat={result.lat} />
        </DetailInfo>
      </Row>
      {
        isFood ? (<>
          <TitleTips name='可见性' showTips={false} />
          <Row gutter={16}>
            <DetailInfo title='是否档口' value='否' />
            <DetailInfo title='门面形态' value='齐平于周边门店' />
            <DetailInfo title='门前是否有遮挡' value='否' />
            <DetailInfo title='对面可见性' value='50米范围内可见' />
            <DetailInfo title='同侧可见性' value='50米范围内可见' />
            <DetailInfo title='是否位于阳面' value='是' />
            <DetailInfo title='是否位于西晒' value='否' />
            <DetailInfo title='有无门头侧招' value='有' />
            <DetailInfo title='有无广告位或指引牌' value='无' />
          </Row>
        </>) : (
          <>
            {/* 店铺类型-商场 */}
            {result?.shopCategory === 1 || result?.shopInformation?.shopCategory === 1
              ? (
                <>
                  <TitleTips name='项目方案' showTips={false} />
                  <Row gutter={16}>
                    <DetailInfo title='楼层方案' value={result?.shopInformation?.floorPlanName} />
                    <DetailInfo title='可见性' value={result?.shopInformation?.visibilityName} />
                    <DetailInfo title='距离入口/扶梯(m)' value={result?.shopInformation?.escalatorEntranceDistance} />
                    <DetailInfo title='得房率(%)' value={result?.shopInformation?.roomRate} />
                  </Row>
                </>
              ) : null
            }
          </>
        )
      }
    </>
  );
};

export default BaseInfo;
