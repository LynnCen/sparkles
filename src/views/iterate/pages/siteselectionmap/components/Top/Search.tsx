/**
 * @Description 省市区以及高德关键词搜索地址
 */
import { FC } from 'react';
import { message } from 'antd';
import { isArray } from '@lhb/func';
// import cs from 'classnames';
import styles from './index.module.less';
// import ProvinceList from '@/common/components/ProvinceList';
import IconFont from '@/common/components/IconFont';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';
import SearchInMap from '@/common/components/business/SearchInMap';

const Search: FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  setPoiData
}) => {
  const { city, level } = mapHelpfulInfo;
  const finallySelected = (target) => {
    const { extraData } = target || {};

    setPoiData(extraData);
    // const { location } = target || {};
    // const { lng, lat } = location || {};
    // if (!(lng && lat)) return;
    // setPoiData(target);
  };
  // 自定义显示
  const displayRender = (labels: string[]) => {
    const len = labels?.length;
    return labels?.[len - 1];
  };

  const onChange = (val, selectedOptions) => {
    if (isArray(selectedOptions) && selectedOptions.length) {
      const target = selectedOptions[selectedOptions.length - 1]; // 最后一项
      const { name } = target || {};
      message.success(`${name ? `已切换至${name}` : '切换成功'}`);
    }
  };
  return (
    <div className={styles.searchCon}>
      {/* 省市区 */}
      <ProvinceListForMap
        _mapIns={mapIns}
        city={city}
        level={level}
        config={{
          displayRender: displayRender,
          suffixIcon: <IconFont
            iconHref='pc-common-icon-a-iconarrow_down'
            className='c-959'
          />
        }}
        style={{
          width: '87px'
        }}
        onChange={onChange}
      />
      {/* 搜索 */}
      <SearchInMap
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        finallySelected={finallySelected}
        autoCompleteConfig={{
          style: {
            marginRight: 0
          }
        }}
        searchConfig={{
          style: {
            width: '152px',
          }
        }}
      />
    </div>
  );
};

export default Search;
