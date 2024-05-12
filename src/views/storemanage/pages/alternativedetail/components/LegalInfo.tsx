import DetailInfo from '@/common/components/business/DetailInfo';
import { numberToText } from '@/common/enums/options';
import { Row } from 'antd';
import { FC } from 'react';

interface IProps {
  legalInfo: any;
}

const LegalInfo: FC<IProps> = ({ legalInfo }) => {
  return (
    <Row>
      <DetailInfo title='出租方信息' value={legalInfo?.lessor} />
      <DetailInfo title='联系人/联系方式' value={`${legalInfo?.contact || '-'}/${legalInfo?.mobile || '-'}`} />
      <DetailInfo title='出租方性质' value={legalInfo?.lessorNatureName} />
      <DetailInfo title='是否有抵押' value={numberToText[legalInfo?.hasMortgage]} />
      <DetailInfo title='提前解约权' value={numberToText[legalInfo?.canEarlyStop]} />
      <DetailInfo title='违约赔偿规定' value={legalInfo?.compensation} />
      <DetailInfo title='其他规定' value={legalInfo?.otherPromise} />
    </Row>
  );
};

export default LegalInfo;
