
import { FC, useEffect, useState } from 'react';
import styles from './entry.module.less';
import { beautifyThePrice, replaceEmpty, urlParams } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { Spin } from 'antd';
import TableList from './components/TableList';
import V2Container from '@/common/components/Data/V2Container';
import Search from './components/Search';
import { post } from '@/common/request';
import { getSelection, getTreeSelection } from '@/common/api/networkplan';
import { PlanStatusEnum } from './ts-config';

// 公司类型
export enum companyTypes {
  HEADQUARTERS = 1,
  BRANCH = 2
}

// 分公司规划统计列表
const Page: FC<any> = () => {

  const {
    branchCompanyId,
    planId,
    isBranch,
    isMapReturn,
    isActive
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [statisticData, setStatisticData] = useState<any>({});// 总统计数据
  const [isHeadquarters, setIsHeadquarters] = useState<boolean>(false);// 是否为总部
  const [params, setParams] = useState<any>({});
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [selection, setSelection] = useState<any>({});
  const [editable, setEditable] = useState<boolean>(false);// 是否可编辑

  useEffect(() => {
    methods.getStatisticData();
    methods.getSelection();
  }, [branchCompanyId]);

  const methods = useMethods({
    async getStatisticData() {
      setLoading(true);
      // https://yapi.lanhanba.com/project/546/interface/api/59814
      const res = await post('/plan/detail/statistics', { branchCompanyId: branchCompanyId }, { isMock: false, mockId: 546, mockSuffix: '/api', }).finally(() => {
        setLoading(false);
      });
      setStatisticData({
        ...res,
        companyName: res.branchCompanyName,
        data: isBranch ? [
          { label: '总推荐商圈量', value: res.recommendBusinessCount },
          { label: '总推荐开店数', value: res.recommendStoreCount },
          { label: '已开商圈数', value: res.openBusinessCount },
          { label: '未开商圈数', value: res.unOpenBusinessCount },
          { label: '已开店数', value: res.openStoreCount	 },
          { label: '未开门店数', value: res.unOpenStoreCount },
        ] : [
          { label: '总商圈数', value: res.recommendBusinessCount },
          // { label: '总推荐开店数', value: res.recommendStoreCount },
          { label: '已开商圈数', value: res.openBusinessCount },
          // { label: '未开商圈数', value: res.unOpenBusinessCount },
          { label: '已开店数', value: res.openStoreCount	 },
          // { label: '未开门店数', value: res.unOpenStoreCount },
        ]
      });
      setIsHeadquarters(res.companyType === companyTypes.HEADQUARTERS);
      // 审批中、审批通过、生效中不可编辑
      setEditable(!(res.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(res?.status)));
    },
    getSelection() {
      Promise.all([
        // module 1 网规相关，2行业商圈 （通用版）
        getSelection({ module: 1 }),
        getTreeSelection({ planId, type: 2, module: 1 }),
        getTreeSelection({ planId, type: 1, childCompanyId: branchCompanyId }),
      ]).then(res => {
        setSelection({ ...res[0], businesses: res[1], cities: res[2] });
      });
    },
    onSearch(values:any) {
      console.log(`setParamssetParams`, values);
      setParams({ ...values });
    },
    onReset() {
      methods.getStatisticData();
      setParams({ ...params });
    }
  });

  return (<div className={styles.container}>
    <Spin spinning={loading}>
      <div className='statistic-wrapper'>
        {replaceEmpty(statisticData.companyName)}管辖区域总量统计如下
        <div className='statistic-data'>
          {
            statisticData?.data?.map((item, index) => <div key={index}>
              <div className='value'>{beautifyThePrice(item.value, ',', 0)}</div>
              <div className='title'>{replaceEmpty(item.label)}</div>
            </div>)
          }
        </div>
      </div>
    </Spin>

    <V2Container
      className='bg-fff pd-16'
      style={{ height: 'calc(100vh - 80px - 121px)' }}
      extraContent={{
        top: <div style={{ display: !showSearch ? 'none' : '' }}>
          <Search
            selection={selection}
            onSearch={methods.onSearch}
            isBranch={isBranch}
          />
        </div>,
      }}
    >
      {/* 列表 */}
      <TableList
        statisticData={statisticData}
        params={params}
        isHeadquarters={isHeadquarters}
        branchCompanyId={branchCompanyId}
        setShowSearch={setShowSearch}
        onReset={methods.onReset}
        planId={planId}
        editable={editable}
        selection={selection}
        isBranch={isBranch}
        isMapReturn={isMapReturn}
        isActive={isActive}
      />
    </V2Container>
  </div>);
};

export default Page;
