import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';
import TabTitle from './TabTitle';

const IncomeTab:FC<any> = ({ data }) => {

  return (
    <div className={styles.tabInfoContent}>
      <TabTitle name='收益预估' />
      <TitleTips className={styles.secondTitle} name='装修投入' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='顶部状态' value={data.topStatusName} />
        { data.topStatus === 3 && <DetailInfo title='顶部新做费用(元)' value={data.topCost} /> }
        <DetailInfo title='墙体状态' value={data.wallStatusName} />
        { data.wallStatus === 3 && <DetailInfo title='墙体新做费用(元)' value={data.wallCost} /> }
        <DetailInfo title='地面状态' value={data.groundStatusName} />
        { data.groundStatus === 3 && <DetailInfo title='地面新做费用(元)' value={data.groundCost} /> }
        <DetailInfo title='其他装修投入预估(元)' value={data.otherDecorationCost} />
        <DetailInfo title='装修投入总金额(元)' value={data.decorationCost} />
        <DetailInfo title='装修内容描述' value={data.decorationDesc} />
      </Row>
      <TitleTips className={styles.secondTitle} name='店铺经营' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='客单价(元)' value={data.perCustomerPrice} />
        <DetailInfo title='利润率(%)' value={data.profitRate} />
      </Row>
      <TitleTips className={styles.secondTitle} name='资产折旧' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='固定资产(元)' value={data.fixedAssets} />
        <DetailInfo title='折旧年限(年)' value={data.depreciationPeriod} />
        <DetailInfo title='固定资产说明' value={data.fixedAssetsRemark} />
      </Row>
      <TitleTips className={styles.secondTitle} name='人工成本' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='固定工资(元/年)' value={data.fixedSalary} />
      </Row>
      <TitleTips className={styles.secondTitle} name='其他成本' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='其他成本(元)' value={data.earnOtherCost} />
      </Row>
    </div>
  );
};

export default IncomeTab;
