import { FC } from 'react';
import { Row } from 'antd';
import DetailInfo from '@/common/components/business/DetailInfo';
import DetailImage from '@/common/components/business/DetailImage';

// https://cert.linhuiba.com/FuZJ6wkqO59KBCh6Bj0zyOYe-NA7"
const ShopInfo: FC<any> = ({ data }) => {
  const { shopInfo } = data;
  return (
    <Row gutter={[16, 0]}>
      <DetailInfo span={8} title='场地名称' value={shopInfo?.placeName} />
      <DetailInfo span={8} title='场地类型' value={shopInfo?.placeCategoryName} />
      <DetailInfo span={8} title='所属城市' value={shopInfo?.city} />
      <DetailInfo span={8} title='详细地址' value={shopInfo?.placeAddress} />
      <DetailInfo span={24} title='商圈楼层导览图' value={shopInfo?.floorPics}>
        <DetailImage imgs={shopInfo?.floorPics} />
      </DetailInfo>
    </Row>
  );
};

export default ShopInfo;
