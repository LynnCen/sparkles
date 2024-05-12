import { Anchor, Image } from 'antd';
import { FC } from 'react';
import styles from './entry.module.less';

const { Link } = Anchor;

const Operation: FC<any> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>行业地图操作指引</div>
        <div id='1.1' className={styles.h1}>1、品牌网点具体分布情况查看</div>
        <div className={styles.t1}>操作路径：选址地图-行业地图；</div>
        <div className={styles.t1}>操作说明：勾选品牌选项，可查看选中的品牌在全国各地区的网点数量、分布占比、落位信息、网点详情，同时支持以月为单位查看该品牌的历史数据。</div>
        <Image.PreviewGroup>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/1.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/2.png' /></div>
        </Image.PreviewGroup>
        <div id='1.2' className={styles.h1}>2、商圈信息查看</div>
        <div className={styles.t1}>操作路径：选址地图-行业地图；</div>
        <div className={styles.t1}>操作说明：勾选商圈选项，可查看选中的商圈在全国各地区的数量、分布占比、落位信息、商圈详情；其中不同类型的商圈对应地图中不同的图标形状和围栏颜色。</div>
        <Image.PreviewGroup>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/3.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/4.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/5.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/6.png' /></div>
        </Image.PreviewGroup>
        <div id='1.3' className={styles.h1}>3、全品牌网点分布情况</div>
        <div className={styles.t1}>操作路径：选址地图-行业地图；</div>
        <div className={styles.t1}>操作说明：勾选“全品牌网点分布”，可查看所有汽车品牌在全国各地区的网点分布情况。</div>
        <div className={styles.t1}>其中对关注品牌（奥迪、阿尔法·罗密欧、奔驰、宝马、红旗、捷豹、雷克萨斯、凯迪拉克、路虎、林肯、乔治·巴顿、沃尔沃、英菲尼迪、大众、比亚迪、特斯拉、蔚来、小鹏、理想、广汽埃安、极氪、大众ID，smart、问界)进行了品牌logo展示，其他品牌则为汽车图标。</div>
        <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/7.png' /></div>
        <div id='1.4' className={styles.h1}>4、行业数据地图数据组合使用方法</div>
        <div className={styles.t1}>操作路径：选址地图-行业地图；</div>
        <div className={styles.t1}>操作说明：“重点商圈”可与“品牌网点分布”、“全品牌网点分布”叠加使用；</div>
        <div className={styles.t1}>行政区划分布显示要求：地图必须放大到具体城市方可勾选。</div>
        <Image.PreviewGroup>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/8.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/9.png' /></div>
        </Image.PreviewGroup>
        <div id='1.5' className={styles.h1}>5、地图小工具</div>
        <div className={styles.t1}>操作路径：地图正上方，附加地图小工具：搜索、标记、测距、卫星。</div>
        <Image.PreviewGroup>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/10.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/11.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/12.png' /></div>
          <div className={styles.image}><Image src='https://staticres.linhuiba.com/project-custom/locationpc/guide/13.png' /></div>
        </Image.PreviewGroup>
      </div>
      <div className={styles.anchorContent}>
        <Anchor className={styles.anchor}>
          <Link href='#1.1' title='品牌网点具体分布情况查看' />
          <Link href='#1.2' title='商圈信息查看' />
          <Link href='#1.3' title='全品牌网点分布情况' />
          <Link href='#1.4' title='行业数据地图数据组合使用方法' />
          <Link href='#1.5' title='地图小工具' />
        </Anchor>
      </div>
    </div>
  );
};

export default Operation;
