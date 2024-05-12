import DetailInfo from '@/common/components/business/DetailInfo';
import { cooperationModel } from '@/common/enums/options';
import { Row } from 'antd';
import { FC } from 'react';

interface IProps {
  commercialInfo: any;
  type?: 'reserve' | undefined;
}

const CommercialInfo: FC<IProps> = ({ commercialInfo, type }) => {
  return (
    <Row>
      <DetailInfo title={type === 'reserve' ? '合同实际起始时间' : '合同起始时间'} value={commercialInfo?.start} />
      <DetailInfo title={type === 'reserve' ? '合同实际到期时间' : '合同到期时间'} value={commercialInfo?.end} />
      <DetailInfo title='免租期(天)' value={commercialInfo?.freeDay} />
      <DetailInfo title={type === 'reserve' ? '实际交房时间' : '预计交房时间'} value={commercialInfo?.deliveryDate} />
      <DetailInfo title='租金模式' value={commercialInfo?.cooperationName} />
      {commercialInfo?.cooperationModelId && (
        <DetailInfo
          title={`${cooperationModel[commercialInfo.cooperationModelId]}(${
            commercialInfo.cooperationModelId === 1 ? '元' : commercialInfo.rentUnitName
          })`}
          value={commercialInfo.rent}
        />
      )}

      {commercialInfo?.cooperationModelId === 2 && (
        <DetailInfo title='扣点' value={`${commercialInfo.propertyPoint}%`} />
      )}
      <DetailInfo title='年递增幅度(%)' value={commercialInfo?.rentInfo} />
      <DetailInfo
        title={`物业费(${commercialInfo?.propertyFeeUnitName || '元/年'})`}
        value={commercialInfo?.propertyFee}
      />
      <DetailInfo title='其他费用(元)' value={commercialInfo?.otherFee} />
      <DetailInfo title='押金保证金(元)' value={commercialInfo?.earnestMoney} />
      <DetailInfo title='付款方式' value={commercialInfo?.payMethod} />
      <DetailInfo
        title='发票类型及税率'
        value={
          !commercialInfo?.invoiceTypeName && !commercialInfo?.taxRate
            ? '-'
            : `${commercialInfo?.invoiceTypeName || ''} | 税率${commercialInfo?.taxRate || '-'}%`
        }
      />
      <DetailInfo title='备注' value={commercialInfo?.remark} />
    </Row>
  );
};

export default CommercialInfo;
