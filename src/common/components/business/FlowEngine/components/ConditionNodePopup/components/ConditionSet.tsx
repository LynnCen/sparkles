import { FC } from 'react';
// import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import { Col, Row } from 'antd';
import ConditionItem from './ConditionItem';

const ConditionSet: FC<any> = ({
  objRef,
  expressions,
  conditionIndex, }) => {
  return (
    <>
      <div className={styles.container}>
        <Row gutter={[4, 0]} align='middle' justify='end'>
          <Col span={4}></Col>
          <Col span={6} className={styles.col}>字段</Col>
          <Col span={6} className={styles.col}>比较</Col>
          <Col span={6} className={styles.col}>值</Col>
          <Col span={2}></Col>
        </Row>
        <ConditionItem
          objRef={objRef}
          conditionIndex={conditionIndex}
          expressions={expressions}
        />
      </div>
    </>
  );
};


export default ConditionSet;
