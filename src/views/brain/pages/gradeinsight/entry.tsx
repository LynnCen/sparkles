/**
 * 选址大脑-评分表洞察
 */
import { FC } from 'react';
import CorrelationRanking from './components/CorrelationRanking';
import GraphAnalyze from './components/GraphAnalyze';
import MarkResult from './components/MarkResult';

const Gradeinsight: FC<any> = () => {
  return (
    <div>
      {/* 转化率回归分析 */}
      <GraphAnalyze />
      {/* 相关性系数排名 */}
      <CorrelationRanking />
      {/* 评分项 */}
      <MarkResult />
    </div>
  );
};

export default Gradeinsight;
