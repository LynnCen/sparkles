/**
 * @Description 顶部搜索框部分
 */
import { FC } from 'react';
import IconFont from '@/common/components/IconFont';
// import cs from 'classnames';
import styles from './index.module.less';
import Search from './Search';
import ToolBox from '@/common/components/AMap/components/ToolBox';
import Other from './Other';

const Top: FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  setPoiData
}) => {
  const { level, city } = mapHelpfulInfo;
  return (
    <div className={styles.topCon}>
      {/* 省市区切换及搜索 */}
      <Search
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        setPoiData={setPoiData}
      />
      {/* 工具箱 */}
      <ToolBox
        _mapIns={mapIns}
        level={level}
        city={city}
        heartMap={false}
        beforeIcon={<IconFont iconHref='iconic_toolbox' className='fs-16'/>}
        afterIcon={<IconFont iconHref='pc-common-icon-a-iconarrow_down'/>}
        toolBoxWrapperStyle={{
          height: '36px',
          lineHeight: '36px',
        }}
        satellite={false}
      />
      <Other
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}/>
    </div>
  );
};

export default Top;
