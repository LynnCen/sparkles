/**
 * @Description 右侧商圈列表
 */

import { FC, useEffect, useMemo, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import List from './List';
import { CITY_LEVEL, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';
import { isArray } from '@lhb/func';

const ListSidebar: FC<any> = ({
  mapHelpfulInfo,
  locationInfo,
  poiData,
  data,
  areaChangedLabels,
  totalInfo,
  loading,
  pageRef,
  searchParams,
  setSearchParams,
  setDetailData,
  appendData
}) => {
  const { level } = mapHelpfulInfo;
  const [openList, setOpenList] = useState<any>(false); // 是否展开商圈列表，商圈列表下钻到城市级别才显示

  useEffect(() => {
    // 商圈列表下钻到城市级别才显示
    const isOpen = level >= CITY_LEVEL;
    setOpenList(isOpen);
  }, [level]);

  const isShow = useMemo(() => {
    // 商圈列表下钻到城市级别才显示
    return level >= CITY_LEVEL;
  }, [level]);

  const addressName = useMemo(() => {
    if (poiData) return '可视区域';

    const { cityIds, districtIds } = searchParams;
    const { city, district, level } = mapHelpfulInfo;
    if (level === DISTRICT_LEVEL && isArray(districtIds) && districtIds.length) { // 行政区级别
      return district?.name || '';
    } else if (level === CITY_LEVEL && isArray(cityIds) && cityIds.length) { // 城市级别
      return city?.name || '';
    } else { // 请求参数中未传城市或行政区的情况下
      return '可视区域';
    }
  }, [poiData, mapHelpfulInfo, searchParams]);

  return (
    isShow ? <div className={styles.sidebarCon}>
      <div
        className={styles.controlRow}
        onClick={() => setOpenList(!openList)}
      >
        <span className='fs-14 c-222'>
          {addressName}为您推荐
          <span className={cs('c-006 bold', styles.spanSpace)}>{totalInfo.totalNum || 0}</span>
          个商圈
        </span>
        <IconFont
          iconHref='pc-common-icon-a-iconarrow_down'
          className={openList ? styles.arrowIconUp : styles.arrowIcon}
        />
      </div>
      <List
        open={openList}
        pageRef={pageRef}
        list={data}
        locationInfo={locationInfo}
        poiData={poiData}
        loading={loading}
        areaChangedLabels={areaChangedLabels}
        searchParams={searchParams}
        setDetailData={setDetailData}
        setSearchParams={setSearchParams}
        appendData={appendData}
      />
    </div> : <></>
  );
};

export default ListSidebar;
