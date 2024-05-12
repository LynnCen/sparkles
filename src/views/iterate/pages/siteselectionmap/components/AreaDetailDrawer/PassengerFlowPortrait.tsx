/**
 * @Description 客流画像
 */

import { FC, useMemo } from 'react';
// import cs from 'classnames';
import { Row, Col } from 'antd';
// import cs from 'classnames';
import styles from './Charts/index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import AgeDistribution from './Charts/AgeDistribution';
import EducationRatio from './Charts/EducationRatio';
import ConsumeLevelRatio from './Charts/ConsumeLevelRatio';
import FoodConsumeLevelRatio from './Charts/FoodConsumeLevelRatio';
import HousePriceRatio from './Charts/HousePriceRatio';
import VisitPreferenceRatio from './Charts/VisitPreferenceRatio';

const PassengerFlowPortrait: FC<any> = ({
  ageDetail,
}) => {
  const chartsData = useMemo(() => {
    const result = {};
    ageDetail?.distributions?.forEach((item) => {
      if (item.type === '学历') {
        result['educational'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      } else if (item.type === '消费水平') {
        result['consumeLevel'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      } else if (item.type === '餐饮消费水平') {
        result['foodConsumeLevel'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      } else if (item.type === '居住社区房价等级') {
        result['housePrice'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      } else if (item.type === '到访偏好') {
        result['visitPreference'] = item.parts.map((part) => ({ name: part.name, value: part.rate }));
      }
    });
    return result;
  }, [ageDetail]);
  return (
    <div className={styles.chartsContainer}>

      <V2Title divider type='H2' text='客流画像'/>
      <div className={styles.desc}> {ageDetail?.introduction || '-'} </div>
      <Row gutter={16}>
        <Col span={12}>
          <AgeDistribution detail={ageDetail.ageRate} sexInfo={ageDetail.sexRate} />
        </Col>
        <Col span={12}>
          <EducationRatio detail={chartsData['educational']}/>
        </Col>
        <Col span={12} className='mt-16'>
          <ConsumeLevelRatio detail={chartsData['consumeLevel']}/>
        </Col>
        <Col span={12} className='mt-16'>
          <FoodConsumeLevelRatio detail={chartsData['foodConsumeLevel']}/>
        </Col>
        <Col span={12} className='mt-16'>
          <HousePriceRatio detail={chartsData['housePrice']}/>
        </Col>
        <Col span={12} className='mt-16'>
          <VisitPreferenceRatio detail={chartsData['visitPreference']}/>
        </Col>
      </Row>
    </div>
  );
};

export default PassengerFlowPortrait;

