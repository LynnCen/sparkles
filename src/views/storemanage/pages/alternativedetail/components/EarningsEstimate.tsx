import DetailInfo from '@/common/components/business/DetailInfo';
import { cooperationModel } from '@/common/enums/options';
import { Row } from 'antd';
import { FC } from 'react';
import { beautifyThePrice, isNotEmpty } from '@lhb/func';

interface IProps {
  estimate: any;
  costInfo: any;
}

const EarningsEstimate: FC<IProps> = ({ estimate, costInfo }) => {
  const formatValue = (val: number) => {
    if (!isNotEmpty(val)) return '-';
    return `${beautifyThePrice(+val)}`;
  };

  return (
    <Row>
      <DetailInfo title='租期总利润(元)' value={formatValue(estimate?.profit)} />
      <DetailInfo title='首年销售额(元)' value={formatValue(estimate?.firstSaleAmount)} />
      {costInfo?.cooperationModelId && (
        <DetailInfo
          title={`${cooperationModel[costInfo.cooperationModelId]}(${
            costInfo.cooperationModelId === 1 ? '元' : costInfo.rentUnitName
          })`}
          value={costInfo.rent}
        />
      )}

      {costInfo?.cooperationModelId === 2 && <DetailInfo title='扣点' value={`${costInfo.propertyPoint}%`} />}
      <DetailInfo title='装修投入(万元)' value={costInfo?.totalDecorateCost} />
      <DetailInfo title='其他成本(元)' value={costInfo?.otherCost} />
      <DetailInfo title='首年净利润(元）' value={formatValue(estimate?.firstNetProfit)} />
      <DetailInfo title='首年租售比' value={estimate?.firstRate ? `${estimate?.firstRate}%` : '-'} />
    </Row>
  );
};

export default EarningsEstimate;
