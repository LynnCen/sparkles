/**
 * @Description 搜索和工具箱
 * 需要引入高德的 AMap.PlaceSearch插件
 */
import { FC } from 'react';
import { CITY_LEVEL } from '@/common/components/AMap/ts-config';
import styles from './index.module.less';
import SearchInMap from '@/common/components/business/SearchInMap';
import ToolBox from '@/common/components/AMap/components/ToolBox';

const SearchAndTool: FC<any> = ({
  mapIns, // 地图实例
  level, // 缩放级别
  city, // 地图城市
  setIsOpenHeatMap,
  ...props
}) => {
  return (
    <div className={styles.searchToolCon}>
      {/* poi搜索 */}
      <SearchInMap
        mapIns={mapIns}
        mapHelpfulInfo={{ level, city }}
        hideBorder
      />
      {/* 工具箱 */}
      <ToolBox
        _mapIns={mapIns}
        level={level}
        city={city}
        needHeatMapPermission
        setIsOpenHeatMap={setIsOpenHeatMap}
        topLevel={CITY_LEVEL}
        {...props}
      />
    </div>
  );
};

export default SearchAndTool;
