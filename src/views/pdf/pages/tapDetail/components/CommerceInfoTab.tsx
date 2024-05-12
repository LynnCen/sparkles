import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row, Space } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';
import TabTitle from './TabTitle';

const CommerceInfoTab:FC<any> = ({ data }) => {

  return (
    <div className={styles.tabInfoContent}>
      <TabTitle name='商务信息' />
      <TitleTips className={styles.secondTitle} name='租赁条款' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='预计交房时间' value={data.deliveryDate} />
        <DetailInfo title='预计签约时间' value={data.signDate} />
        <DetailInfo title='预计合同开始时间' value={data.contractDateStart} />
        <DetailInfo title='预计合同结束时间' value={data.contractDateEnd} />
        <DetailInfo title='装修免租期(天)' value={data.decorationFreeDays} />
        <DetailInfo title='租金模式' value={data.rentalModelName} />
        { data.rentalModel === 1 && <DetailInfo title='首年租金(元/年)' value={data.firstYearRent} /> }
        { data.rentalModel === 2 && (
          <>
            <DetailInfo title='保底租金(元/年)' value={data.guaranteedRent} />
            <DetailInfo title='扣点值(%)' value={data.deductionRate} />
          </>
        ) }
        <DetailInfo title={`年递增幅率(${data.increaseRateUnitName})`} value={data.increaseRate} />
        <DetailInfo title='押金保证金(元)' value={data.securityCost} />
        <DetailInfo title={`物业费(${data.propertyPriceUnitName})`} value={data.propertyCost} />
        <DetailInfo title={`水电费(${data.waterPowerPriceUnitName})`} value={data.waterPowerCost} />
        <DetailInfo title={`车位租赁费(${data.parkRentalPriceUnitName})`} value={data.parkRentalCost} />
        <DetailInfo title='转让费(元)' value={data.transferFee} />
        <DetailInfo title='其他费用(元)' value={data.businessOtherCost} />
        <DetailInfo title='其他费用说明' value={data.businessOtherCostRemark} />
        <DetailInfo title='发票类型' value={data.invoiceTypeName} />
        <DetailInfo title='发票税率(%)' value={data.invoiceRate} />
        <DetailInfo title='付款方式' value={data.paymentTypeName} />
        <DetailInfo title='付款周期' value={data.paymentCycle} />
      </Row>
      <TitleTips className={styles.secondTitle} name='法务条款' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='出租方信息' value={data.lessorInformation} />
        <DetailInfo title='联系人/联系方式' value={data.lessorPhone} />
        <DetailInfo title='出租方性质' value={data.lessorNatureName} />
        <DetailInfo title='是否有抵押' value={data.isMortgageName} />
        <DetailInfo title='提前解约权' value={data.isTerminateRightName} />
        <DetailInfo title='违约赔偿约定' value={data.liquidatedProvisions} />
        <DetailInfo title='其他补充信息' value={data.businessRemark} />
      </Row>
      { data.licenseInformation ? (
        <>
          <TitleTips className={styles.secondTitle} name='营业执照' showTips={false} />
          <Space className={styles.imagesContent}>
            { data.licenseInformation && data.licenseInformation.map((item, index) => (
              <img src={item} key={index} />
            )) }
          </Space>
        </>
      ) : <DetailInfo title='营业执照' value='-' /> }
    </div>
  );
};

export default CommerceInfoTab;
