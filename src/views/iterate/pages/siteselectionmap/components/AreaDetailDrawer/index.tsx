/**
 * @Description 商圈详情抽屉
 * 目前在新版选址地图页中使用
 */
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';
import {
  tabOne,
  tabTwo,
  tabThree,
  tabFour,
  tabFive,
  tabSix,
  tabSeven,
  TaskStatus,
} from '../../ts-config';
import { getDynamicDetail } from '@/common/api/expandStore/chancepoint';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import MallTop from './MallTop';
import Top from './Top';
// import Score from './Score';
import Chancepoint from './Chancepoint';
// import Basic from './Basic';
// import Charts from './Charts';
import Surround from './Surround';
import styles from './index.module.less';
// import cs from 'classnames';
import { useMethods } from '@lhb/hook';
import { isArray, isNotEmpty, isNotEmptyAny } from '@lhb/func';
import { getModelClusterDetail, getModelClusterOverView, getModelClusterPopulation, getPDFExportStatus, /* getModelClusterSituation */ } from '@/common/api/networkplan';
import { isBottomOut } from '@/common/utils/ways';
// import Evaluations from './Evaluations';
import AreaOverview from './AreaOverview';
import AffixTabs from './AffixTabs';
import ShopBasic from './ShopBasic';
import ShopPoints from './ShopPoints';
import SettledMerchant from './Charts/SettledMerchant';
import TypeOfBusiness from './TypeOfBusiness';
import PassengerFlowPortrait from './PassengerFlowPortrait';
import CircleTaskCreateDrawer from '@/common/components/business/ExpandStore/CircleTaskCreateDrawer';
import TaskHistory from './HistoryTask';

