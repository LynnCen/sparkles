/**
 * @Description 评分维度
 */

import { FC } from 'react';
import { Progress, Typography } from 'antd';
// import cs from 'classnames';
import styles from './index.module.less';

const { Paragraph } = Typography;
const ScoreDimension: FC<any> = ({
  scores
}) => {

  return (
    <>
      {
        scores?.map((scoreItem, index) => <div className='mt-10' key={index}>
          <div className={styles.flexSection}>
            <div
              className='c-222 bold fs-12'
              style={{
                minWidth: '54px'
              }}
            >{scoreItem?.name}</div>
            <Progress
              percent={scoreItem?.score || 0}
              format={(percent) => percent}
              strokeColor='#006aff'
              trailColor='#eee'
            />
          </div>
          <Paragraph
            ellipsis={{
              rows: 2,
              tooltip: scoreItem?.msg
            }}
            style={{
              marginBottom: 0,
              minHeight: '40px'
            }}
          >
            <span className='c-999 fs-12 ft-space'>
              {scoreItem?.msg}
            </span>
          </Paragraph>
          {/* <div className={cs(styles.text, 'c-999 fs-12 ft-space')}>
            {scoreItem?.msg}
          </div> */}
        </div>)
      }
    </>
  );
};

export default ScoreDimension;
