// 概览
import { useState, useContext } from 'react';
import NotFound from '@/common/components/NotFound';
import CustomerTabs from '@/common/components/business/CustomerTabs';
import DateBar from '@/common/components/business/DateBar';
import Filters from './components/Filters';
import FlowInfo from './components/FlowInformation';
import CustomTable from './components/CustomTable';
import Charts from './components/Charts';

import { analysisTabs } from '@/common/enums/options';
import { FiltersProps } from './ts-config';
import { CurrentUserInfo } from '@/common/api/brief';
import UserInfoContext from '@/layout/context';
import styles from './entry.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { useTenantType } from '@/common/hook/business/useTenantType';
import ModalHint from '@/common/components/business/ModalHint';
import HeadAlert from '@/common/components/business/HeadAlert';

const Overview = () => {
  const [filters, setFilters] = useState<FiltersProps>({
    storeIds: [],
    cityIds: [],
    strStoredIds: '',
    start: '',
    end: '',
    dateScope: 0,
  });
  const userInfo: CurrentUserInfo = useContext(UserInfoContext);
  const { moduleList } = userInfo || {};
  const [activeTab, setActiveTab] = useState<string>('passengerflow');

  const [haveStores, setHaveStores] = useState<boolean>(false);
  // tenantStatus 0:试用企业，1：正式企业； 默认1
  const { tenantStatus } = useTenantType(); // 租户类型
  const [visible, setVisible] = useState<boolean>(false);
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
    const params = {
      ...filters,
      ...value,
      storeIds,
      strStoredIds: strStore,
    };
    console.log(params, '-------');
    setFilters(params);
  };

  return <>
    { Array.isArray(moduleList) && moduleList.length ? (
      <div className={styles.container}>
        <HeadAlert message='请注意：客流检测数据传输会有15分钟左右的延时。'/>
        <DateBar
          handleChangeTime={handleChangeTime}
          checkDate={{ start: filters.start, end: filters.end, dateScope: filters.dateScope }}
        >
          <Filters
            filters={filters}
            onSearch={onSearch}
            setHaveStores={setHaveStores}
            handleChangeTime={handleChangeTime}
          />

          {haveStores && Array.isArray(filters.storeIds) ? (
            <>
              <FlowInfo filters={filters} />
              <TitleTips showTips={false} />
              <CustomerTabs tabs={analysisTabs} onChange={(value) => setActiveTab(value)} />
              { activeTab === 'passengerflow' ? (
                <>
                  <Charts filters={filters} />
                  <CustomTable filters={filters} activeTab={activeTab} tenantStatus={tenantStatus} setVisible={setVisible}/>
                </>
              ) : <CustomTable filters={filters} activeTab={activeTab} tenantStatus={tenantStatus} setVisible={setVisible}/> }
            </>
          ) : (
            <NotFound text='暂无门店' />
          )}
        </DateBar>
      </div>
    ) : (
      <NotFound text='您在该企业下没有被授权的门店，请联系该企业管理员！' />
    )}
    <ModalHint
      visible={visible}
      setVisible={setVisible}
      content={'购买产品后，即可查看门店摄像数据'}
    />
  </>;
};

export default Overview;
