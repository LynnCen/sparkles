/**
 * @Description 经营业态
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
// import cs from 'classnames';
import styles from './Charts/index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';
import HistoryRate from './Charts/HistoryRate';
import BarChart from './Charts/BarChart';

const dataLimit = '2024年3月'; // 目前固定数据更新日期

const TypeOfBusiness: FC<any> = ({
  detail
}) => {

  return (
    <div className={styles.chartsContainer}>
      <V2Title divider type='H2' text='经营业态'
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
    </div>
  );
};

export default TypeOfBusiness;
