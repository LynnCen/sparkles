import DetailInfo from './DetailInfo';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Row, Space } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';
// import TabTitle from './TabTitle';

const ShopInfoTab:FC<any> = ({ data, isOpen }) => {

  return (
    <div className={styles.tabInfoContent}>
      {/* <TabTitle name='店铺信息' />
      <TitleTips className={styles.secondTitle} name='店铺图片' showTips={false} />
      <Space className={styles.imagesContent}>
        { data.frontImageUrls && data.frontImageUrls.map((item, index) => (
          <img src={item} key={index} />
        )) }
      </Space> */}
      <TitleTips className={styles.secondTitle} name='基础信息' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='店铺类型' value={data.shopCategoryName} />
        <DetailInfo title='商场名称' value={data.mallName} />
        <DetailInfo title='商场是否开业' value={isOpen ? '是' : '否'} />
        <DetailInfo title='店铺地址' value={data.shopAddress} />
      </Row>
      <TitleTips className={styles.secondTitle} name='城市信息' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='城市等级' value={data.cityLevelName} />
        <DetailInfo title='人口规模(万人)' value={data.populationSize} />
        <DetailInfo title='GDP水平(亿元)' value={data.gdpLevel} />
      </Row>
      <TitleTips className={styles.secondTitle} name='店铺结构' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='楼层方案' value={data.floorPlanName} />
        <DetailInfo title='店招宽度(m)' value={data.shopSignWidth} />
        <DetailInfo title='店铺净层高(m)' value={data.shopNetHeight} />
        <DetailInfo title='实用面积(m²)' value={data.usableArea} />
        <DetailInfo title='开口(m)' value={data.openHole} />
        <DetailInfo title='进深(m)' value={data.depth} />
        <DetailInfo title='是否同行聚集楼层' value={data.isPeersGatherName} />
        { !isOpen && <DetailInfo title='是否儿童服饰楼层' value={data.isOnKidClothingFloorName} /> }
      </Row>
      <TitleTips className={styles.secondTitle} name='楼层平面图' showTips={false} />
      <Space className={styles.imagesContent}>
        { data.planImageUrls && data.planImageUrls.map((item, index) => (
          <img src={item} key={index} />
        )) }
      </Space>
      <TitleTips className={styles.secondTitle} name='左右邻居照片' showTips={false} />
      <Space className={styles.imagesContent}>
        { data.neighborsPics && data.neighborsPics.map((item, index) => (
          <img src={item} key={index} />
        )) }
      </Space>
      <div style={{ marginTop: 16, marginBottom: 26 }}><DetailInfo title='店铺信息备注' value={data.shopRemark} /></div>
      <TitleTips className={styles.secondTitle} name='可见性' showTips={false} />
      <Row className={styles.infoContent} gutter={[16, 0]}>
        <DetailInfo title='外立面可视性' value={data.facadeVisibilityName} />
        <DetailInfo title='距离入口/扶梯(m)' value={data.distance2EntranceName} />
        <DetailInfo title='有无广告位/指引牌' value={data.hasAdSpaceName} />
      </Row>
    </div>
  );
};

export default ShopInfoTab;
