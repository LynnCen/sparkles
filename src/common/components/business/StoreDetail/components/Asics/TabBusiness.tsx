import { FC } from 'react';
import { Row, Divider } from 'antd'; // Button List Divider
import DetailInfo from '@/common/components/business/DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailImage from '@/common/components/business/DetailImage';

const TabBusiness: FC<any> = ({
  parseUnit,
  parseDateRange,
  result,
}) => {

  return (
    <>
      <TitleTips name='租赁条款' showTips={false} />
      <Row>
        <DetailInfo title='预计交房时间' value={result?.businessInformationAsics?.deliveryDate} />
        <DetailInfo title='预计签约时间' value={result?.businessInformationAsics?.signDate} />
        <DetailInfo
          title='预计合同期限'
          value={parseDateRange(
            result?.businessInformationAsics.contractDateStart,
            result?.businessInformationAsics.contractDateEnd
          )}
        />
        <DetailInfo title='装修免租期(天)' value={result?.businessInformationAsics?.decorationFreeDays} />
        <DetailInfo title='租金模式' value={result?.businessInformationAsics?.rentalModelName} />
        { // 固定租金
          result?.businessInformationAsics?.rentalModel === 1
            ? <DetailInfo title='首年租金(元/年)' value={result?.businessInformationAsics?.firstYearRent} />
            : null
        }
        { // 扣点租金
          result?.businessInformationAsics?.rentalModel === 2
            ? (
              <>
                <DetailInfo title='保底租金(元/年)' value={result?.businessInformationAsics?.guaranteedRent} />
                <DetailInfo title='扣点值(%)' value={result?.businessInformationAsics?.deductionRate} />
              </>
            )
            : null
        }
        <DetailInfo title={`年递增幅度(${result?.businessInformationAsics?.increaseRateUnitName || ''})`} value={result?.businessInformationAsics?.increaseRate} />
        <DetailInfo
          title='物业费'
          value={parseUnit(
            result?.businessInformationAsics?.propertyCost,
            result?.businessInformationAsics?.propertyPriceUnitName
          )}
        />
        <DetailInfo title='押金保证金(元)' value={result?.businessInformationAsics?.securityCost} />
        <DetailInfo
          title='水电费(元)'
          value={parseUnit(
            result?.businessInformationAsics?.waterPowerCost,
            result?.businessInformationAsics?.waterPowerPriceUnitName
          )}
        />
        <DetailInfo
          title='车位租赁费(元)'
          value={parseUnit(
            result?.businessInformationAsics?.parkRentalCost,
            result?.businessInformationAsics?.parkRentalPriceUnitName
          )}
        />
        <DetailInfo
          title='转让费(元)'
          value={result?.businessInformationAsics?.transferFee} />
        <DetailInfo title='其他费用(元)' value={result?.businessInformationAsics?.businessOtherCost} />
        <DetailInfo title='其它费用说明' value={result?.businessInformationAsics?.businessOtherCostRemark} />
        <DetailInfo title='发票类型' value={result?.businessInformationAsics?.invoiceTypeName} />
        <DetailInfo title='发票税率' value={result?.businessInformationAsics?.invoiceRate} />
        <DetailInfo title='付款方式' value={result?.businessInformationAsics?.paymentTypeName} />
        <DetailInfo title='付款周期' value={result?.businessInformationAsics?.paymentCycle} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='法务条款' showTips={false} />
      <Row>
        <DetailInfo title='出租方信息' value={result?.businessInformationAsics?.lessorInformation} />
        <DetailInfo title='联系人/联系方式' value={result?.businessInformationAsics?.lessorPhone} />
        <DetailInfo title='出租方性质' value={result?.businessInformationAsics?.lessorNatureName} />
        <DetailInfo title='是否有抵押' value={result?.businessInformationAsics?.isMortgageName} />
        <DetailInfo title='提前解约权' value={result?.businessInformationAsics?.isTerminateRightName} />
        <DetailInfo title='违约赔偿规定' value={result?.businessInformationAsics?.liquidatedProvisions} />
        <DetailInfo title='其他补充信息' value={result?.businessInformationAsics?.businessRemark} />
      </Row>
      <DetailInfo title='执照信息'>
        <DetailImage imgs={result?.businessInformationAsics?.licenseInformation} />
      </DetailInfo>
    </>
  );
};

export default TabBusiness;
