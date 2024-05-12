/**
 * @Description 集客点报表列表页
 */

import { FC, useEffect, useState } from 'react';
import { Button } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Empty from '@/common/components/Data/V2Empty';
import PageTitle from '@/common/components/business/PageTitle';
import Statistics from './components/Statistics';
import Detailed from './components/Detailed/index';
import styles from './entry.module.less';
import { getReportPermission, detailedExport, statisticsExport, exportPlanSpotDetail } from '@/common/api/expandStore/planspot';
import { downloadFile, isArray } from '@lhb/func';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

/**
 * @description tabkey定义
 */
const enum TabKeyEnum {
  Statistics = 'statistics',
  Detailed = 'detailed',
  PlanSpot = 'planspot'
}

const Planspot: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [activeKey, setActiveKey] = useState('');
  const [exportPermission, setExportPermission] = useState(false);
  const [tabItems, setTabItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailedParams, setDetailedParams] = useState<any>({
    detailed: null, // 明细查询筛选项目
    planSpot: null // 集客点筛选项目
  }); // 明细查询参数
  const [targetIsLoaded, setTargetIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    getPermissions();
  }, []);

  const tabChildCom = () => {
    switch (activeKey) {
      case TabKeyEnum.Statistics:
        return <Statistics
          mainHeight={mainHeight}
          style={{
            marginTop: '20px'
          }}
        />;
      case TabKeyEnum.Detailed:
        return <Detailed
          mainHeight={mainHeight}
          setDetailedParams={setDetailedParams}
          style={{
            marginTop: '20px'
          }}
        />;
      case TabKeyEnum.PlanSpot:
        return <Detailed
          mainHeight={mainHeight}
          type='planSpot'
          setDetailedParams={setDetailedParams}
          style={{
            marginTop: '20px'
          }}
        />;
      default:
        return <V2Empty className='mt-40'/>;
    }

    // {activeKey === TabKeyEnum.Statistics ? <Statistics
    //   mainHeight={mainHeight}
    //   style={{
    //     marginTop: '20px'
    //   }}
    // /> : <></>}
    // {activeKey === TabKeyEnum.Detailed ? <Detailed
    //   mainHeight={mainHeight}
    //   setDetailedParams={setDetailedParams}
    //   style={{
    //     marginTop: '20px'
    //   }}
    // /> : <></>}
    // {activeKey === TabKeyEnum.PlanSpot ? <Detailed
    //   mainHeight={mainHeight}
    //   type='planSpot'
    //   setDetailedParams={setDetailedParams}
    //   style={{
    //     marginTop: '20px'
    //   }}
    // /> : <></>}
  };

  const getPermissions = async() => {
    const data = await getReportPermission();
    const list: any[] = isArray(data) ? data : [];
    // if (!isArray(list)) return;
    const statisticsPerm = list.find((itm: any) => itm.event === 'planSpotReport:statistics'); // 全国统计
    const detailedPerm = list.find((itm: any) => itm.event === 'planSpotReport:detailed'); // 明细查询
    const planSpotPerm = list.find((itm: any) => itm.event === 'planSpotReport:spotDetails'); // 集客点明细
    const exportPerm = list.find((itm: any) => itm.event === 'planSpotReport:export'); // 导出
    setExportPermission(!!exportPerm);

    const items: any[] = [];
    statisticsPerm && items.push({
      label: '全国统计',
      key: TabKeyEnum.Statistics,
    });
    detailedPerm && items.push({
      label: '明细查询',
      key: TabKeyEnum.Detailed,
    });
    planSpotPerm && items.push({
      label: '集客点明细',
      key: TabKeyEnum.PlanSpot,
    });
    items?.[0]?.key && setActiveKey(items.length ? items[0].key : '');
    setTabItems(items);
    setTargetIsLoaded(true);
  };

  /**
   * @description 顶部tab项发生改变
   * @param activeKey 当前点击活跃的tab的key值
   */
  const onTabChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  /**
   * @description 导出处理
   */
  const exportHandle = () => {
    // console.log('导出时detailedParams', detailedParams);
    if (!exportPermission) return;

    if ((activeKey === TabKeyEnum.Detailed && !detailedParams.detailed.branchCompanyId) ||
    (activeKey === TabKeyEnum.PlanSpot && !detailedParams.planSpot.branchCompanyId)) {
      V2Message.warning('请先选择分公司');
      return;
    }

    let exportApi: any = null;
    let params: any = {};
    if (activeKey === TabKeyEnum.Statistics) {
      // console.log('导出全国统计报表');
      exportApi = statisticsExport;
    } else if (activeKey === TabKeyEnum.Detailed) {
      // console.log('导出明细报表');
      exportApi = detailedExport;
      params = detailedParams.detailed;
    } else if (activeKey === TabKeyEnum.PlanSpot) {
      // console.log('集客点导出明细报表');
      exportApi = exportPlanSpotDetail;
      params = detailedParams.planSpot;
    }
    if (!exportApi) return;

    setLoading(true);
    exportApi(params).then(({ url, name }: any) => {
      if (url) {
        downloadFile({
          name,
          downloadUrl: url
        });
      } else {
        V2Message.warning('表格数据异常或无数据');
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className={styles.container}>
      <V2Container
        // 上下外padding各16px，上下内padding各20px，顶部标题height 48px
        style={{ height: 'calc(100vh - 32px - 40px - 48px)' }}
        emitMainHeight={h => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <PageTitle
                content='集客点报表'
                extra={
                  ((activeKey === TabKeyEnum.Statistics || activeKey === TabKeyEnum.Detailed || activeKey === TabKeyEnum.PlanSpot) && exportPermission) ? <Button type='primary' loading={loading} onClick={() => exportHandle()}>导出</Button> : <></>}
              />
              {(isArray(tabItems) && tabItems.length > 1) ? <V2Tabs
                items={tabItems}
                activeKey={activeKey}
                onChange={onTabChange}/> : null}
            </>
          )
        }}
      >
        {
          targetIsLoaded ? tabChildCom() : <></>
        }
        {/* {activeKey === TabKeyEnum.Statistics ? <Statistics
          mainHeight={mainHeight}
          style={{
            marginTop: '20px'
          }}
        /> : <></>}
        {activeKey === TabKeyEnum.Detailed ? <Detailed
          mainHeight={mainHeight}
          setDetailedParams={setDetailedParams}
          style={{
            marginTop: '20px'
          }}
        /> : <></>}
        {activeKey === TabKeyEnum.PlanSpot ? <Detailed
          mainHeight={mainHeight}
          type='planSpot'
          setDetailedParams={setDetailedParams}
          style={{
            marginTop: '20px'
          }}
        /> : <></>} */}
        {/* {(!isArray(tabItems) || !tabItems.length) ? <V2Empty/> : <></>} */}
      </V2Container>
    </div>
  );
};

export default Planspot;
