import { FC } from 'react';
import { Row } from 'antd';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailInfo from '@/common/components/business/DetailInfo';

const TabTakeout: FC<any> = ({ result }) => {
  return (
    <>
      <TitleTips name='美团外卖' showTips={false} />
      <Row>
        <DetailInfo title='销量过千竞品门店数量(个)' value={result?.takeawayAtmosphere?.mtOver1000CompetingShop} />
        <DetailInfo title='销量过千重点门店数量(个)' value={result?.takeawayAtmosphere?.mtOver1000KeyShop} />
      </Row>
      <TitleTips name='饿了么外卖' showTips={false} />
      <Row>
        <DetailInfo title='销量过千竞品门店数量(个)' value={result?.takeawayAtmosphere?.elmOver1000CompetingShop} />
        <DetailInfo title='销量过千重点门店数量(个)' value={result?.takeawayAtmosphere?.elmOver1000KeyShop} />
      </Row>
    </>
  );
};

export default TabTakeout;
