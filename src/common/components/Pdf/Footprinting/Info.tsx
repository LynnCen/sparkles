import { FC, } from 'react';
import styles from './entry.module.less';
import CardItem from './CardItem';
import ListInfo from './ListInfo';
const Info: FC<any> = ({ data: { checkSpotInfo, placeInfo, shopInfo } }) => {
  const renderPeriod = (value) => {
    if (value && value.length) {
      return value.map((item) => item.start + '-' + item.end).join(', ');
    }
    return '-';
  };
  const checkSpotInfoList = [
    { label: '踩点项目名称', content: checkSpotInfo?.name || '-' },
    { label: '踩点日期', content: checkSpotInfo?.checkDate || '-' },
    { label: '踩点方式', content: checkSpotInfo?.checkWayName || '-' },
    { label: '踩点时间段', content: renderPeriod(checkSpotInfo?.checkPeriod) || '-' },
    { label: '上传视频总数', content: checkSpotInfo?.uploadVideoCount || '-' },
    { label: '分析完成视频总数', content: checkSpotInfo?.completeVideoCount || '-' },
    { label: '分析总人数', content: checkSpotInfo?.checkSpotFlows || '-' },
  ];
  const placeInfoList = [
    { label: '场地类型', content: placeInfo?.placeCategoryName || '-' },
    { label: '场地名称', content: placeInfo?.placeName || '-' },
    { label: '所属城市',
      content: (placeInfo?.provinceName && placeInfo?.cityName && placeInfo?.districtName)
        ? `${placeInfo?.provinceName}${placeInfo?.cityName}${placeInfo?.districtName}`
        : '-' },
    { label: '详细信息', content: placeInfo?.placeAddress || '-' },
  ];
  const shopInfoList = [
    { label: '店铺类型', content: shopInfo?.shopCategoryName || '-' },
    { label: '店铺位置', content: shopInfo?.address || '-' },
    { label: '在营品牌', content: shopInfo?.brandName || '-' },
    { label: '所在楼层', content: shopInfo?.floor || '-' },
    { label: '左右品牌', content: shopInfo?.aroundBrand || '-' },
    { label: '店铺面积', content: shopInfo?.area && (shopInfo.area + 'm²') || '-' },
    { label: '店铺租金', content: shopInfo?.rent && (shopInfo.rent + '元/年') || '-' },
  ];
  return (
    <div className={styles.infoCon}>
      {/* 踩点信息 */}
      <div className={styles.footprintInfoCon}>
        <CardItem type={1}>
          <ListInfo list={checkSpotInfoList}/>
        </CardItem>
      </div>

      {/* 场地信息 */}
      <div className={styles.siteInfoCon}>
        <CardItem type={2}>
          <ListInfo list={placeInfoList} pics={placeInfo?.floorPics} label='商圈楼层导览图'/>
        </CardItem>
      </div>
      {/* 店铺信息 */}
      <div className={styles.storeInfo}>
        <CardItem type={3}>
          <ListInfo list={shopInfoList} pics={shopInfo?.pics} label='店铺图片'/>
        </CardItem>
      </div>
    </div>
  );
};

export default Info;
