/**
 * @Description
 */

import { FC, useMemo, } from 'react';
import styles from './index.module.less';
import ScoreLine from './components/ScoreLine';
import ScoreCard from './components/ScoreCard';
import { Col, Row } from 'antd';


const Evaluation: FC<any> = ({
  detail
}) => {
  const cardView = useMemo(() => detail?.scores || [], [detail]);
  const { resourceMallFlag } = detail || {};
  // 在这里编写组件的逻辑和渲染
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
            <Col span={12} key={item.name}>
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
