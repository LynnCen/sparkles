/**
 * @Description 右侧列表和右侧头部信息栏
 */
import { FC } from 'react';
import styles from './index.module.less';
import List from './List';

const RightCon: FC<any> = ({
  pointData,
  setEnterDrawerOpen,
  enterDrawerOpen,
  topInfo,
  city,
  setDetailDrawer,
  onRefresh,
  setItemData,
  mapIns,
  itemData
}) => {
  const beautifyNumber = (number) => {
    if (number >= 10000) {
      return (number / 10000).toFixed(1) + 'w';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    } else {
      return number.toString();
    }
  };
  const infoBar = [
    { label: '规划商圈', data: beautifyNumber(topInfo?.planClusterCount || 0) },
    { label: '规划集客点', data: beautifyNumber(topInfo?.planRecommendStoresCount || 0) },
    { label: '已通过集客点', data: beautifyNumber(topInfo?.planSpotPassCount || 0) },
    { label: '已开集客点', data: beautifyNumber(topInfo?.planOpenStores || 0) },
  ];
  return <div className={styles.rightCon}>
    <div className={styles.rightTop}>
      {
        infoBar.map((item, index) => <div className={styles.card} key={index}>
          <span className='c-999'>{item.label}：</span>
          <span className={styles.data}>{item.data}</span>
        </div>)
      }
    </div>

    <List
      pointData={pointData}
      setEnterDrawerOpen={setEnterDrawerOpen}
      enterDrawerOpen={enterDrawerOpen}
      city={city}
      setDetailDrawer={setDetailDrawer}
      onRefresh={onRefresh}
      setItemData={setItemData}
      itemData={itemData}
      mapIns={mapIns}
    />
  </div>;
};
export default RightCon;
