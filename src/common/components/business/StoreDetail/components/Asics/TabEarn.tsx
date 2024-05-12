import { FC } from 'react';
import { Divider, Row } from 'antd';
import { beautifyThePrice } from '@lhb/func';
import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';

const TabEarn: FC<any> = ({
  result
}) => {

  return (
    <>
      <TitleTips name='收益预估' showTips={false} />
      <Row gutter={40}>
        <DetailInfo title='系统预计销售额（元/天)' value={beautifyThePrice(result?.earnEstimateAsics?.systemEstimatedSale, ',', 0)} />
        <DetailInfo title='租期总利润（万元）' value={beautifyThePrice(result?.earnEstimateAsics?.totalProfitDuringRent, ',', 0)} />
        <DetailInfo title='成本支出(元)' value={beautifyThePrice(result?.paymentCost, ',', 0)} />
        <DetailInfo title='保本销售额(元)' value={beautifyThePrice(result?.guaranteedSale, ',', 0)} />
        <DetailInfo title='人工预计销售额（元/天)' value={beautifyThePrice(result?.earnEstimateAsics?.estimatedSale, ',', 0)} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='装修投入' showTips={false} />
      <Row>
        <DetailInfo title='顶部状态' value={result?.earnEstimateAsics?.topStatusName} />
        {
          result?.earnEstimateAsics?.topStatus === 3 ? <DetailInfo title='顶部新做费用(元)' value={result?.earnEstimateAsics?.topCost} /> : null
        }
        <DetailInfo title='墙体状态' value={result?.earnEstimateAsics?.wallStatusName} />
        {
          result?.earnEstimateAsics?.wallStatus === 3 ? <DetailInfo title='墙体新做费用(元)' value={result?.earnEstimateAsics?.wallCost} /> : null
        }
        <DetailInfo title='地面状态' value={result?.earnEstimateAsics?.groundStatusName} />
        {
          result?.earnEstimateAsics?.groundStatus === 3 ? <DetailInfo title='地面新做费用(元)' value={result?.earnEstimateAsics?.groundCost} /> : null
        }
        <DetailInfo title='其他装修投入预估(元)' value={result?.earnEstimateAsics?.otherDecorationCost} />
        <DetailInfo title='装修投入总金额(元)' value={result?.earnEstimateAsics?.decorationCost} />
        <DetailInfo title='装修内容简述' value={result?.earnEstimateAsics?.decorationDesc} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='店铺经营' showTips={false} />
      <Row>
        <DetailInfo title='客单价(元)' value={result?.earnEstimateAsics?.perCustomerPrice} />
        <DetailInfo title='利润率(%)' value={result?.earnEstimateAsics?.profitRate} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='资产折旧' showTips={false} />
      <Row>
        <DetailInfo title='固定资产(元)' value={result?.earnEstimateAsics?.fixedAssets} />
        <DetailInfo title='折旧年限(年)' value={result?.earnEstimateAsics?.depreciationPeriod} />
        <DetailInfo title='固定资产说明' value={result?.earnEstimateAsics?.fixedAssetsRemark} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='人工成本' showTips={false} />
      <Row>
        <DetailInfo title='固定工资(元/年)' value={result?.earnEstimateAsics?.fixedSalary} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='其他成本' showTips={false} />
      <Row>
        <DetailInfo title='其他成本(元)' value={result?.earnEstimateAsics?.earnOtherCost} />
      </Row>
    </>
  );
};

export default TabEarn;
