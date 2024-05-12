import DetailInfo from '@/common/components/business/DetailInfo';
import { Row } from 'antd';
import { FC } from 'react';
import { LocationMap } from '@/common/components/business/StoreDetail';
import DetailImage from '@/common/components/business/DetailImage';

interface IProps {
  shopInfo: any;
}

const ShopInfo: FC<IProps> = ({ shopInfo }) => {
  return (
    <Row>
      <DetailInfo title='店铺地址' value={shopInfo.address} />
      <DetailInfo title='店铺类型' value={shopInfo.shopCategoryName} />
      <DetailInfo title='场地名称' value={shopInfo.placeName} />
      <DetailInfo title='楼层' value={shopInfo.floor} />
      <DetailInfo title='店铺编号' value={shopInfo.number} />
      <DetailInfo title='原店铺品牌' value={shopInfo.brand} />
      <DetailInfo title='合同面积(m²)' value={shopInfo.contractArea} />
      <DetailInfo title='实际使用面积(m²)' value={shopInfo.area} />
      <DetailInfo title='开面(m)' value={shopInfo.wide} />
      <DetailInfo title='层高(m)' value={shopInfo.height} />
      <DetailInfo
        title='关联踩点任务'
        linkUrl={`/storemanage/tapdetail?id=${shopInfo.projectId}&code=${shopInfo.code}`}
        value={shopInfo.projectName}
      />
      <DetailInfo title='备注' value={shopInfo.remark} />
      <DetailInfo title='楼层平面图' span={12}>
        <DetailImage imgs={shopInfo.url}/>
      </DetailInfo>
      <DetailInfo title='店铺正面图' span={12}>
        <DetailImage imgs={shopInfo.facePics}/>
      </DetailInfo>
      <DetailInfo title='可用外立面' span={24}>
        <DetailImage imgs={shopInfo.sidePics}/>
      </DetailInfo>
      <DetailInfo title='所在位置' span={23}>
        <LocationMap lng={shopInfo.lng} lat={shopInfo.lat} />
      </DetailInfo>
    </Row>
  );
};

export default ShopInfo;
