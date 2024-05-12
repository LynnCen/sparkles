/**
 * @Description 城市分析顶部搜索内容
 */
import V2ProvinceList from '@/common/components/Form/V2FormProvinceList/V2ProvinceList';
import styles from './index.module.less';
import ToolBox from '@/common/components/AMap/components/ToolBox';
import { useEffect, useState } from 'react';
import { COUNTRY_LEVEL } from '@/common/components/AMap/ts-config';

const TopCon = ({
  boxRef,
  _mapIns,
  clearClickEvent,
  addClickEvent,
  share,
  explain,
  children,
  getAddress,
  ruler,
  satellite,
  cityValue,
  onCityChange,
}: any) => {
  const [cityInfo, setCityInfo] = useState<any>({});

  useEffect(() => {
    if (cityValue?.length) {
      setCityInfo({
        provinceId: cityValue[0],
        cityId: cityValue[1]
      });
    }
  }, [cityValue]);

  return (
    <div className={styles.topContainer}>
      <V2ProvinceList
        value={cityValue}
        type='2'
        showSearch={true}
        popupClassName={styles.provincePopup}
        style={{ width: '360px' }}
        onChange={onCityChange}
      />
      <div className={styles.topBoxCon}>
        <ToolBox
          ref={boxRef}
          _mapIns={_mapIns}
          clearClickEvent={clearClickEvent}
          addClickEvent={addClickEvent}
          share={share}
          explain={explain}
          children={children}
          getAddress={getAddress}
          ruler={ruler}
          satellite={satellite}
          extraCityInfo={cityInfo}
          externalStatus={true}
          // isShowInCountry={true} // 全国范围下显示
          topLevel={COUNTRY_LEVEL}
        />
      </div>
    </div>
  );
};

export default TopCon;
