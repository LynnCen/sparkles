/**
 * @Description 机会点详情-日均客流预测组件
 *
 *   控件 提交、回显的textValue参数格式
 {
    optionName: '10点至11点',
    optionValue: 23.01,
    optionId: 1,
    // url: 'https://middle-file.linhuiba.com/FgtlpLyOcFw9dAu__zdCpRauCqjw',
    // urlName: '客流转化系数维护模版-zhouda_副本6.xlsx',
    collection: 1000,
    dailyPredict: 23010,
    dailyCorrect: 34567,
 }
 */
import { FC } from 'react';
import { Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { isNotEmpty } from '@lhb/func';

const DailyFlowDetail: FC<any> = ({
  info = {},
  detailInfoConfig = { span: 12 },
}) => {

  return (
    <>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='客流采集时间段' value={info?.optionName}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='采集客流量' value={info?.collection}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='预测日均客流' value={`${isNotEmpty(info?.dailyPredict) ? `${info.dailyPredict}人/天` : '-'}`} />
      </Col>
    </>
  );
};

export default DailyFlowDetail;
