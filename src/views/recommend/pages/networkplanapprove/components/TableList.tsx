/**
 * @LastEditors Please set LastEditors
 * @Date 2023-09-13 17:09
 * @LastEditTime 2023-12-19 15:12
 * @FilePath /console-pc/src/views/recommend/pages/networkplanapprove/components/TableList.tsx
 * @Description
 */
import { FC, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Filter from './Filter';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';
import { post } from '@/common/request';
import { BusinessAreaType, dataType } from '../ts-config';
import BusinessArea from './BusinessArea';

// import { defaultColumns, defaultColumns2 } from './ts-config';

const ApproveTableList: FC<any> = ({
  setIsMap,
  params,
  setParams,
  planId,
  branchCompanyId,
  hasPermissions,
  setDetailData,
  activeTab,
  setActiveTab,
  setSelectedBusinessDistrict,
}) => {

  const commonColumns = [
    {
      title: '省份',
      key: 'provinceName',
      width: 80,
    },
    {
      title: '城市',
      key: 'cityName',
      width: 80,
    },
    {
      title: '区县',
      key: 'districtName',
      width: 80,
    },
    {
      title: '商圈名称',
      key: 'centerName',
      width: 220,
      render: (value, record) => <span
        className='c-006 pointer'
        onClick={() => methods.jumpMap(record)}
      >{value}</span>
    },
    {
      title: '商圈类型',
      key: 'firstLevelCategory',
      width: 80,
    },
    {
      title: '业态',
      key: 'secondLevelCategory',
      width: 80,
    },
  ];

  const defaultColumns = [
    ...commonColumns,
    {
      title: '推荐门店数',
      key: 'recommendStores',
      width: 80,
    },
    {
      title: '评分',
      key: 'totalScore',
      width: 80,
      // render: (_) => <span>{_?.toFixed(2)}</span>,
    },
    {
      title: '是否已开店',
      key: 'isOpenStore',
      width: 80,
      render: (value) => <span>{value ? '是' : '否'}</span>,
    },
    {
      title: '状态',
      key: 'plannedName',
      width: 110,
    },
    {
      title: '新增原因',
      key: 'branchCompanyReason',
      width: 220,
      render: (value) => <span>{value || '-'}</span>,
    }
  ];

  const defaultColumns2 = [
    ...commonColumns,
    {
      title: '奶茶行业评分',
      key: 'totalScore',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => value ? value.toFixed(0) : '-',
    },
    {
      title: '益禾堂评分',
      key: 'mainBrandsScore',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => value ? value.toFixed(0) : '-',
    },
    {
      title: '预测日营业额',
      key: 'salesAmountPredict',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      width: 130,
      render: (value) => value ? value.toFixed(0) : '-',
    },
    {
      title: '品牌适合度',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      key: 'proba',
      width: 130,
    },
    {
      title: '已开门店数',
      key: 'openStores',
      width: 80,
      render: (value) => value || '-'
    },
  ];


  const [mainHeight, setMainHeight] = useState<number>(0);

  const methods = useMethods({
    onSearch(values: any) {
      setParams({ ...values });
    },
    async loadData(_params) {
      // https://yapi.lanhanba.com/project/546/interface/api/60136
      const districtIdList:any = [];
      _params.districtIdList?.map(item => {
        if (item.length === 3) {
          districtIdList.push(item[2]);
        }
      });
      const data = await post('/planCluster/pages', {
        ..._params,
        branchCompanyId: branchCompanyId,
        planId: planId,
        tab: activeTab,
        districtIdList,
        secondLevelCategory: _params.secondLevelCategory?.map(item => item?.[1]),
      }, {
        needHint: true,
        // isMock: true,
        // mockId: 546,
        // mockSuffix: '/api',
      });
      return {
        dataSource: data.objectList,
        count: data.totalNum,
      };
    },
    jumpMap(record) {
      setIsMap(true);
      setDetailData({ ...record, visible: true, listToMap: true });
    }
  });

  return (
    <V2Container
      emitMainHeight={(h) => setMainHeight(h)}
      style={{ height: `calc(100vh - ${hasPermissions ? 176 : 96}px)` }}
      extraContent={{
        top: <>
          <V2Tabs items={dataType} activeKey={activeTab} onChange={(activeKey) => {
            setParams({ ...params });
            setActiveTab(activeKey);
          }} />
          <Filter
            planId={planId}
            onSearch={methods.onSearch}
            setIsMap={setIsMap}
            branchCompanyId={branchCompanyId}
            activeTab={activeTab}
          />
        </>
      }}>
      {activeTab === BusinessAreaType
        ? <BusinessArea
          params={params}
          detail={{
            branchCompanyId: branchCompanyId,
            planId: planId,
          }}
          setIsMap={setIsMap}
          setSelectedBusinessDistrict={setSelectedBusinessDistrict}
        />
        : <V2Table
          key={activeTab}
          onFetch={methods.loadData}
          filters={params}
          defaultColumns={activeTab === '3' ? defaultColumns : defaultColumns2}
          rowKey='id'
          // scroll={{ x: 'max-content', y: 250 }}
          // 64是分页模块的总大小， 42是table头部
          scroll={{ y: mainHeight - 64 - 42 }}
        />}
    </V2Container>
  );
};

export default ApproveTableList;
