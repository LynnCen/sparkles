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
        <DetailInfo title='预计交房时间' value={result?.businessInformation?.deliveryDate} />
        <DetailInfo title='预计签约时间' value={result?.businessInformation?.signDate} />
        <DetailInfo
          title='预计合同期限'
          value={parseDateRange(
            result?.businessInformation.contractDateStart,
            result?.businessInformation.contractDateEnd
          )}
        />
        <DetailInfo title='装修免租期(天)' value={result?.businessInformation?.decorationFreeDays} />
        <DetailInfo title='租金模式' value={result?.businessInformation?.rentalModelName} />
        { // 固定租金
          result?.businessInformation?.rentalModel === 1
            ? <DetailInfo title='首年租金(元/年)' value={result?.businessInformation?.firstYearRent} />
            : null
        }
        { // 扣点租金
          result?.businessInformation?.rentalModel === 2
            ? (
              <>
                <DetailInfo title='保底租金(元/年)' value={result?.businessInformation?.guaranteedRent} />
                <DetailInfo title='扣点值(%)' value={result?.businessInformation?.deductionRate} />
              </>
            )
            : null
        }
        <DetailInfo title={`年递增幅度(${result?.businessInformation?.increaseRateUnitName || ''})`} value={result?.businessInformation?.increaseRate} />
        <DetailInfo
          title='物业费'
          value={parseUnit(
            result?.businessInformation?.propertyCost,
            result?.businessInformation?.propertyPriceUnitName
          )}
        />
        <DetailInfo title='押金保证金(元)' value={result?.businessInformation?.securityCost} />
        <DetailInfo
          title='水电费(元)'
          value={parseUnit(
            result?.businessInformation?.waterPowerCost,
            result?.businessInformation?.waterPowerPriceUnitName
          )}
        />
        <DetailInfo
          title='车位租赁费(元)'
          value={parseUnit(
            result?.businessInformation?.parkRentalCost,
            result?.businessInformation?.parkRentalPriceUnitName
          )}
        />
        <DetailInfo
          title='转让费(元)'
          value={result?.businessInformation?.transferFee} />
        <DetailInfo title='其他费用(元)' value={result?.businessInformation?.businessOtherCost} />
        <DetailInfo title='其它费用说明' value={result?.businessInformation?.businessOtherCostRemark} />
        <DetailInfo title='发票类型' value={result?.businessInformation?.invoiceTypeName} />
        <DetailInfo title='发票税率' value={result?.businessInformation?.invoiceRate} />
        <DetailInfo title='付款方式' value={result?.businessInformation?.paymentTypeName} />
        <DetailInfo title='付款周期' value={result?.businessInformation?.paymentCycle} />
      </Row>
      <Divider style={{ marginTop: 14 }} />
      <TitleTips name='法务条款' showTips={false} />
      <Row>
        <DetailInfo title='出租方信息' value={result?.businessInformation?.lessorInformation} />
        <DetailInfo title='联系人/联系方式' value={result?.businessInformation?.lessorPhone} />
        <DetailInfo title='出租方性质' value={result?.businessInformation?.lessorNatureName} />
        <DetailInfo title='是否有抵押' value={result?.businessInformation?.isMortgageName} />
        <DetailInfo title='提前解约权' value={result?.businessInformation?.isTerminateRightName} />
        <DetailInfo title='违约赔偿规定' value={result?.businessInformation?.liquidatedProvisions} />
        <DetailInfo title='其他补充信息' value={result?.businessInformation?.businessRemark} />
      </Row>
      <DetailInfo title='执照信息'>
        <DetailImage imgs={result?.businessInformation?.licenseInformation} />
      </DetailInfo>
    </>
  );
};

export default TabBusiness;
