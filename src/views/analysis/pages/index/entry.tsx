// 门店分析
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import CustomerTabs from '@/common/components/business/CustomerTabs';
import FlowInfo from '@/views/overview/pages/index/components/FlowInformation';
import DateBar from '@/common/components/business/DateBar';
import IconFont from '@/common/components/IconFont';
import NotFound from '@/common/components/NotFound';

import Filters from './components/Filters';
import ManegeAnalysis from './components/ManageAnalysis';
import PassengerFlowAnalysis from './components/PassengerFlowAnalysis';
// import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import V2Title from '@/common/components/Feedback/V2Title';

import { checkIndustry, storePermission } from '@/common/api/store';
import cs from 'classnames';
import { isEqual } from '@lhb/func';
import { filterStoreTabs } from '@/common/enums/options';
import { FiltersProps } from './ts-config';
import styles from './entry.module.less';
import { usePermissionList } from '@/common/hook/usePermissionList';
import Charts from './components/ManageAnalysis/Charts';
import PieRatioCharts from './components/ManageAnalysis/Charts/PieRatioCharts';
import ClientRow from '@/views/overview/pages/index/components/ClientRow';

const StoreAnalysis = () => {
  const [hasOrderPermission, setHasOrderPermission] = useState<boolean>(true); // 是否显示订单相关的数据
  const [activeTab, setActiveTab] = useState<string>('operate');
  // 是否餐饮
  const [selStore, setSelStore] = useState<any>({}); // 当前选中门店
  const [industry, setIndustry] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersProps>({
    storeIds: 0,
    strStoredIds: '',
    start: '',
    end: '',
    dateScope: 0,
    checkTab: '',
  });
  const [clientRowCardData, setClientRowCardData] = useState<any[]>([]); // 客户规模组显示的卡片数据

  const permissionResult: any[] = usePermissionList();

  const showMonitorBth = useMemo(() => {
    return !!(permissionResult || []).find((item) => item.enCode === 'flow:enableView');
  }, [permissionResult]);

  // 改变时间
  const handleChangeTime = (start: string, end: string, dateScope: number, checkTab?: string) => {
    setFilters({ ...filters, start, end, dateScope, checkTab: checkTab || filters.checkTab });
  };

  const getCheckIndustry = async (storeId: number, date) => {
    try {
      const result = await checkIndustry({ ids: storeId });
      setIndustry(result);
    } catch (error) {
      setIndustry(false);
    }

    setFilters({
      ...filters,
      storeIds: storeId,
      strStoredIds: storeId,
      ...(date && filters.checkTab === 'customer' ? { start: date.start, end: date.end } : {}),
    });
  };

  const onSearch = (value: any) => {
    if (
      !isEqual(value.storeIds, filters.storeIds) ||
      (value?.date && (value.date.start !== filters.start || value.date.end !== filters.end))
    ) {
      getCheckIndustry(value.storeIds, value?.date);
    }
  };

  const loadPermission = async () => {
    const result = await storePermission();
    if (Array.isArray(result) && result.find((item) => item.event === 'flow:analysisOrder')) {
      return;
    }
    setHasOrderPermission(false);
    setActiveTab('passengerflow');
  };

  useEffect(() => {
    loadPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <DateBar
        hasToday
        hasYesterday
        handleChangeTime={handleChangeTime}
        checkDate={{ start: filters.start, end: filters.end, dateScope: filters.dateScope }}
      >
        <Filters
          filters={filters}
          onSearch={onSearch}
          handleChangeStore={setSelStore}
          handleChangeTime={handleChangeTime}
        />
        {filters.storeIds ? (
          <>
            <FlowInfo filters={filters} hasOrderPermission={hasOrderPermission} setClientRowCardData={setClientRowCardData}/>
            {/* <TitleTips /> */}
            <V2Title
              divider
              type='H2'
              className='mt-20'>
              <span>数据分析</span>
              <Tooltip title='如数值显示异常，请前往「订单管理」检查是否导入对应日期订单明细。'>
                <InfoCircleOutlined className='ml-5 fn-14 c-999' />
              </Tooltip>
            </V2Title>
            <ClientRow filters={filters} clientRowCardData={clientRowCardData}/>
            <CustomerTabs tabs={filterStoreTabs(hasOrderPermission)} onChange={(value) => setActiveTab(value)}>
              {showMonitorBth && (
                <Link to={`/monitoring?id=${filters.storeIds}`} className={cs(styles.extraMonitor)}>
                  <IconFont iconHref='iconxq_ic_shexiangtou_normal-copy' />
                  <span className={cs(styles.linkbtn, 'color-primary-operate')}>查看监控</span>
                </Link>
              )}
            </CustomerTabs>
            {activeTab === 'operate' && (
              <div>
                <Charts filters={filters} />
                {industry && <PieRatioCharts filters={filters} />}
              </div>
            )}
            {activeTab === 'passengerflow' && <PassengerFlowAnalysis filters={filters} store={selStore} />}
            <ManegeAnalysis
              filters={filters}
              industry={industry}
              store={selStore}
              permissionResult={permissionResult}
              hasOrderPermission={hasOrderPermission}
            />
          </>
        ) : (
          <NotFound text='暂无门店' />
        )}
      </DateBar>
    </div>
  );
};

export default StoreAnalysis;
