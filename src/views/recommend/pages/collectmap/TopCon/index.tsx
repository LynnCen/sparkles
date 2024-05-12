/**
 * @Description 顶部：省市区级联、条件筛选、地址搜索
 */
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';
import SearchInMap from '@/common/components/business/SearchInMap';
import Options from './Options';

const TopCon:FC<any> = ({
  mapIns,
  mapHelpfulInfo,
  setOptions,
}) => {
  const [competitorOpen, setCompetitorOpen] = useState<boolean>(false);
  const [isOpenCascaderMap, setIsOpenCascaderMap] = useState<boolean>(false);

  useEffect(() => {
    if (isOpenCascaderMap) {
      setCompetitorOpen(false);
    }
  }, [isOpenCascaderMap]);

  return <div className={styles.topCon}>
    {/* 省市区级联 */}
    <ProvinceListForMap
      _mapIns={mapIns}
      type={2}
      city={mapHelpfulInfo?.city}
      level={mapHelpfulInfo?.level}
      className={styles.provinceCon}
      config={{
        suffixIcon: <IconFont
          iconHref='pc-common-icon-a-iconarrow_down'
          className='c-959'
        />,
      }}
      setIsOpenCascaderMap={setIsOpenCascaderMap}
      style={{
        width: '150px'
      }}
    />
    <div
      className={styles.competitor}
      onClick={() => setCompetitorOpen((state) => !state)}>
      <span>筛选条件</span>
      <IconFont
        iconHref='pc-common-icon-a-iconarrow_down'
        className={competitorOpen ? styles.arrowIconUp : styles.arrowIcon}
      />
    </div>
    {/* 筛选项内容 */}
    {
      competitorOpen
        ? <div className={styles.competitorContent}>
          <Options setOptions={setOptions}/>
        </div>
        : <></>
    }
    {/* 搜索框 */}
    <div className={styles.search}>
      <SearchInMap
        mapIns={mapIns}
        mapHelpfulInfo={mapHelpfulInfo}
        hideBorder
        autoCompleteConfig={{
          style: {
            marginRight: 12
          }
        }}
        searchConfig={{
          style: {
            width: 200,
            height: 37
          },
        }}/>
    </div>

  </div>;
};
export default TopCon;
