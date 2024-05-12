// TODO 待优化
/**
 * 该页面基本从资源服务项目https://resource-service.lanhanba.net/placeMng/detail?tenantPlaceId=1000292拷贝过来
 * 有些组件可能存在不符合当前项目的规范，开发时间有限，来不及一一核对，有空可以仔细看下
 * 继续TODO下去吧，任谁看了都直摇头 o(╥﹏╥)o，，，
 * 以后再让拷其他组的代码，先看复杂度，逻辑复杂的代码质量也不行，也没注释的直接拒绝掉这个需求
 * 特殊场景：
 * 该页面作为组件被src/common/components/business/IndustryMap/ShopDetailDraw.tsx引用
 */
import { urlParams } from '@lhb/func';
import {
  Spin,
  TabsProps,
} from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { PlaceInfo, TABS } from './ts-config';
import { Sticky, StickyContainer } from 'react-sticky';
import { getAppraisalReport, getPlaceDetail, getPlaceDetailResourceStore } from '@/common/api/car';
import AssessInfo from './components/AssessInfo';
import Top from './components/Top';
import styles from './entry.module.less';
import V2Tabs from '@/common/components/Data/V2Tabs';
import AssessMain from './components/AssessMain';


// tabs的粘性局部
export const renderTabBar: TabsProps['renderTabBar'] = (
  props,
  DefaultTabBar
) => (
  <Sticky topOffset={440}>
    {({ style }) => (
      <DefaultTabBar
        {...props}
        style={{
          zIndex: 1000,
          background: '#fff',
          fontSize: 16,
          ...style,
        }}
      />
    )}
  </Sticky>
);

const PlaceDetail: FC<any> = ({
  id
}) => {
  // const { tenantPlaceId } = urlParams(location.search) as any as {
  //   tenantPlaceId: number;
  // };
  const tenantPlaceId = id || urlParams(location.search)?.tenantPlaceId;
  const [detail, setDetail] = useState<PlaceInfo>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);// 动态模版数据
  const [activeKey, setActiveKey] = useState<any>('Place');// 图片相关
  const [tabActiveKey, setTabActiveKey] = useState<any>('Place');// tabs
  const [appraisalReport, setAppraisalReport] = useState<any>(null);// 场地竞争力报告
  const [resourceStore, setResourceStore] = useState<any>(null);// 资源库详情

  const onTabActiveKey = (key: any) => {
    setTabActiveKey(key);
  };

  // 获取数据
  useEffect(() => {
    if (!tenantPlaceId) {
      return;
    }
    getInfo(tenantPlaceId);
    getResourceStore(); // 获取资源库商场入口详情
    getAppraisalReportInfo();// 场地竞争力报告
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantPlaceId]);

  // 获取资源库商场入口详情
  const getResourceStore = async () => {
    const { placeAnalysisTop } = await getPlaceDetailResourceStore({ placeId: tenantPlaceId });
    // console.log('资源库商场入口详情--placeAnalysisTop', placeAnalysisTop);
    placeAnalysisTop && setResourceStore(placeAnalysisTop);
  };

  // 锚点列表
  const getInfo = async (id: number) => {
    setLoading(true);
    const res = await getPlaceDetail({ placeId: id })
      .finally(() => {
        setLoading(false);
      });

    const { resourceGroupList = [], placeBasicInfo = {} } = res;
    setData(resourceGroupList);
    setDetail(placeBasicInfo);
    setActiveKey('placePicture');
  };
  // 场地竞争力报告
  const getAppraisalReportInfo = async() => {
    const res = await getAppraisalReport({ placeId: tenantPlaceId });
    setAppraisalReport(res);
  };
  const tabsItems = useMemo(() => {
    const items:any = [
      {
        key: TABS.Place,
        label: '场地信息',
      }
    ];
    if (resourceStore) {
      const resourceItems = [
        {
          key: TABS.AnalysisCompetitive,
          label: '竞争力分析',
        },
        {
          key: TABS.CityMarketAssessment,
          label: `城市市场评估`,
        },
        {
          key: TABS.AnalysisBusinessClimate,
          label: `商业氛围评估`,
        },
        {
          key: TABS.PlaceAnalysisCustomer,
          label: '客群客流评估',
        },
        {
          key: TABS.PlaceAnalysisTraffic,
          label: `交通便利评估`,
        },
      ];
      items.push(...resourceItems);
    }
    items.push({
      key: TABS.EnterBrand,
      label: '入驻品牌'
    });
    return items;
  }, [resourceStore, data]);

  return (
    <div className={styles.container}>
      <Spin tip='数据正在加载中请稍等......' spinning={loading}>
        <StickyContainer>
          <Top
            activeKey={activeKey}
            detail={detail}
            appraisalReport={appraisalReport}
            setActiveKey={setActiveKey}
          />

          {/* 资源库商场详情入口 */}
          {
            resourceStore ? (
              <div className='pl-16 pr-16'>
                <AssessInfo
                  data={resourceStore}
                />
              </div>
            ) : null
          }
          <V2Tabs
            activeKey={tabActiveKey}
            onChange={onTabActiveKey}
            destroyInactiveTabPane
            items={tabsItems}
            className='pl-16'
            style={{
              marginBottom: '0px'
            }}
            renderTabBar={renderTabBar}
          />
          {/* tabs对应的底部内容 */}
          <AssessMain
            tabActiveKey={tabActiveKey}
            data={appraisalReport}
            detailData={data}
          />
        </StickyContainer>
      </Spin>
    </div>
  );
};

export default PlaceDetail;
