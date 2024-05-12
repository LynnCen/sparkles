import { FC } from 'react';
import { Row, Divider } from 'antd'; // Button List Divider
import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailImage from '@/common/components/business/DetailImage';

interface IProps {
  result: any;
}

const CompeteEnv: FC<IProps> = ({
  result,
}) => {
  return (
    <>
      {
        result?.isOpenMall === 1 && (
          <>
            <TitleTips name='前三名竞品年销售额' showTips={false} />
            <Row>
              <DetailInfo title='Top1竞品年销售额(万元)' value={result?.competeEnvironmentAsics?.competeProductAnnualSaleFir} />
              <DetailInfo title='Top2竞品年销售额(万元)' value={result?.competeEnvironmentAsics?.competeProductAnnualSaleSec} />
              <DetailInfo title='Top3竞品年销售额(万元)' value={result?.competeEnvironmentAsics?.competeProductAnnualSaleThird} />
            </Row>
            <Divider style={{ marginTop: 14 }} />
          </>
        )
      }
      <TitleTips name='竞品详细信息' showTips={false} />
      <Row>
        <DetailInfo title='竞品名称' value={result?.competeEnvironmentAsics?.competeProductName} />
        <DetailInfo title='距离本店铺（米）' value={result?.competeEnvironmentAsics?.competeProductStoreDistance} />
        <DetailInfo title='竞品年销售额(万元)' value={result?.competeEnvironmentAsics?.competeProductAnnualSale} />
        <DetailInfo title='竞品店铺信息备注' value={result?.competeEnvironmentAsics?.competeProductRemark} />
        <DetailInfo span={24} title='竞品店铺图片' value={result?.competeEnvironmentAsics?.competeProductStorePics}>
          <DetailImage imgs={result?.competeEnvironmentAsics?.competeProductStorePics}/>
        </DetailInfo>
      </Row>
    </>
  );
};

export default CompeteEnv;
