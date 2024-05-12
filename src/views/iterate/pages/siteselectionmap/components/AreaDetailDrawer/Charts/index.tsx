/**
 * @Description 商圈详情-统计图
 */

import { FC, useMemo } from 'react';
import styles from './index.module.less';
// import cs from 'classnames';
import { isNotEmptyAny } from '@lhb/func';
import { Row, Col } from 'antd';
import BarChart from './BarChart';
import V2Title from '@/common/components/Feedback/V2Title';
import AgeDistribution from './AgeDistribution';
import HistoryRate from './HistoryRate';
import EducationRatio from './EducationRatio';
import ConsumeLevelRatio from './ConsumeLevelRatio';
import FoodConsumeLevelRatio from './FoodConsumeLevelRatio';
import HousePriceRatio from './HousePriceRatio';
import VisitPreferenceRatio from './VisitPreferenceRatio';
// import HistorySurround from '../HistorySurround';

const dataLimit = '2024年3月'; // 目前固定数据更新日期

const Charts: FC<any> = ({
  detail,
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
    <>
      {
        isNotEmptyAny(detail?.businessDistributions) ? <div className={styles.chartsContainer}>

          <V2Title divider type='H2' text='经营门店'
            extra={
              <span className={styles.tips}>数据更新时间截止{dataLimit}，与当前开店数据不完全一致。</span>
            }
          />
          <div className={styles.desc}> {detail?.businessDistributionsIntro || '-'} </div>
          <Row gutter={16}>
            <Col span={12}>
              <HistoryRate
                list={detail?.businessDistributions || []}
                historyList={detail?.historyBusinessDistributions || []}
              />
            </Col>
            <Col span={12}>
              <BarChart detail={detail}/>
            </Col>
          </Row>
          {/* <HistorySurround detail={detail} /> */}
        </div> : <></>
      }


      {
        isNotEmptyAny(detail?.businessDistributions) ? <div className={styles.chartsContainer}>

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
        </div> : <></>
      }


    </>

  );
};

export default Charts;
