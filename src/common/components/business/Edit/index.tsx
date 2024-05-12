import React, { FC, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { Form, Popover } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Operate from '@/common/components/Others/V2Operate';
import Search from './components/Search';
import BusinessDetail from './components/BusinessDetail';
import { useMethods } from '@lhb/hook';
import { each, isArray, isDef, isNotEmpty, mapSize, refactorPermissions, urlParams } from '@lhb/func';
import IconFont from '@/common/components/Base/IconFont';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { post } from '@/common/request';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import { getSelection, getTreeSelection } from '@/common/api/networkplan';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { getSession, setSession } from '@lhb/cache';
import { amountStr } from '@/common/utils/ways';
import V2Tabs from '@/common/components/Data/V2Tabs';
import BusinessArea from './components/BusinessArea';
// 目前只有select单选、select多选、range范围 三种
// 其他都是range，就不需要在这里维护key表了。
export const selectSingleKeys = ['have_primary_school', 'have_bus_station', 'hospital_type', 'scenic_spots_level', 'isOpenStore', 'isPlanned']; // select单选类型的值
export const selectMultipleKeys = ['district_gdp_rank', 'street_stable_person', 'recommend_stores']; // select多选类型的值

const BusinessAreaType = 'BusinessAreaType';// 商区列表
const BusinessCircleType = 'BusinessCircleType'; // 商圈列表

const tabItem = [
  {
    key: BusinessAreaType,
    label: `商区列表`,
  },
  {
    key: BusinessCircleType,
    label: `商圈列表`,
  },
];

const NetworkPlanEdit: FC<any> = ({
  detail = {
    visible: true
  },
  setDetail,
  onReset,
  // 如果外面也调用了 /plan/selection 接口，就直接传进来，这里就不调用了。
  // 外部可以通过 defaultSelections={selection || {}} 来强制关闭此组件的获取接口调用。
  defaultSelections,
  isBranch,
  originPath, // 来源页面的path（由于都是/recommend/xx，所以都只传/xx)
  branchCompanyName,
}) => {
  const { branchCompanyName: _branchCompanyName } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const isJumpRef = useRef<boolean>(false);
  const isFirstRef = useRef<boolean>(true);// 用来判断是否第一次加载

  const [searchForm] = Form.useForm(); // 外显的筛选form，就两个，但是会和全部筛选里有两个重叠
  const [searchMoreForm] = Form.useForm(); // 全部筛选form，42个
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  const [businessAreaParams, setBusinessAreaParams] = useState<any>(null);// 商区列表筛选项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selections, setSelections] = useState<any>({}); // 筛选项大全
  const [totalNumber, setTotalNumber] = useState<number>(0); // 列表处 总商圈数量值
  const [statisticsData, setStatisticsData] = useState<any>({}); // 统计内容
  const [searchNum, setSearchNum] = useState<number>(0); // 全部筛选处，已经填充过的筛选项总数量
  const [curTab, setCurTab] = useState<string>(BusinessAreaType);
  const methods = useMethods({
    refactorParams(data = {}) {
      // 为了让查询动态化
      const _params = searchForm.getFieldsValue();
      const _params2 = searchMoreForm.getFieldsValue();
      const mergeParams = {
        ..._params2,
        ..._params,
        ...data
      };
      const result: any = {
        isOpenStore: mergeParams.isOpenStore, // 是否已开店，需要拉倒最外层
        isPlanned: mergeParams.isPlanned, // 是否已规划，需要拉倒最外层
        otherKeys: [],
        districtIdList: [],
        cityIds: [],
        secondLevelCategory: undefined,
        branchCompanyPlanStatus: undefined,
      };
      if (!isBranch && isNotEmpty(_params2.branchCompanyPlanStatus)) { // 总公司时
        result.branchCompanyPlanStatus = _params2?.branchCompanyPlanStatus;
      }
      if (mergeParams.districtIdList?.length) {
        // result.districtIdList = mergeParams.districtIdList.map(item => {
        //   if (Number(item[2])) {
        //     return Number(item[2]);
        //   } else {
        //     return;
        //   }
        // }); // 改为省市区三级选项了

        mergeParams.districtIdList.map(item => {
          if (!result?.districtIdList?.includes(Number(item[2])) && Number(item[2])) {
            result.districtIdList = result?.districtIdList?.length ? [...result?.districtIdList, Number(item[2])] : [Number(item[2])];
          }
          // 兼容省市的情况
          if (!result?.cityIds?.includes(Number(item[1])) && Number(item[1])) {
            result.cityIds = result?.cityIds?.length ? [...result?.cityIds, Number(item[1])] : [Number(item[1])];
          }
        });
      }
      if (mergeParams.secondLevelCategory?.length) {
        result.secondLevelCategory = mergeParams.secondLevelCategory.map(item => item[1]);
      }
      // if (isNotEmpty(mergeParams.type)) {
      result.type = mergeParams.type;
      // }
      mergeParams.districtIdList = undefined;
      mergeParams.secondLevelCategory = undefined;
      mergeParams.branchCompanyPlanStatus = null;
      // 把一些没有意义的字段移除,其他字段组装到other
      mergeParams.isOpenStore = undefined;
      mergeParams.isPlanned = undefined;
      mergeParams.type = undefined;
      each(mergeParams, (item: any, key: string) => {
        if (
          (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
          (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
        ) { // 有值的才做插入
          if (key !== 'no-mean') { // 规避掉no-mean
            const isSingleSelect = selectSingleKeys.includes(key); // 是单选select
            const isMultipleSelect = selectMultipleKeys.includes(key); // 是多选select
            const newItem: any = {
              key,
              type: isSingleSelect ? 1 : (isMultipleSelect ? 2 : 3),
            };
            if (isSingleSelect) {
              newItem.value = item;
            } else if (isMultipleSelect) {
              newItem.multiValue = item;
            } else {
              newItem.min = item[0];
              newItem.max = item[1];
            }
            result.otherKeys.push(newItem);
          }
        }
      });
      return result;
    },
    onSearch(data) {
      const result = methods.refactorParams(data);
      setParams(result);
    },
    async onFetch(_params) {
      // https://yapi.lanhanba.com/project/546/interface/api/60136
      const params = {
        branchCompanyId: detail.branchCompanyId,
        planId: detail.planId,
        ..._params,
      };
      // 解决第一次打开弹窗，快速开关弹窗的问题，接口拿不到detail数据
      if (!detail?.branchCompanyId) {
        return {
          dataSource: [],
          count: 0,
        };
      }
      // https://yapi.lanhanba.com/project/546/interface/api/60136
      const data = await post('/planCluster/pages', {
        ...params
      }, {
        needHint: true,
        // isMock: true,
        // mockId: 546,
        // mockSuffix: '/api',
      });
      setTotalNumber(data.totalNum || 0);

      // 静态数据
      const statistics = await post('/planCluster/pages/statistics', {
        branchCompanyId: detail.branchCompanyId,
        planId: detail.planId,
        ...params
      });
      setStatisticsData(statistics);

      return {
        dataSource: data.objectList,
        count: data.totalNum,
      };
    },

    onSelectChange(newSelectedRowKeys) {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    handleAdd(ids) {
      V2Confirm({
        content: `是否确定要设为${isBranch ? '规划' : '推荐'}？`,
        onSure() {
          // 加入规划
          // https://yapi.lanhanba.com/project/546/interface/api/59800
          post('/plan/add', { ids }, {
            needHint: true,
            // isMock: true,
            // mockId: 546,
            // mockSuffix: '/api',
          }).then(() => {
            V2Message.success('设置成功');
            setSelectedRowKeys([]);
            methods.onSearch();
            onReset?.();
          });
        }
      });
    },
    handleDelete(ids) {
      V2Confirm({
        content: `是否确定要取消${isBranch ? '规划' : '推荐'}`,
        onSure() {
          // 取消规划
          // https://yapi.lanhanba.com/project/546/interface/api/60108
          post('/plan/cancel', { ids }, {
            needHint: true,
            // isMock: true,
            // mockId: 546,
            // mockSuffix: '/api',
          }).then(() => {
            V2Message.success('取消成功');
            setSelectedRowKeys([]);
            methods.onSearch();
            onReset?.();
          });
        }
      });
    },
    close() {
      setDetail({
        visible: false
      });
    },
    toMap(value:any = null) {
      isJumpRef.current = true;
      methods.close();
      const isOpenStore = searchMoreForm.getFieldValue('isOpenStore');
      const isPlanned = searchMoreForm.getFieldValue('isPlanned');
      // 全部筛选需要用到的数据 保存到session，供地图模式使用
      setSession('planManagementDetail', {
        detail, // 用于表单额外数据
        // 如果没点开高级筛选是不会把外部两个筛选项带进去的，所以需要合并一下
        formData: Object.assign({}, searchMoreForm.getFieldsValue(), searchForm.getFieldsValue()), // 用于表单回显
        visible: false,
      });
      // 用于接口使用
      const urlParams = {
        planId: detail.planId,
        branchCompanyId: detail.branchCompanyId,
        isBranch: isBranch,
        otherKeys: params.otherKeys,
        isOpenStore,
        isPlanned,
        planClusterId: value?.id,
        businessAreaId: value?.businessAreaId,
        lng: value?.lng,
        lat: value?.lat,
        originPath,
        branchCompanyName: branchCompanyName || _branchCompanyName
      };
      // dispatchNavigate(`/recommend/networkplaneditmap?params=${JSON.stringify(urlParams)}`);
      dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);// 新版地图
    },
    tabChange(tab) {
      setCurTab(tab);
    }
  });
  useEffect(() => {
    if (detail.visible) {
      const sessionParams = getSession('planManagementDetail');
      if (defaultSelections) {
        setSelections(defaultSelections);
      } else {
        const promisList: any[] = [];
        // 如果外面没有传selection，就自己获取商圈和其他静态筛选合集。且只获取一次
        if (!mapSize(selections)) {
          // module 1 网规相关，2行业商圈 （通用版）
          promisList.push(getSelection({ module: 1 }));
          // module 1 网规相关，2行业商圈 （通用版）
          promisList.push(getTreeSelection({ planId: detail.planId, type: 2, module: 1 }));
        }
        promisList.push(getTreeSelection({ planId: detail.planId, type: 1, childCompanyId: detail.branchCompanyId }));
        Promise.all(promisList).then(res => {
          if (res?.length === 3) {
            setSelections({ ...res[0], businesses: res[1], cities: res[2] });
          } else {
            setSelections({ ...selections, cities: res[0] });
          }
        });
      }

      let isOpenStore;
      let isPlanned;
      let districtIdList;
      let secondLevelCategory;
      let _num = 0;
      let branchCompanyPlanStatus; // 总部视角下才会有的分公司是否已规划
      if (isDef(detail.storeStatus || sessionParams?.formData?.isOpenStore)) {
        isOpenStore = detail.storeStatus || sessionParams?.formData?.isOpenStore;
        _num++;
      }
      if (isDef(detail.planStatus || sessionParams?.formData?.isPlanned)) {
        isPlanned = detail.planStatus || sessionParams?.formData?.isPlanned;
        _num++;
      }
      if (detail.cities?.length || sessionParams?.formData?.districtIdList?.length || detail?.districtIdList?.length) {
        // const detailCityIds = detail?.cities?.map(item => [item[0].id.toString(), item[1].id.toString()]);
        // cityIds = [...detailCityIds || [], ...sessionParams?.formData?.cityIds || []];
        _num++;
        districtIdList = detail?.cities?.map(item => {
          // 兼容历史数据
          if (isArray(item)) {
            const len = item.length;
            if (len === 3) return [item[0].id.toString(), item[1].id.toString(), item[2].id.toString()]; // 1026改为筛选项为省市区了
            return [item[0].id.toString(), item[1].id.toString()]; // 兼容历史数据（省市）
          }
          return [];
        });
        districtIdList = [...districtIdList || [], ...sessionParams?.formData?.districtIdList || [], ...detail.districtIdList || []];

      }
      if (detail.industries?.length || sessionParams?.formData?.secondLevelCategory?.length) {
        secondLevelCategory = [...detail?.industries ? detail?.industries : [], ...sessionParams?.formData?.secondLevelCategory || []];
        _num++;
      }
      if (detail.branchCompanyPlanStatus || sessionParams?.formData?.branchCompanyPlanStatus) {
        branchCompanyPlanStatus = detail.branchCompanyPlanStatus || sessionParams?.formData?.branchCompanyPlanStatus;
        _num++;
      }
      // console.log('sessionParams', sessionParams);
      sessionParams?.formData && each(sessionParams?.formData, (item, key) => {
        // 排除上面几个的_num++，不然会重复计算
        if (['branchCompanyPlanStatus', 'secondLevelCategory', 'districtIdList', 'isPlanned', 'isOpenStore'].includes(key)) return;
        if (
          (isArray(item) && (item[0] || item[1])) || // 如果是数组，那至少要有其中一个值
          (!isArray(item) && isNotEmpty(item)) // 如果不是数组，就不能为空
        ) { // 有值的才做插入
          if (key !== 'no-mean') { // 规避掉 no-mean
            _num++;
          }
        }
      });
      setSearchNum(_num);
      searchForm.resetFields(); // 只要唤起抽屉，先清空原有的筛选逻辑
      searchMoreForm.resetFields();
      // 插入需要从外部传进来的参数
      searchForm.setFieldsValue({ // 外层没有开店状态和规划状态
        ...sessionParams?.formData,
        districtIdList,
        isPlanned,
        secondLevelCategory
      });
      searchMoreForm.setFieldsValue({
        ...sessionParams?.formData,
        isOpenStore,
        isPlanned,
        districtIdList,
        secondLevelCategory,
        branchCompanyPlanStatus,
      });
      // if (!_originPath) {
      //   searchForm.resetFields(); // 只要唤起抽屉，先清空原有的筛选逻辑
      //   searchMoreForm.resetFields();
      // }
      methods.onSearch({
        isOpenStore,
        isPlanned,
        districtIdList,
        secondLevelCategory,
        branchCompanyPlanStatus
      });
      // 将外部的筛选项带入商区列表的规划区域
      const { districtIdList: _districtIdList } = methods.refactorParams({ districtIdList });
      setBusinessAreaParams((state) => {
        return {
          ...state,
          districtIdList: _districtIdList
        };
      });
    }
    // 关闭且不是跳转到地图页的情况
    if (!isJumpRef.current && !detail?.visible) {
      setSession('planManagementDetail', null);
    }
  }, [detail.visible]);

  // 当切换tab的时候，从form中读取formData格式化后放入filters
  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    } ;
    const formData = methods.refactorParams(searchForm.getFieldsValue());
    setBusinessAreaParams((state) => {
      return {
        ...state,
        districtIdList: formData?.districtIdList
      };
    });
    setParams((state) => {
      return {
        ...state,
        ...formData
      };
    });
  }, [curTab]);

  const defaultColumns = [
    { key: 'provinceName', title: '省份', width: 100, dragChecked: true },
    { key: 'cityName', title: '城市', width: 100, dragChecked: true },
    { key: 'districtName', title: '城区', width: 100, dragChecked: true },
    { key: 'centerName', title: '商圈名称', width: 220, dragChecked: true, noTooltip: true, render(text, record) {
      // const loaded = false;
      return text ? (
        <Popover
          placement='topLeft'
          className='c-006 pointer'
          content={<BusinessDetail detail={record}/>}>
          <span onClick={() => methods.toMap(record)} >{text}</span>
        </Popover>
      ) : '-';
    } },
    {
      key: 'mainBrandsScore',
      title: '奶茶行业评分',
      width: 130,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'totalScore',
      title: '益禾堂评分',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'salesAmountPredict',
      title: '预测日营业额',
      width: 130,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      // render: (value) => Math.round(value) || '-'
      render: (val: number, record: any) => (<>
        {
          isNotEmpty(record?.lowSalesAmountPredict) && isNotEmpty(record?.upSalesAmountPredict) ? <>
            {amountStr(record.lowSalesAmountPredict)}-{amountStr(record.upSalesAmountPredict)}
          </> : <>
            {isNotEmpty(record?.lowSalesAmountPredict) ? amountStr(record.lowSalesAmountPredict) : ''}
            {
              !isNotEmpty(record?.lowSalesAmountPredict) && !isNotEmpty(record?.upSalesAmountPredict) ? '-' : ''
            }
            {isNotEmpty(record?.upSalesAmountPredict) ? amountStr(record.upSalesAmountPredict) : ''}
          </>
        }
      </>
      )
    },
    {
      key: 'mainBrandsProba',
      title: '奶茶行业适合度',
      width: 145,
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (value) => value || '-'
    },
    {
      key: 'proba',
      title: '品牌适合度',
      dragChecked: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => value || '-'
    },
    { key: 'firstLevelCategory', title: '商圈类型', width: 110, dragChecked: true },
    { key: 'secondLevelCategory', title: '业态', width: 100, dragChecked: true },
    {
      key: 'recommendStores',
      title: '推荐开店数',
      dragChecked: true,
      sorter: true,
      width: 130,
      render: (value) => value || '-'
    },
    {
      key: 'openStores',
      title: '已开店数',
      dragChecked: true,
      sorter: true,
      width: 130,
      render: (value) => value || '-'
    },
    // { key: 'addressName', title: '城市/城区', width: 160, dragChecked: true, render(_, record) {
    //   const res: string[] = [];
    //   if (record.cityName) {
    //     res.push(record.cityName);
    //   }
    //   if (record.districtName) {
    //     res.push(record.districtName);
    //   }
    //   return res.join('/');
    // } },
    { key: 'plannedName', title: `${isBranch ? '规划状态' : '推荐状态'}`, width: 100, dragChecked: true, whiteTooltip: true,
      render: (text, record) => {
        return <div className={styles.statusRender}>
          <IconFont
            className={cs(styles.statusRenderIcon, [
              record.planned ? styles.statusRenderIconDone : styles.statusRenderIconUnDone
            ])}
            iconHref='icon-a-bianzu131'
          />
          {text}
        </div>;
      } },
    // { key: 'firstLevelCategory', title: '商圈类型', width: 110, dragChecked: true },
    // { key: 'secondLevelCategory', title: '业态', width: 100, dragChecked: true },
    // {
    //   key: 'totalScore',
    //   title: '评分',
    //   width: 100,
    //   dragChecked: true,
    //   sorter: true,
    //   // render: (val) => Math.round(val)
    // },
    // {
    //   key: 'openStores',
    //   title: '是否已开店',
    //   width: 100,
    //   dragChecked: true,
    //   render: (val) => +val > 0 ? '已开店' : '未开店'
    // },
    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      dragDisabled: true,
      dragChecked: true,
      width: 100,
      render: (val: any[], record: any) => (
        <V2Operate
          operateList={refactorPermissions([
            !record.planned ? { event: 'plan:add', name: `${isBranch ? '设为规划' : '设为推荐'}` } : { event: 'plan:delete', name: `${isBranch ? '取消规划' : '取消推荐'}` },
          ])}
          onClick={(btn: any) => methods[btn.func]([record.id])}
        />
      )
    },
  ];
  return (
    <V2Drawer
      open={detail.visible}
      onClose={methods.close}
    >
      <div className={styles.container}>
        <V2Title>{detail?.branchCompanyName || null}规划管理</V2Title>
        <V2Container
          style={{ height: '100%', background: '#fff', overflow: 'hidden' }}
          className={styles.flexRightMain}
          emitMainHeight={(h) => setMainHeight(h)}
          extraContent={{
            top: <>
              <div className={styles.topCard}>
                <div className={styles.left}>
                  <div className={styles.card}>
                    <div className={styles.num}>{statisticsData?.total?.recommendBusinessCount || '-'}</div>
                    <div className={styles.title}>{isBranch ? '总推荐商圈' : '总商圈数'}</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.num}>{statisticsData?.total?.planBusinessCount || '-'}</div>
                    <div className={styles.title}>{isBranch ? '已规划商圈' : '已推荐商圈'}</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.num}>{statisticsData?.total?.noAddPlanBusinessCount || '-'}</div>
                    <div className={styles.title}>{isBranch ? '未规划商圈数' : '未推荐商圈'}</div>
                  </div>
                </div>
                <div className={styles.right} onClick={() => methods.toMap()}>
                  <img src='https://staticres.linhuiba.com/project-custom/locationpc/recommend/icon_map_module.png'/>
                </div>
              </div>
            </>
          }}
        >
          <V2Tabs
            items={tabItem}
            onChange={methods.tabChange}
            style={{
              marginBottom: 16
            }}
          />
          {
            curTab === BusinessAreaType
              ? <>
                <BusinessArea
                  selections={selections}
                  detail={detail}
                  form={searchForm}
                  toMap={methods.toMap}
                  setStatisticsData={setStatisticsData}
                  mainHeight={mainHeight}
                  businessAreaParams={businessAreaParams}
                  setBusinessAreaParams={setBusinessAreaParams}
                />
              </> : <></>
          }
          {
            curTab === BusinessCircleType
              ? <>
                <div style={{
                  display: selectedRowKeys?.length ? 'none' : 'block'
                }}>
                  <Search
                    // otherKeys={params.otherKeys}
                    searchForm={searchForm}
                    searchMoreForm={searchMoreForm}
                    refactorParams={methods.refactorParams}
                    setSearchNum={setSearchNum}
                    searchNum={searchNum}
                    selections={selections}
                    totalNumber={totalNumber}
                    statistics={statisticsData.statistics}
                    onSearch={methods.onSearch}
                    onReset={onReset}
                    // close={methods.close}
                    detail={detail}
                    isBranch={isBranch}/>
                </div>
                <V2Table
                  rowKey='id'
                  rowSelection={{
                    selectedRowKeys,
                    onChange: methods.onSelectChange,
                    type: 'checkbox',
                    fixed: true
                  }}
                  filters={params}
                  rowSelectionOperate={[
                    { text: `${isBranch ? '设为规划商圈' : '设为推荐商圈'}`, onClick: () => methods.handleAdd(selectedRowKeys) },
                    { text: `${isBranch ? '取消规划商圈' : '取消推荐商圈'}`, onClick: () => methods.handleDelete(selectedRowKeys) },
                  ]}
                  // 勿删! 64：分页模块总大小、48抽屉上下边距、32总共商圈数量、94+16筛选项、28分公司名称、56tabs
                  scroll={{ y: mainHeight - 64 - 48 - 32 - 110 - 28 - 56 }}
                  defaultColumns={defaultColumns}
                  // hideColumnPlaceholder
                  // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
                  // tableSortModule='ReactPCPlatformDemoV2Container01'
                  onFetch={methods.onFetch}
                  emptyRender={true}
                />
              </>
              : <></>
          }
        </V2Container>
      </div>
    </V2Drawer>
  );
};

export default NetworkPlanEdit;
