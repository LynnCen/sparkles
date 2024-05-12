import { FC } from 'react';
import { Row } from 'antd';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import DetailInfo from '@/common/components/business/DetailInfo';

const TabEngineering: FC<any> = ({
  result,
  isFood
}) => {


  return (
    <>
      <TitleTips name='工程条件' showTips={false} />
      <Row>
        <DetailInfo title='有无外机位置' value={result?.engineCondition?.haveMachineName} />
        <DetailInfo title='有无三相电' value={result?.engineCondition?.havePowerName} />
        <DetailInfo title='有无上下水' value={result?.engineCondition?.haveWaterName} />
        <DetailInfo title='是否可以明火' value={result?.engineCondition?.haveFireName} />
        <DetailInfo title='有无排污管' value={result?.engineCondition?.haveSewagePipeName} />
        <DetailInfo title='有无烟道管' value={result?.engineCondition?.haveSmokePipeName} />
        {
          isFood ? (<>
            <DetailInfo title='是否有天燃气' value='否' />
            <DetailInfo title='有无消防系统' value='无' />
            <DetailInfo title='有无上下货通道' value='无' />
          </>) : null
        }
      </Row>
    </>
  );
};

export default TabEngineering;
