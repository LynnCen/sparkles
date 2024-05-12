import { Col, Row } from 'antd';
import cs from 'classnames';
import styles from './index.module.less';
import React from 'react';
import IconFont from '@/common/components/IconFont';
interface ThanksProps{
  homeData?:any
  targetChildClass?: string;
}

const Thanks:React.FC<ThanksProps> = ({
  homeData,
  targetChildClass
}) => {
  const { tenantLogo } = homeData || {};

  return <div className={cs(styles.thanksWrapper, targetChildClass)}>
    <div className={styles.imgWrapper}>
      <div className={styles.logo}>
        {tenantLogo && <>
          <img src={tenantLogo}/>
          <span className={styles.flag}>x</span>
        </>}
        <IconFont iconHref={'iconic_logo_pc'} className={styles.logoIcon} />
      </div>
      <div className={styles.content}>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <div className={styles.title}>1、历史经营门店数据</div>
            <div className={styles.description}>沉淀位置厂商历年门店数据及location大数据整合测算得出，数据从2018年3月开始记录，每年3月进行更新。</div>
          </Col>
          <Col span={24}>
            <div className={styles.title}>2、居住人口&画像数据</div>
            <div className={styles.description}>基于官方统计、位置厂商数据及location大模型。根据城市人口、居住密度、商场客流画像、范围内住宅小区、生活配套数量等数据进行人口算法模型测算。</div>
          </Col>
          <Col span={24}>
            <div className={styles.title}>3、周边配套数据</div>
            <div className={styles.description}>基于位置厂商数据及location大数据整合。</div>
          </Col>
          <Col span={24}>
            <div className={styles.title}>4、声明</div>
            <div className={styles.description}>1）本分析报告，是依据location大数据的数据分析所得，且只分析和测算影响被选址对象的主要因素，未考虑具体点评的室内因素(房屋装修、维护及使用状况等)、物业和未知的不确定因素对分析结果的影响，客户应理解并认可分析价值存在合理误差，对由误差引起的损失或任何潜在损失，Location不承担任何法律责任。
              <br />
              <br />
            2）本分析报告不代表选址对象的真实价值，仅代表一定时期内的价值分析。
              <br />
              <br />
            3）Location在法律许可范围内保留对分析数据和软件算法的最终解释权。</div>
          </Col>
        </Row>
      </div>
      <div className={styles.footer}>
        <div className={styles.textWrapper}>
          <span className={styles.leftLine}></span>
          <span className={styles.thanksText}>感谢观看</span>
          <span className={styles.rightline}></span>
        </div>
      </div>
    </div>

  </div>;

};

export default Thanks;
