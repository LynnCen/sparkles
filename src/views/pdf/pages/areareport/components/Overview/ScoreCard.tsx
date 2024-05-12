/**
 * @Description 得分卡片
 */
import { FC } from 'react';
import styles from './index.module.less';
import { Col, Row } from 'antd';

const ScoreCard: FC<any> = ({
  title = '-',
  totalScore = 100,
  describe = '-'
}) => {
  // 在这里编写组件的逻辑和渲染
  return (
    <div className={styles.scoreCard}>
      <div className={styles.titleCon}>
        <span>
          {title }
        </span>
        <span>
          {totalScore}
        </span>
      </div>
      <div className={styles.lineCon}>
        <Row gutter={8}>
          <Col span={8}>
            <span className={`${styles.line} ${styles.lowScore}`} style={{
            }} />
          </Col>
          <Col span={8}>
            <span className={`${styles.line} ${styles.middleScore}`} style={{
            }} />
          </Col>
          <Col span={8}>
            <span className={`${styles.line} ${styles.highScore}`} style={{
            }} />
          </Col>
        </Row>


        <span className={styles.scoreTag}
          style={{
            left: `${(totalScore && totalScore > 100 ? 98 : totalScore) || 0}%` // 会有偏移
          }}
        />
      </div>
      <div className={styles.desc}>
        {describe}</div>
    </div>
  );
};

export default ScoreCard;
