/**
 * @Description 商圈信息、竞品分布、本品牌分布、筛选条件
 */
import { FC, useEffect, useMemo, useState } from 'react';
import { dropdownRows } from '../../../ts-config';
import {
  CITY_LEVEL,
  COUNTRY_LEVEL,
  DISTRICT_LEVEL
} from '@/common/components/AMap/ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import CompetitorCom from '@/common/components/business/RecommendSidebar';
import BusinessCircleInfo from './BusinessInfo';
import Brand from './Brand';
import SearchModal from './SearchModal';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const DropdownRow: FC<any> = ({
  mapIns, // 地图实例
  mapHelpfulInfo,
  selection, // 筛选项
  dropdownRowActive, // 下拉行选中项
  showRailPath, // 是否只显示商圈围栏
  searchParams, // 接口入参
  setSearchParams, // 设置接口入参
  setDropdownRowActive, // 设置下拉行选中项
  setShowRailPath
}) => {
  const { city, level } = mapHelpfulInfo;
  const [open, setOpen] = useState<boolean>(false);
  const defaultActive = dropdownRows[0].id; // 默认展示商圈信息

  useEffect(() => {
    if (dropdownRowActive === dropdownRows[3].id) {
      setOpen(true);
    }
  }, [dropdownRowActive]);

  useEffect(() => {
    if (level === COUNTRY_LEVEL && dropdownRowActive === dropdownRows[1].id) { // 竞品分布在全国范围时不展示
      setDropdownRowActive(defaultActive);
    } else if (level !== DISTRICT_LEVEL && dropdownRowActive === dropdownRows[2].id) { // 本品牌分布和筛选条件在区级才可点击
      setDropdownRowActive(defaultActive);
    } else if (level < CITY_LEVEL && dropdownRowActive === dropdownRows[3].id) {
      setDropdownRowActive(defaultActive);
    }
  }, [level]);

  const clickItem = (id: number) => {
    if (id === dropdownRows[1].id && level === COUNTRY_LEVEL) { // 竞品分布在全国范围时不点击
      V2Message.warning('地图放大至省级以下显示竞品数据');
      return;
    }

    if (id === dropdownRows[2].id && level !== DISTRICT_LEVEL) { // 本品牌分布只在区可点击
      V2Message.warning('地图放大至区级以下显示门店数据');
      return;
    }

    if (id === dropdownRows[3].id && level < CITY_LEVEL) { // 筛选条件只在市、区可点击
      V2Message.warning('地图放大至市级以下进行筛选');
      return;
    }
    if (id === dropdownRowActive) { // 收起
      setDropdownRowActive('');
      return;
    }
    setDropdownRowActive(id);
  };

  // 关闭筛选条件
  const closeModalHandle = () => {
    setOpen(false);
    setDropdownRowActive(defaultActive); // 显示商圈信息
  };
  const model = useMemo(() => {
    return { provinceCode: city?.provinceId, cityId: city?.id };
  }, [city?.provinceId, city?.id]);
  return (
    <div className={styles.dropdownRowCon}>
      {
        dropdownRows.map((item: any, index: number) => (
          <div
            key={index}
            className={cs(styles.rowItem, dropdownRowActive === item.id ? 'c-006' : '')}
            onClick={() => clickItem(item.id)}>
            <span className='pr-8'>{item.name}</span>
            <IconFont
              iconHref={'iconarrow-down'}
              className={cs(
                'fn-12',
                dropdownRowActive === item.id ? styles.unfold : ''
              )}/>
            {index !== dropdownRows.length - 1 ? <span className={styles.line}></span> : <></>}
          </div>))
      }
      <div className={styles.dropdownRowContent}>
        {/* 通过display: none | block去显示隐藏内容 */}
        {/* 商圈信息 */}
        <div className={dropdownRowActive === dropdownRows[0].id && selection?.firstLevelCategory ? 'show' : 'hide'}>
          <BusinessCircleInfo
            level={level}
            selection={selection}
            searchParams={searchParams}
            showRailPath={showRailPath}
            setSearchParams={setSearchParams}
            setShowRailPath={setShowRailPath}
          />
        </div>
        {/* 竞品分布 */}
        <div className={dropdownRowActive === dropdownRows[1].id ? 'show' : 'hide'}>
          <CompetitorCom
            amapIns={mapIns}
            model={model}
            scopeCheck={false}
            style={{
              boxShadow: '0px 0px 12px 0px rgba(110,139,179,0.25)',
              borderRadius: '4px'
            }}
          />
        </div>
        {/* 本品牌分布 */}
        <div className={dropdownRowActive === dropdownRows[2].id ? 'show' : 'hide'}>
          <Brand
            mapIns={mapIns}
            isShow={dropdownRowActive === dropdownRows[2].id}
            mapHelpfulInfo={mapHelpfulInfo}
          />
        </div>
        {/* 全部筛选 */}
        <SearchModal
          open={open}
          mapIns={mapIns}
          selection={selection}
          mapHelpfulInfo={mapHelpfulInfo}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          close={closeModalHandle}/>
      </div>
    </div>
  );
};

export default DropdownRow;
