import { FC } from 'react';
import styles from './entry.module.less';
import { Image, Row } from 'antd';
import DetailInfo from '@/common/components/business/DetailInfo';
import { placeholderErrorImg } from '@/common/enums/base64';

// https://cert.linhuiba.com/FuZJ6wkqO59KBCh6Bj0zyOYe-NA7"
const Overview: FC<any> = ({ data }) => {
  const { checkSpotDetail, shopInfo } = data;
  const src =
    checkSpotDetail && checkSpotDetail.pics && checkSpotDetail.pics.length ? checkSpotDetail?.pics[0] : 'error';
  return (
    <div className={styles.overview}>
      <div className={styles.leftImg}>
        <Image key={1} width={446} height={288} src={src} fallback={placeholderErrorImg} />
      </div>
      <div className={styles.rightInfo}>
        <div className={styles.title}>
          <span>{checkSpotDetail?.shopName}</span>
        </div>
        <div className={styles.count}>
          <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.checkDateCount || '-'}</div>
            <div className={styles.labelName}>踩点天数</div>
          </div>
          <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.aveWeekdayFlow || '-'}</div>
            <div className={styles.labelName}>工作日平均客流</div>
          </div>
          <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.aveWeekendFlow || '-'}</div>
            <div className={styles.labelName}>节假日平均客流</div>
          </div>
          {/* <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.aveDurationHour || '-'}</div>
            <div className={styles.labelName}>平均踩点时长（h）</div>
          </div>
          <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.aveFlow || '-'}</div>
            <div className={styles.labelName}>平均客流（人次）</div>
          </div> */}
          {/* <div className={styles.label}>
            <div className={styles.labelCount}>{checkSpotDetail?.aveCpm || '-'}</div>
            <div className={styles.labelName}>平均CPM（元）</div>
          </div> */}
        </div>
        <Row gutter={[16, 0]}>
          <DetailInfo span={12} title='店铺名称' value={checkSpotDetail?.shopName} />
          <DetailInfo span={12} title='店铺类型' value={checkSpotDetail?.shopCategoryName} />
          <DetailInfo span={12} title='店铺位置' value={shopInfo?.placeAddress} />
          {/* <DetailInfo span={12} title='店铺租金' value={shopInfo?.shopRent + shopInfo?.shopRentUnitName} /> */}
          {/* <DetailInfo span={12} title='店铺面积' value={shopInfo?.shopArea ? shopInfo?.shopArea + 'm²' : '-'} /> */}
          {/* <DetailInfo span={12} title='所在楼层' value={shopInfo?.floor} /> */}
          {/* <DetailInfo span={12} title='左右品牌' value={shopInfo?.aroundBrand} /> */}
        </Row>
      </div>
    </div>
  );
};

export default Overview;
