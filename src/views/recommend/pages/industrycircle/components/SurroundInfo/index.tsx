/**
 * @Description 行业商圈（通用版）周边信息组件
 */

import { modelCategoryList, surroundPopulation } from '@/common/api/surround';
import { useMethods } from '@lhb/hook';
import { FC, useEffect, useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
import { SuroundTabProps } from './ts-config';
import styles from './index.module.less';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import CityInfo from './components/CityCom';
import PopulationCom from './components/PopulationCom';
import CategoryCom from './components/CategoryCom';
import { Spin } from 'antd';
import V2Empty from '@/common/components/Data/V2Empty';
import { getLngLatAddress } from '@/common/utils/map';
import LbsReport from './components/LbsReport';
import { useSelector } from 'react-redux';
import { fixNumberSE } from '@/common/utils/ways';
import { isDef, isNotEmptyAny } from '@lhb/func';
import V2Tabs from '@/common/components/Data/V2Tabs';

interface Props {
  mainHeight?:number // 高度
  detail?:any // 商圈详情
  amapIns?
}

const SurroundInfo: FC<Props> = ({
  mainHeight,
  detail,
  amapIns,
}) => {

  const [tabActive, setTabActive] = useState<string>('');
  const [tabs, setTabs] = useState<SuroundTabProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const TabKeySurround = 'surround';
  const TabKeyCity = 'city';
  const isShowLBS = useSelector((state: any) => state.common.tenantCheck.lbsFlag); // 是否显示LBS引导付费入口

  const getAddress = async() => {
    const addressInfo: any = await getLngLatAddress([detail.lng, detail.lat], detail.cityName, false).catch((err) => console.log(`查询具体地址信息：${err}`));
    if (!addressInfo) return;
    const { formattedAddress } = addressInfo;
    return formattedAddress;
  };

  /** 接口请求需要的参数 */
  const paramsExtra = useMemo(() => {
    if (!detail) return;
    const { cityId, cityName, districtId, lng, lat, radius, borders, polygon } = detail;
    return { cityId, cityName, districtId, lng, lat, radius, borders, polygon };
  }, [detail]);

  // 半径格式化
  const radiusRex = (radius) => isDef(radius) ? (+radius < 1000 ? `${+radius}m` : `${fixNumberSE(radius / 1000.0)}km`) : '-';

  const methods = useMethods({

    // 获取周边人群数据
    async getPopulationData (_params) {
      const { lng, lat, address, cityId } = _params;
      const tmpList = await surroundPopulation({
        lng,
        lat,
        address,
        cityId,
      });
      const data = Array.isArray(tmpList) && tmpList.length ? tmpList.map((item) => ({
        raduis: radiusRex(item.radius),
        raduisInfo: [{
          name: '常住人口',
          value: item.populationSize,
          unit: '万人'
        }, {
          name: '全市占比',
          value: item.populationProportion,
          unit: '%'
        }]

      })) : [];
      return data;
    },

    /** 获取动态配置表单信息（一级tab）*/
    async getTabList() {
      const address = await getAddress();
      const _params = { ...paramsExtra, address };
      try {
        setLoading(true);
        const res = await modelCategoryList();
        const populationData = await methods.getPopulationData(_params);

        // 默认城市信息和周边人群默认存在
        const defaultTabs = isNotEmptyAny(populationData) ? [
          { label: '城市信息', key: TabKeyCity, children: <CityInfo cityId={detail.cityId} districtId={detail.districtId} params={_params} /> },
          { label: '周边人群', key: TabKeySurround, children: <PopulationCom list={populationData} /> },
        ] : [{ label: '城市信息', key: TabKeyCity, children: <CityInfo cityId={detail.cityId} districtId={detail.districtId} params={_params} /> }];
        // 接口参数拼接
        const tabs = [...res.map((item: any) => ({
          label: item.name,
          key: item.code,
          children: <CategoryCom mainHeight={mainHeight} categoryId={item.id} params={_params} _mapIns={amapIns} />,
        })), ...defaultTabs];

        // 更新 tabs 列表数据和默认选中项
        setTabs(tabs);
        setTabActive(tabs[0]?.key || ''); // TODO: 和产品确认模版和固定字段的顺序
      } catch (error) {
        V2Message.error('获取周边信息模版出错');
      } finally {
        setLoading(false);
      }
    },

    /**
     * @description 切换tab
     * @param target 当前tab项
     * @return
     */
    onChangeTab(target) {
      setTabActive(target);
    },

  });

  useEffect(() => {
    if (!detail) {
      return;
    }
    setTabActive('');
    setTabs([]);
    methods.getTabList();
  }, [detail]);

  return (
    <div
      className={styles.surroundContain}
      style={{
        minHeight: `calc(${mainHeight}px - 285px)`
      }}
    >
      <Spin spinning={loading} >
        { tabs.length
          ? <div className={styles.cardContainer} >
            <V2Tabs
              activeKey={tabActive}
              type='card'
              items={tabs}
              destroyInactiveTabPane
              onChange={methods.onChangeTab}
            />
          </div>
          : <div style={{ height: '315px' }}>
            <V2Empty
              centerInBlock
              type={loading ? 'search' : 'nothing'}
              customTip={loading ? '加载中' : '暂无内容'}/>
          </div>
        }
        {
          isShowLBS && <LbsReport
            detail={paramsExtra}
          />
        }
      </Spin>

    </div>
  );
};

export default SurroundInfo;
