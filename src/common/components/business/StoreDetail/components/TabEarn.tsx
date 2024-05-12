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
        <DetailInfo title='保本销售额(元)' value={beautifyThePrice(result.guaranteedSale, ',', 0)} />
        <DetailInfo title='总成本支出(元)' value={beautifyThePrice(result.paymentCost, ',', 0)} />
        <DetailInfo title='预计销售额（元/年)' value={beautifyThePrice(result.estimatedSale, ',', 0)} />
        <DetailInfo title='租期总利润（元）' value={beautifyThePrice(result.totalProfitDuringRent, ',', 0)} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='装修投入' showTips={false} />
      <Row>
        <DetailInfo title='最大电功率(kw)' value={result?.earnEstimate?.currentPower} />
        <DetailInfo title='是否需要增容' value={result?.earnEstimate?.isExpansionName} />
        {
          result?.earnEstimate?.isExpansion === 1 ? <DetailInfo title='增容费用(元)' value={result?.earnEstimate?.expansionCost} /> : null
        }
        <DetailInfo title='顶部状态' value={result?.earnEstimate?.topStatusName} />
        {
          result?.earnEstimate?.topStatus === 3 ? <DetailInfo title='顶部新做费用(元)' value={result?.earnEstimate?.topCost} /> : null
        }
        <DetailInfo title='墙体状态' value={result?.earnEstimate?.wallStatusName} />
        {
          result?.earnEstimate?.wallStatus === 3 ? <DetailInfo title='墙体新做费用(元)' value={result?.earnEstimate?.wallCost} /> : null
        }
        <DetailInfo title='地面状态' value={result?.earnEstimate?.groundStatusName} />
        {
          result?.earnEstimate?.groundStatus === 3 ? <DetailInfo title='地面新做费用(元)' value={result?.earnEstimate?.groundCost} /> : null
        }
        <DetailInfo title='上下水状态' value={result?.earnEstimate?.waterStatusName} />
        {
          result?.earnEstimate?.waterStatus === 3 ? <DetailInfo title='上下水新做费用(元)' value={result?.earnEstimate?.waterCost} /> : null
        }
        <DetailInfo title='其他装修投入预估(元)' value={result?.earnEstimate?.otherDecorationCost} />
        <DetailInfo title='装修投入总金额(元)' value={result?.earnEstimate?.decorationCost} />
        <DetailInfo title='装修内容简述' value={result?.earnEstimate?.decorationDesc} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='店铺经营' showTips={false} />
      <Row>
        <DetailInfo title='客单价(元)' value={result?.earnEstimate?.perCustomerPrice} />
        <DetailInfo title='利润率(%)' value={result?.earnEstimate?.profitRate} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='资产折旧' showTips={false} />
      <Row>
        <DetailInfo title='固定资产(元)' value={result?.earnEstimate?.fixedAssets} />
        <DetailInfo title='折旧年限(年)' value={result?.earnEstimate?.depreciationPeriod} />
        <DetailInfo title='固定资产说明' value={result?.earnEstimate?.fixedAssetsRemark} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='人工成本' showTips={false} />
      <Row>
        <DetailInfo title='固定工资(元)' value={result?.earnEstimate?.fixedSalary} />
      </Row>
      <Divider style={{ marginTop: 14 }} />

      <TitleTips name='其他成本' showTips={false} />
      <Row>
        <DetailInfo title='其他成本(元)' value={result?.earnEstimate?.earnOtherCost} />
      </Row>
    </>
  );
};

export default TabEarn;
