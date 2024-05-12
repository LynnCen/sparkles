import DetailInfo from './DetailInfo';
import { Card, Row } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';

const ShopBasicInfoCard:FC<any> = ({ data, labels, responsibleName, guaranteedSale, isOpen }: any) => {

  return (
    <Card className={styles.basicInfoCard}>
      <div className={styles.cardTitle}>{ data.shopName }</div>
      <div className={styles.tagContent}>
        { labels && labels.map((item, index) => (
          <div key={index} className={styles.tagValue}>{ item }</div>
        )) }
      </div>
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='责任人' value={ responsibleName } />
        <DetailInfo span={18} title='店铺地址' value={data.shopAddress} />
        { isOpen && <DetailInfo title='工作日过店客流(人次)' value={data.flowWeekday} /> }
        { isOpen && <DetailInfo title='节假日过店客流(人次)' value={data.flowWeekend} /> }
        <DetailInfo title='保本销售额(元/天)' value={guaranteedSale} />
      </Row>
    </Card>
  );
};

export default ShopBasicInfoCard;
