/**
 * @Description 评分概览行
 */

import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';
import Entrance from '../../CreateFavorite/Entrance';

const ScoreOverviewRow: FC<any> = ({
  overviewData,
  evaluateInfo,
}) => {
  const { isFavourate, id } = overviewData;
  const [collectStatus, setCollectStatus] = useState(isFavourate);

  useEffect(() => {
    setCollectStatus(!!isFavourate);
  }, [isFavourate]);
  return (
    <Row
      justify='center'
      align='middle'
    >
      <Col span={18}>
        <span className='fs-12 c-666'>评分</span>
        <span className='fs-20 pl-4 bold ff-impact' style={{
          color: evaluateInfo.color
        }}>{overviewData?.marketScore}</span>
        <span className='fs-12 c-666'>
          （{evaluateInfo?.str}）
        </span>
      </Col>
      <Col span={6} className='fs-12 c-666'>
        <Entrance
          eventId='5e2953d3-b186-472d-be09-ca0cdd7e81ba'
          clusterId={id}
          collectStatus={collectStatus}
          setCollectStatus={setCollectStatus}
        />
      </Col>
    </Row>
  );
};

export default ScoreOverviewRow;
