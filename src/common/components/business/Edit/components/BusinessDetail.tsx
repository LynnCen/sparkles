import { FC } from 'react';
import cs from 'classnames';
import styles from '../index.module.less';
import { Col, Row } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';

const BusinessDetail: FC<any> = ({
  detail = {}
}) => {
  return (
    <div className={styles.businessDetail}>
      <V2Title type='H3'>{detail.centerName}</V2Title>
      <div className={styles.businessDetailTag}>
        <V2Tag color='orange'>推荐开店 {detail.recommendStores || '0'}</V2Tag>
        <V2Tag color='green'>已开店 {detail.openStores || '0'}</V2Tag>
      </div>
      <div className={styles.businessDetailRate}>
        综合评估<span className={styles.businessDetailRateCore}>{detail.totalScore}</span>分
      </div>
      {
        false && <>
          <div className={styles.businessDetailRanking}>
        奶茶氛围在杭州市排行第<span className={styles.rankingNum}>4</span>
          </div>
          <div className={cs(styles.businessDetailRanking, styles.businessDetailRankingLast)}>
        项目体量在杭州市228个商场排行第<span className={styles.rankingNum}>2</span>
          </div>
          <V2DetailGroup moduleType='easy' direction='horizontal'>
            <Row>
              <Col span={12}>
                <V2DetailItem className={styles.specialItem} label='奶茶店数' value='11'></V2DetailItem>
                <V2DetailItem className={styles.specialItem} label='餐饮数量' value='22'></V2DetailItem>
              </Col>
              <Col span={12}>
                <V2DetailItem className={styles.specialItem} label='周边POI数' value='22' labelLength={5}></V2DetailItem>
                <V2DetailItem className={styles.specialItem} label='外卖客单价' value='22元' labelLength={5}></V2DetailItem>
              </Col>
              <Col span={24}>
                <V2DetailItem className={styles.specialItem} label='周边房价' value='11,221元/m²'></V2DetailItem>
              </Col>
            </Row>
          </V2DetailGroup>
        </>
      }
    </div>
  );
};

export default BusinessDetail;
