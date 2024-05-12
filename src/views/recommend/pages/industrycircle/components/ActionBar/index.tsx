/**
 * @Description 操作栏
 */

import { FC } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';
import DropdownRow from './DropdownRow';
import SearchAndTool from './SearchAndTool';

const ActionBar: FC<any> = ({
  mapIns, // 地图实例
  mapHelpfulInfo, // 地图城市、缩放级别等信息
  selection, // 筛选项
  dropdownRowActive, // 下拉行选中项
  showRailPath, // 是否只展示商圈围栏
  searchParams, // 接口入参
  setSearchParams, // 设置接口入参
  setShowRailPath, // 设置只展示商圈围栏
  setDropdownRowActive, // 设置下拉行选中项
  setIsOpenHeatMap, // 监听工具箱中的人口热力是否打开
  setIsSelectToolBox, // 工具箱中是否使用中
}) => {

  return (
    <div className={styles.actionBarCon}>
      {/* 可操作行 */}
      <DropdownRow
        mapHelpfulInfo={mapHelpfulInfo}
        mapIns={mapIns}
        selection={selection}
        showRailPath={showRailPath}
        dropdownRowActive={dropdownRowActive}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setShowRailPath={setShowRailPath}
        setDropdownRowActive={setDropdownRowActive}/>
      {/* 搜索框和工具箱 */}
      <SearchAndTool
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        setIsOpenHeatMap={setIsOpenHeatMap}
        setIsCheckInsideMapOperate={setIsSelectToolBox}/>
    </div>
  );
};

export default ActionBar;
