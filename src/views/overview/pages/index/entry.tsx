// 概览
import { useState, useContext, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import NotFound from '@/common/components/NotFound';
import CustomerTabs from '@/common/components/business/CustomerTabs';
import DateBar from '@/common/components/business/DateBar';
import Filters from './components/Filters';
import FlowInfo from './components/FlowInformation';
import CustomTable from './components/CustomTable';
import Charts from './components/Charts';
import RatioPieChart from './components/Charts/RatioPieChart';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';

import { isEqual } from '@lhb/func';

import { filterStoreTabs } from '@/common/enums/options';
import { FiltersProps } from './ts-config';
import { CurrentUserInfo } from '@/common/api/brief';
import UserInfoContext from '@/layout/context';
import styles from './entry.module.less';
import { getKeys } from '@/common/utils/ways';
import { storePermission } from '@/common/api/store';
import ClientRow from './components/ClientRow';

const Overview = () => {
  const [hasOrderPermission, setHasOrderPermission] = useState<boolean>(true); // 是否显示订单相关的数据
  const [filters, setFilters] = useState<FiltersProps>({
    storeIds: [],
    strStoredIds: '',
    start: '',
    end: '',
    dateScope: 0,
    checkTab: '',
  });
  const userInfo: CurrentUserInfo = useContext(UserInfoContext);
  const { moduleList } = userInfo || {};
  const [activeTab, setActiveTab] = useState<string>('operate');

  const [haveStores, setHaveStores] = useState<boolean>(false);
  const [clientRowCardData, setClientRowCardData] = useState<any[]>([]); // 客户规模组显示的卡片数据

  const showPredictBtn: boolean = useMemo(() => {
    // 如果预测页面在菜单列表中，则显示前往预测按钮
    const allUri = getKeys(userInfo.moduleList || [], [], 'uri', 'children', true);
    const havePredict = allUri.includes('/predict');
    return havePredict;
  }, [userInfo.moduleList]);

  // 改变时间
  const handleChangeTime = (start: string, end: string, dateScope: number, checkTab?: string) => {
    setFilters({ ...filters, start, end, dateScope, checkTab: checkTab || filters.checkTab });
  };

  const onSearch = (value?: any) => {
    let storeIds = value.storeIds;
    let strStore = Array.isArray(storeIds) ? storeIds.join(',') : storeIds;
    if (strStore === '-1') {
      strStore = '';
      storeIds = [];
    }
    if (
      !isEqual(storeIds, filters.storeIds) ||
      (value?.date && (value.date.start !== filters.start || value.date.end !== filters.end))
    ) {
      const params = {
        ...filters,
        ...value,
        storeIds,
        strStoredIds: strStore,
        ...(value.date && filters.checkTab === 'customer' ? { start: value.date.start, end: value.date.end } : {}),
      };
      delete params.date;
      setFilters(params);
    }
  };

  const loadPermission = async () => {
    const result = await storePermission();
    if (Array.isArray(result) && result.find((item) => item.event === 'flow:overviewOrder')) {
      return;
    }
    setHasOrderPermission(false);
    setActiveTab('passengerflow');
  };

  useEffect(() => {
    loadPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return Array.isArray(moduleList) && moduleList.length ? (
    <div className={styles.container}>
      <Alert
        message='请注意：客流检测数据传输会有15分钟左右的延时。'
        type='warning'
        showIcon
        closable
        className={styles.warnTips}
      />
      <DateBar
        hasToday
        hasYesterday
        handleChangeTime={handleChangeTime}
        checkDate={{ start: filters.start, end: filters.end, dateScope: filters.dateScope }}
      >
        <Filters
          filters={filters}
          handleChangeTime={handleChangeTime}
          onSearch={onSearch}
          setHaveStores={setHaveStores}
        />

        {haveStores && Array.isArray(filters.storeIds) ? (
          <>
            <FlowInfo filters={filters} hasOrderPermission={hasOrderPermission} showImportData={true} setClientRowCardData={setClientRowCardData} />
            <TitleTips />
            <CustomerTabs tabs={filterStoreTabs(hasOrderPermission)} onChange={(value) => setActiveTab(value)}>
              {showPredictBtn && (
                <Link to={`/predict`} className='color-primary-operate'>
                  查询预测
                  <RightOutlined />
                </Link>
              )}
            </CustomerTabs>
            <ClientRow filters={filters} clientRowCardData={clientRowCardData}/>
            <Charts activeTab={activeTab} filters={filters} />
            {hasOrderPermission && <RatioPieChart filters={filters} />}
            <CustomTable filters={filters} hasOrderPermission={hasOrderPermission}/>
          </>
        ) : (
          <NotFound text='暂无门店' />
        )}
      </DateBar>
    </div>
  ) : (
    <NotFound text='您在该企业下没有被授权的门店，请联系该企业管理员！' />
  );
};

export default Overview;
