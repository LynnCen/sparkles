/**
 * @Description 周边详情
 *  展示入口
 *   -周边搜索页-查询某个搜索结果后，页面下方展示详情
 */

import { FC, useEffect, useState, useMemo } from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import Main from './components/Main';
import Category from './components/Category';
import SurroundPopulation from './components/SurroundPopulation';
import City from './components/City';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import cs from 'classnames';
import { modelCategoryList } from '@/common/api/surround';
import LBSBottom from './components/LBSBottom';
import { useSelector } from 'react-redux';

const TabKeySurround = 'surround'; // 周边人群tab的key
const TabKeyCity = 'city'; // 城市tab的key

export interface SurroundDetailProps {
  lat: number;
  lng: number;
  radius: number;
  cityId?: number,
  cityName?: string;
  address?: string;
  className?: string;
  businessReport?:any;
  fromSurroundSearch?:boolean;
  isSurround?:boolean;// 是否从周边查询进入
  detail?:any;
  isShowAddress?:boolean
  hanldeIsShowLBS? // 手动控制是否显示
  poiSearchType?:any
}

interface SuroundTabProps {
  label?: string;
  value?: string;
  categoryId?: number;
}

const SurroundDetail: FC<SurroundDetailProps> = ({
  lat,
  lng,
  radius,
  cityId,
  cityName,
  address,
  className,
  businessReport,
  isShowAddress = false,
  fromSurroundSearch = true,
  isSurround = false,
  detail,
  hanldeIsShowLBS = true,
  poiSearchType,
}) => {
  const [tabActive, setTabActive] = useState<string>('');
  const [tabs, setTabs] = useState<SuroundTabProps[]>([]);

  const isShowLBS = useSelector((state: any) => state.common.tenantCheck.lbsFlag); // 是否显示LBS引导付费入口

  useEffect(() => {
    // 重置数据
    setTabActive('');
    setTabs([]);
    getTabList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, radius]);

  const currentTabVal = useMemo(() => {
    return (tabActive && Array.isArray(tabs) && tabs.length) ? tabs.find((itm: SuroundTabProps) => itm.value === tabActive) : {};
  }, [tabActive, tabs]);
  const {
    getTabList,
    onChangeTab,
  } = useMethods({
    async getTabList() {
      const res = await modelCategoryList();
      const list: SuroundTabProps[] = res.map((item: any) => ({
        label: item.name,
        value: item.code,
        categoryId: item.id,
      }));
      // 周边人群,城市信息写死必有
      list.push({ label: '周边人群', value: TabKeySurround, categoryId: undefined });
      list.push({ label: '城市信息', value: TabKeyCity, categoryId: undefined });
      // tabs列表数据
      setTabs(list);
      // 默认选中第一个
      setTabActive(list[0].value || '');
    },

    onChangeTab({ target: { value } }: RadioChangeEvent) {
      tabs.forEach((item) =>
        item.value === value && setTabActive(value)
      );
    }
  });

  return (
    <div className={cs(styles.surroundDetail, className)}>
      <div className={'mt-32'}>
        <Radio.Group
          options={tabs as any}
          onChange={onChangeTab}
          value={tabActive}
          optionType='button'
          buttonStyle='solid'
        />
      </div>

      <Main>
        { (tabActive !== TabKeySurround && tabActive !== TabKeyCity) && <Category
          tabKey={tabActive}
          categoryId={currentTabVal?.categoryId}
          lat={lat}
          lng={lng}
          radius={radius}
          detail={detail}
          address={address}
          isShowAddress={isShowAddress}
          borders={detail?.borders}
          poiSearchType={poiSearchType}
        />}
        {/* 周边人群 */}
        { tabActive === TabKeySurround && (<SurroundPopulation
          fromSurroundSearch={fromSurroundSearch}
          lat={lat}
          lng={lng}
          cityId={cityId}
          address={address}
          isActiveTab={tabActive === TabKeySurround}
        />)}
        {/* 城市信息 */}
        { tabActive === TabKeyCity && <City
          detail={{
            lng,
            lat,
            cityName,
            radius,
            address
          }}
          cityId={cityId}
          cityName={cityName}
          isActiveTab={tabActive === TabKeyCity}
        />}

        {/* 根据配置决定是否显示LBS入口 */}
        { hanldeIsShowLBS && isShowLBS && !(businessReport?.id && [3, 4].includes(businessReport?.process)) && isSurround && <LBSBottom
          type={tabActive}
          detail={detail}
        />}

      </Main>
    </div>
  );
};

export default SurroundDetail;
