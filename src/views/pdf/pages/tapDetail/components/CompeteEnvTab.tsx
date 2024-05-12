import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row, Space } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';
import TabTitle from './TabTitle';

const CompeteEnvTab:FC<any> = ({ data, isOpen }) => {

  return (
    <div className={styles.tabInfoContent}>
      <TabTitle name='竞争环境' />
      { isOpen && (
        <>
          <TitleTips className={styles.secondTitle} name='前三名竞品年销售额' showTips={false} />
          <Row className={styles.infoContent} gutter={[16, 0]}>
            <DetailInfo title='Top1竞品年销售额(万元)' value={data.competeProductAnnualSaleFir} />
            <DetailInfo title='Top2竞品年销售额(万元)' value={data.competeProductAnnualSaleSec} />
            <DetailInfo title='Top3竞品年销售额(万元)' value={data.competeProductAnnualSaleThird} />
          </Row>
        </>
      ) }
      <TitleTips className={styles.secondTitle} name='竞品品牌详情' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='竞品名称' value={data.competeProductName} />
        <DetailInfo title='距离本店铺(m)' value={data.competeProductStoreDistance} />
        <DetailInfo title='竞品年销售额(万元)' value={data.competeProductAnnualSale} />
        <DetailInfo title='竞品店铺信息备注' value={data.competeProductRemark} />
      </Row>
      { data.competeProductStorePics ? (
        <>
          <TitleTips className={styles.secondTitle} name='竞品店铺图片' showTips={false} />
          <Space className={styles.imagesContent}>
            { data.competeProductStorePics.map((item, index) => (
              <img src={item} key={index} />
            )) }
          </Space>
        </>
      ) : <DetailInfo title='竞品店铺图片' value='-' /> }
    </div>
  );
};

export default CompeteEnvTab;
