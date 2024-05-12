import { Anchor } from 'antd';
import { FC } from 'react';
import styles from './entry.module.less';

const { Link } = Anchor;

const Definition: FC<any> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>相关定义</div>
        <div id='1.1' className={styles.h1}>1.1 品牌网点分布</div>
        <div className={styles.t1}>展示“宝马、奔驰、大众ID、问界、smart、广汽埃安”6个品牌在全国的具体网点分布情况。</div>
        <div id='1.2' className={styles.h1}>1.2 各类型商圈定义</div>
        <div id='1.2.A' className={styles.h2}>A.商场汽车商圈：<span className={styles.t2}>800米半径范围内有2家或以上商场内的汽车品牌门店；</span></div>
        <div id='1.2.B' className={styles.h2}>B.汽车城商圈：<span className={styles.t2}>800米半径范围内有8家或以上非商场商圈内的汽车品牌门店；</span></div>
        <div id='1.2.C' className={styles.h2}>C.产业园：<span className={styles.t2}>城市内的高新技术产业园区、规模较为大的智慧园区；</span></div>
        <div id='1.2.D' className={styles.h2}>D.全部商场：<span className={styles.t2}>城市内所有的购物中心。</span></div>
        <div className={styles.h2}>注：</div>
        <div id='1.2.sort' className={styles.h2}>关于汽车商圈排名逻辑：</div>
        <div className={styles.t1}>对行政区GDP、商圈内的各类汽车品牌网点数量、客流量、交通状况、周边小区、商场入驻的主流汽车品牌情况等信息进行综合建模得分后进行排序；重点参考指标为商圈内各汽车品牌数量，尤其是重点新能源汽车品牌的入驻情况。</div>
        <div id='1.2.list' className={styles.h2}>30个关注城市清单：</div>
        <div className={styles.h2}>一线城市：<span className={styles.t2}>上海市、北京市、杭州市、广州市、深圳市、成都市；</span></div>
        <div className={styles.h2}>二线城市：<span className={styles.t2}>重庆市、苏州市、昆明市、天津市、温州市、宁波市、无锡市、海口市、青岛市、金华市、南宁市、济南市、石家庄市、太原市、南京市、佛山市、东莞市、西安市、合肥市、郑州市、长沙市、武汉市、厦门市；</span></div>
        <div className={styles.h2}>三线城市：<span className={styles.t2}>台州市。</span></div>
        <div id='1.3' className={styles.h1}>1.3 全品牌网点分布</div>
        <div className={styles.t1}>30个关注城市内，所有市面上主流汽车品牌的全部网点的分布信息。</div>
        <div id='1.4' className={styles.h1}>1.4 行政区划分布</div>
        <div className={styles.t1}>可于地图上查看各个城市的行政区划分界线。</div>
      </div>
      <div className={styles.anchorContent}>
        <Anchor className={styles.anchor}>
          <Link href='#1.1' title='品牌网点分布' />
          <Link href='#1.2' title='各类型商圈定义'>
            <Link href='#1.2.A' title='商场汽车商圈' />
            <Link href='#1.2.B' title='汽车城商圈' />
            <Link href='#1.2.C' title='产业园' />
            <Link href='#1.2.D' title='全部商场' />
            <Link href='#1.2.sort' title='关于汽车商圈排名逻辑' />
            <Link href='#1.2.list' title='30个关注城市清单' />
          </Link>
          <Link href='#1.3' title='全品牌网点分布' />
          <Link href='#1.4' title='行政区划分布' />
        </Anchor>
      </div>
    </div>
  );
};

export default Definition;
