/**
 * @Description 评分
 */

import { FC } from 'react';
import { Row, Col, Progress, Divider } from 'antd';

const ScoreOverview: FC<any> = ({
  evaluateInfo
}) => {
  const { subsection } = evaluateInfo;

  return (
    <>
      <Row gutter={4} className='mt-5'>
        {
          subsection.map((item, index) => <Col key={index} span={8}>
            <Progress
              percent={item.percent}
              showInfo={false}
              strokeLinecap='butt'
              strokeColor={evaluateInfo?.color}
              trailColor='#eee'
            />
            <div className='c-666 fs-12'>
              {item.text}
            </div>
          </Col>)
        }
      </Row>

      <Divider style={{
        borderColor: '#eee',
        // borderWidth: '1px',
        margin: '12px 0 0'
      }}/>
    </>
  );
};

export default ScoreOverview;
