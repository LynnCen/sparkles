import React, { FC, useMemo } from 'react';
import styles from '../index.module.less';
import { Progress } from 'antd';
import cs from 'classnames';

// 定义分数范围的枚举
enum ScoreRange {
  Good = 70,
  Middle = 50,
  Low = 0,
}

const colorMap = {
  Good: '#006AFF',
  Middle: '#47D0DB',
  Low: '#EE2F2F',
  Default: '#666',
};

const evaluates = (score:number):any[] => {
  if (score > 80) {
    return ['100%', '100%', '100%', '100%', (score - 80) / 20 * 100];
  }
  if (score > 60 && score <= 80) {
    return ['100%', '100%', '100%', (score - 60) / 20 * 100, 0];
  }
  if (score > 40 && score <= 60) {
    return ['100%', '100%', (score - 40) / 20 * 100, 0, 0];
  }
  if (score > 20 && score <= 40) {
    return ['100%', (score - 20) / 20 * 100, 0, 0, 0];
  }
  return [(score) / 20 * 100, 0, 0, 0, 0];
};


const getScoreColor = (totalScore: number): string => {
  let color = colorMap.Default;

  if (totalScore > ScoreRange.Good) {
    color = colorMap.Good;
  } else if (totalScore > ScoreRange.Middle) {
    color = colorMap.Middle;
  } else if (totalScore > ScoreRange.Low) {
    color = colorMap.Low;
  }

  return color;
};

const getScoreLevel = (totalScore: number, scoreColor: string, resourceMallFlag: boolean): React.ReactNode => {
  const targetStr = resourceMallFlag ? '汽车' : '餐饮';
  if (totalScore > ScoreRange.Good) {
    return (
      <div className={styles.scoreText}>
        <span style={{ color: scoreColor }}>有利于</span>
        {targetStr}经营
      </div>
    );
  } else if (totalScore > ScoreRange.Middle) {
    return (
      <div className={styles.scoreText}>
        {targetStr}经营
        <span style={{ color: scoreColor }}>一般</span>
      </div>
    );
  } else if (totalScore > ScoreRange.Low) {
    return (
      <div className={styles.scoreText}>
        <span style={{ color: scoreColor }}>不利于</span>
        {targetStr}经营
      </div>
    );
  } else {
    return '-';
  }
};

const ScoreLine: FC<{ totalScore?: number; resourceMallFlag?: boolean }> = ({
  totalScore = 32,
  resourceMallFlag = false
}) => {
  const scoreColor = useMemo(() => getScoreColor(totalScore), [totalScore]);
  const scoreLevel = useMemo(() => getScoreLevel(totalScore, scoreColor, resourceMallFlag), [totalScore, scoreColor, resourceMallFlag]);

  return (
    <div className={styles.scoreLine}>
      <div className={styles.titleCon}>
        <div className={styles.title}>
          市场评分
          <span className={styles.score} style={{ color: scoreColor }}>
            {totalScore}
          </span>
        </div>
        {scoreLevel}
      </div>
      <div className={styles.lineCon}>
        {evaluates(totalScore).map((item, index) =>
          <div key={index + item} className={styles.progressCon}>
            <Progress
              percent={item}
              showInfo={false}
              strokeLinecap='butt'
              strokeColor={scoreColor}
              trailColor='#eee'
            />
          </div>
        )}
        <span className={cs(styles.text, styles.lowText)}>不利于(0-50)</span>
        <span className={cs(styles.text, styles.middleText)}>一般(50-70)</span>
        <span className={cs(styles.text, styles.highText)}>有利(70-100)</span>

      </div>
    </div>
  );
};

export default ScoreLine;
