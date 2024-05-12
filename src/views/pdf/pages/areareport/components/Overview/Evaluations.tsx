/**
 * @Description 从商圈详情拷贝过来的
 */

import { FC, useMemo, } from 'react';
import styles from './index.module.less';
import ScoreLine from './ScoreLine';
import ScoreCard from './ScoreCard';
import { Col, Row } from 'antd';


const Evaluation: FC<any> = ({
  detail
}) => {
  const cardView = useMemo(() => detail?.scores || [], [detail]);
  const { resourceMallFlag } = detail || {};

  return (
    <div className={styles.evaluationCon}>
      {
        detail?.marketScore ? <ScoreLine
          totalScore={detail?.marketScore}
          resourceMallFlag={resourceMallFlag}
        /> : <></>
      }
      <div className={styles.allScoreCon}>
        <Row gutter={[44, 27]}>
          {cardView.length ? cardView.map((item) => (
            <Col span={24} key={item.name}>
              <ScoreCard
                title={item?.name}
                totalScore={item?.score}
                describe={item?.msg}
              />
            </Col>
          )) : <></>}
        </Row>
      </div>
    </div>
  );
};

export default Evaluation;
