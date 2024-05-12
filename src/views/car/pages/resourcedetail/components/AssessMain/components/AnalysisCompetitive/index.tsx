/** 竞争力分析tab */
//
import styles from './index.module.less';
import { Row, Col, Tooltip } from 'antd';
import V2Title from '@/common/components/Feedback/V2Title';
import ComprehensiveCapabilityCharts from './components/ComprehensiveCapabilityCharts';
import { FC } from 'react';
import IndustryTypeCharts from './components/IndustryTypeCharts';
import IconFont from '@/common/components/Base/IconFont';

const tips = <div>
  <p>数据保密性声明：本页面数据分析的数据源来自公开渠道，你在本网站录入的任何数据都被加密存储，不会参与本页面的计算和呈现。</p>
  <p>免责声明：本页面的数据源来自公开渠道，以上数据分析结果仅作为你的经营参考，本网站不对用户使用本网站所引起的任何损失负责，用户应自行承担因使用本网站而带来的风险。</p>
</div>;


const AnalysisCompetitive:FC<any> = ({
  data = {}
}) => {

  return (
    <div className={styles['analysis-competitive']}>
      <div id={'AnalysisCompetitive'}>
        <div className={styles.title}>
          <V2Title type='H2' text='竞争力分析' divider/>
          <Tooltip title={tips} color={'#333333'} placement='top' >
            <span><IconFont iconHref={'iconxq_ic_shuoming_normal'} className={(styles['more-description-icon'])} /></span>
          </Tooltip>
        </div>
        <Row gutter={28}>
          <Col span={12}>
            <div className={styles.box}>
              <ComprehensiveCapabilityCharts
                className={styles.charts}
                data={data?.comprehensiveCapability}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.box}>
              <IndustryTypeCharts
                className={styles.charts}
                data={data?.industryType}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AnalysisCompetitive;