const fixedHeight = 55.2; // 这里偷懒了，没有动态获取tabs的高度，所以不要随意进行tabs的自定义样式
// import SituationCharts from './Charts/SituationCharts';
const AreaDetailDrawer: FC<any> = ({
  drawerData,
  setDrawerData,
  onLabelChanged,
  labelOptionsChanged,
  viewChanceDetail = true, // 是否可以查看机会点详情；默认可以，从机会点页跳转过来时不允许
  pointDrawerData,
  setPointDrawerData, // 点位抽屉开关
}) => {
  const containRef: any = useRef();
  const intervalForPdfRef: any = useRef();
  const dynamicTabsRef: any = useRef();
  const dynamicTabContentRefs: any = useRef([]); // 存放各个tabs的dom
  const dynamicTabActiveRef: any = useRef(); //
  const viewTimestampRef = useRef<any>(new Date().getTime());//

  const [mainHeight, setMainHeight] = useState<number>(0);
  const [detail, setDetail] = useState<any>({}); // 详情信息
  const [ageDetail, setAgeDetail] = useState<any>({}); // 年龄分布
  const [overViewData, setOverViewData] = useState<any>(); // 概览卡片
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const [tabActive, setTabActive] = useState<string>(''); // 当前tab值
  // 只要配置了机会点表头并且有数据就显示该模块
  const [hasChanceModule, setHasChanceModule] = useState<boolean>(false); // 是否有机会点模块
  const [pdfDataStatus, setPdfDataStatus] = useState<any>(); // 商圈报告
  const [historyVisible, setHistoryVisible] = useState<boolean>(false); // 任务历史弹框
  const [showCreateDrawer, setShowCreateDrawer] = useState<boolean>(false); // 创建拓店任务是否可见

  useEffect(() => {
    const { open, id } = drawerData;
    // if (drawerData.open && drawerData.id) {
    if (open && id) {
      getDetail();
      methods.getPDFStatus();
    }
    // 关闭弹窗时，将详情数据重置
    if (!open) {
      setDetail({});
      intervalForPdfRef.current && clearInterval(intervalForPdfRef.current);
      intervalForPdfRef.current = null;
    }
  }, [drawerData]);

  useEffect(() => {
    // 打开的时候记录打开的时间
    if (drawerData?.open) {
      viewTimestampRef.current = new Date().getTime();
    } else {
      // 关闭的时候上报总时长
      const curTimestamp = new Date().getTime();
      if (viewTimestampRef.current && curTimestamp) {
        window.LHBbigdata.send({
          event_id: 'dcf71805-ed9e-a3e9-1c09-85daf0d49e02', // 事件id
          msg: {
            viewTimestamp: curTimestamp - viewTimestampRef.current
          }
        });
      }
    }
  }, [drawerData?.open]);

  useEffect(() => {
    dynamicTabActiveRef.current = tabActive;
  }, [tabActive]);
  // 是否是商场类型
  const isMallType = useMemo(() => {
    const { resourceMallFlag } = detail || {};
    return !!resourceMallFlag;
  }, [detail]);

  const tabs = useMemo(() => {
    const { resourceMallFlag, siteLocationNum } = detail || {};
    const hasPoints = isNotEmpty(siteLocationNum); // 是否配置了显示场地点位
    const targetTabs = [
      hasChanceModule ? tabOne : null,
      resourceMallFlag ? tabTwo : null,
      hasPoints ? tabThree : null,
      tabFour,
      tabFive,
      tabSix,
      tabSeven
    ];
    return targetTabs.filter((item) => !!item);
  }, [detail, hasChanceModule]);

  const createTaskPermission = useMemo(() => {
    return detail?.permissions?.find((item) => item.event === 'expandShopDirect:create');
  }, [detail?.permissions]);

  const disabledCreateTask = useMemo(() => detail?.taskStatus === TaskStatus.PROCESSING, [detail?.taskStatus]);

  const historyTaskPermission = useMemo(() => {
    const { permissions } = detail || {};
    return permissions?.find((item) => item.event === 'expandShopDirect:history');
  }, [detail]);

  useEffect(() => {
    if (!containRef.current) return;
    if (isArray(tabs) && tabs.length) {
      dynamicTabsRef.current = tabs;
      const defaultKey = tabs[0]?.key;
      setTabActive(defaultKey as string);
      // 绑定滚动监听事件
      containRef.current.addEventListener('scroll', methods.handleScroll);
    }

    return () => containRef.current && (containRef.current.removeEventListener('scroll', methods.handleScroll));
  }, [tabs]);

  const getDetail = async () => {
    setLoading(true);
    const { id } = drawerData;
    // 这里只是单纯的判断有没有机会点，没有把机会点子组件的状态提升是因为该页面需要冗余大量的state，也为了不改动原有的子组件的逻辑
    try {
      const targetData = await getDynamicDetail({
        page: 1,
        size: 1,
        modelClusterId: id,
        dynamicTemplateType: 2, // 动态表头模版类型 ： 1：机会点， 2:选址地图商圈  默认1
      });
      const { totalNum } = targetData || {};
      // 强制转为boolean值
      setHasChanceModule(!!(+totalNum > 0));
    } catch (error) {};

    Promise.all([
      getModelClusterDetail({ id }),
      getModelClusterPopulation({ id }),
      getModelClusterOverView({ id }),
      // getModelClusterSituation({ id }), //0229版本后端将数据放在 getModelClusterDetail返回
    ])
      .then(([detailRes, ageDetailRes, overview]) => {
        setDetail(detailRes);
        setAgeDetail(ageDetailRes);
        setOverViewData(overview);
      })
      .catch((error) => {
        console.error('Error fetching details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const methods = useMethods({
    getPDFStatus: async () => {
      const data = await getPDFExportStatus({
        id: drawerData.id,
        type: 1, // 1:商圈 2:机会点
      });
      // exportStatus: 1:未导出 2: 导出完成 3: 导出中
      const { exportStatus } = data;
      setPdfDataStatus(data);
      // 当前是导出中而且还未创建定时器轮训
      if (exportStatus === 3 && !intervalForPdfRef.current) {
        intervalForPdfRef.current = setInterval(() => {
          methods.getPDFStatus();
        }, 5000);
      } else if (exportStatus === 2) { // 导出完成后，清空定时器
        intervalForPdfRef.current && clearInterval(intervalForPdfRef.current);
        intervalForPdfRef.current = null;
      }
    },
    onLabelChanged() {
      onLabelChanged && onLabelChanged(); // 外部刷新回调
    },
    onCloseDrawer() {
      setDrawerData({
        open: false,
        id: '',
        rankVal: null
      });
    },
    getTabContentRefs: (el: any, index: number, key: string) => {
      dynamicTabContentRefs.current[index] = {
        el,
        key
      };
    },
    handleScroll: () => {
      const scrollTop = containRef.current.scrollTop;
      // // 所有content此时距离滚动容器的距离，需要减去吸顶部分的高度（tabs高度）和滚动距离
      const offsets = dynamicTabContentRefs.current.map((refItem) => refItem?.el?.offsetTop - fixedHeight - scrollTop);
      // // 当前tab内容所处的索引
      const activeIndex = offsets.findIndex((offset, index) => {
        const nextOffset = offsets[index + 1] || 0;
        return offset <= 0 && nextOffset > 0;
      });
      // // 当前tab，查看当前点击的tab距离顶部的距离
      const targetIndex = dynamicTabContentRefs.current.findIndex((item) => item.key === dynamicTabActiveRef.current);
      const targetOffset = targetIndex !== -1 ? offsets[targetIndex] : 0;
      if (activeIndex !== -1 && dynamicTabsRef.current?.[activeIndex]) {
        // 滚动条已经滚动到底，但是可视区域顶部还在其他tab内容区域下（最后的几个tab可能内容很少，出现在一屏）
        if (isBottomOut(containRef.current) && targetOffset > 0) {
          setTabActive(dynamicTabActiveRef.current);
          return;
        };
        const target = dynamicTabContentRefs.current[activeIndex];
        target && target.key && setTabActive(target.key);
      }
    }
  });

  return (
    <V2Drawer
      bodyStyle={{
        padding: 0,
      }}
      open={drawerData.open}
      destroyOnClose
      onClose={methods.onCloseDrawer}
    >
      <V2Container
        // 容器上下padding 0， 所以减去就是0
        style={{ height: '100vh' }}
        emitMainHeight={h => setMainHeight(h)}
        className={styles.container}
        extraContent={{
          top: isMallType ? <></> : <Top
            id={drawerData.id}
            detail={detail}
            rank={drawerData.rankVal}
            pdfDataStatus={pdfDataStatus}
            onLabelChanged={methods.onLabelChanged}
            labelOptionsChanged={labelOptionsChanged}
            getPDFStatus={methods.getPDFStatus}
            onRefresh={getDetail}
            createTaskPermission={createTaskPermission}
            disabledCreateTask={disabledCreateTask}
            historyTaskPermission={historyTaskPermission}
            setHistoryVisible={setHistoryVisible}
            setShowCreateDrawer={setShowCreateDrawer}
          />,
        }}
      >
        <div>
          <Spin spinning={loading}>
            {
              isNotEmptyAny(detail) ? <div
                ref={containRef}
                className={styles.areaDetail}
                style={{
                  height: mainHeight || 'auto',
                  padding: '0 40px 24px',
                }}>
                {
                  isMallType ? <MallTop
                    detail={detail}
                    pdfDataStatus={pdfDataStatus}
                    getPDFStatus={methods.getPDFStatus}
                    createTaskPermission={createTaskPermission}
                    disabledCreateTask={disabledCreateTask}
                    historyTaskPermission={historyTaskPermission}
                    setHistoryVisible={setHistoryVisible}
                    setShowCreateDrawer={setShowCreateDrawer}
                  /> : <></>
                }

                {
                  showCreateDrawer && <CircleTaskCreateDrawer
                    showDrawer={showCreateDrawer}
                    setShowDrawer={setShowCreateDrawer}
                    businessInfo={detail}
                    refresh={getDetail}
                    isBusiness
                  />
                }

                {/* 任务历史 */}
                <TaskHistory
                  open={historyVisible}
                  setOpen={setHistoryVisible}
                  modelClusterId={detail.id}
                />
                {/* <Score detail={detail} /> */}
                {/* 商圈的概览信息 */}
                <AreaOverview
                  detail={detail}
                  overViewData={overViewData}
                />
                {/* 吸顶的tabs */}
                <AffixTabs
                  tabs={tabs}
                  container={containRef}
                  fixedHeight={fixedHeight}
                  dynamicTabContentRefs={dynamicTabContentRefs}
                  dynamicTabActiveRef={dynamicTabActiveRef}
                  tabActive={tabActive}
                  setTabActive={setTabActive}
                />

                {
                  tabs.map((tabItem: any, index: number) => <div
                    ref={(el) => methods.getTabContentRefs(el, index, tabItem.key)}
                    key={index}
                  >
                    {/* 机会点模块 */}
                    {
                      tabItem.key === tabOne.key ? <Chancepoint
                        clusterId={drawerData.id}
                        canViewDetail={viewChanceDetail}
                      /> : <></>
                    }
                    {/* 基本信息 */}
                    { tabItem.key === tabTwo.key ? <ShopBasic detail={detail}/> : <></>}
                    {/* 点位模块 */}
                    { tabItem.key === tabThree.key ? <ShopPoints
                      num={detail?.siteLocationNum}
                      clusterId={drawerData.id}
                      pointDrawerData={pointDrawerData}
                      setPointDrawerData={setPointDrawerData}
                    /> : <></>}
                    {/* 经营业态 */}
                    {
                      tabItem.key === tabFour.key ? <TypeOfBusiness detail={detail}/> : <></>
                    }
                    {/* 入驻商户 */}
                    {
                      tabItem.key === tabFive.key ? <SettledMerchant detail={detail}/> : <></>
                    }
                    {/* 客流画像 */}
                    {
                      tabItem.key === tabSix.key ? <PassengerFlowPortrait ageDetail={ageDetail}/> : <></>
                    }
                    {/* 周边配套 */}
                    {
                      tabItem.key === tabSeven.key ? <Surround detail={detail}/> : <></>
                    }
                  </div>)
                }
                {/* 0229 由于周边数据不同步，暂时隐藏 */}
                {/* <SituationCharts
                  districtName={detail?.districtName}
                  detail={detail?.surroundingInfoVO}
                /> */}
              </div> : <></>
            }
          </Spin>
        </div>
      </V2Container>
    </V2Drawer>
  );
};

export default AreaDetailDrawer;
