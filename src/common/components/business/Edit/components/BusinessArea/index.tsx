/**
 * @Description 商区列表
 */
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import { refactorSelection } from '@lhb/func';
import { Cascader } from 'antd';
import { FC, useState } from 'react';
import styles from '../../index.module.less';
import cs from 'classnames';
import V2Table from '@/common/components/Data/V2Table';
import { getCapacityPages, getCapacityPagesTotal, getStatisticsInfo } from '@/common/api/networkplan';
const BusinessArea:FC<any> = ({
  selections,
  detail,
  mainHeight,
  form,
  toMap,
  setStatisticsData,
  businessAreaParams,
  setBusinessAreaParams,
}) => {
  const [totalNum, setTotalNum] = useState<number>(0);// 总商区数

  const onSearch = () => {
    const { districtIdList } = form.getFieldsValue();
    const _districtIdList = districtIdList.map((item) => item[2]);
    setBusinessAreaParams((state) => {
      return {
        ...state,
        districtIdList: _districtIdList
      };
    });
  };

  const defaultColumns = [
    {
      key: 'name',
      title: '商区名称',
      width: 100,
      dragChecked: true,
      fixed: 'left',
      // onCell: (_, index) => ({
      //   colSpan: (index as number) === 0 ? 4 : 1,
      // }),
      render: (val, record) =>
        <span className={cs('pointer', record?.businessAreaId !== 'firstRowTotal' ? 'c-006' : '')}
          onClick={() => toMap({
            businessAreaId: record?.businessAreaId,
            lng: record?.lng,
            lat: record?.lat,
          })}>
          {val}</span>
    },
    {
      key: 'provinceName',
      title: '省份',
      width: 100,
      dragChecked: true,
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 3 : 1,
      }),
    },
    {
      key: 'cityName',
      title: '城市',
      width: 100,
      dragChecked: true,
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 0 : 1,
      }),
    },
    {
      key: 'districtName',
      title: '城区',
      width: 100,
      dragChecked: true,
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 0 : 1,
      }),
    },
    {
      key: 'planClusterNum',
      title: '对应商圈数',
      width: 130,
      dragChecked: true,
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'circleCapacity',
      title: '预测市场容量',
      dragChecked: true,
      width: 130,
      render: (value) => Math.round(value) || '-'
    },
    {
      key: 'childCompanyPlanBusinessCount',
      title: '已规划数',
      dragChecked: true,
      width: 130,
      render: (value) => value || '-'
    },
    {
      key: 'planProgress',
      title: '容量进度',
      width: 110,
      dragChecked: true
    },
  ];
  const onFetch = async(_params) => {
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

    const res = await Promise.all([getCapacityPages(params), getCapacityPagesTotal(params), getStatisticsInfo(params)])
      .then((res) => {
        // 设置总商圈数
        setTotalNum(res[0].totalNum);

        setStatisticsData(res[2]);

        const firstRowTotal = {
          ...res[1],
          businessAreaId: 'firstRowTotal',
          name: '合计',
        };
        // 返回表格数据
        return {
          dataSource: [firstRowTotal, ...res[0].objectList],
          count: res[0].totalNum,
        };
      });
    return res;
  };

  return <div className={styles.districtCon}>
    <SearchForm
      labelLength={4}
      onSearch={onSearch}
      colon={false}
      className={cs(styles.flexRightSearch, 'form-search')}
      form={form}>
      <V2FormCascader
        label='规划区域'
        name='districtIdList'
        options={refactorSelection(selections.cities, { children: 'child' })}
        config={{ multiple: true, showCheckedStrategy: Cascader.SHOW_CHILD, maxTagCount: 'responsive' }}
      />
    </SearchForm>
    <div className='mb-10'>
      总商区数<span className='fs-20 bold ml-8'>{totalNum}</span>
    </div>
    <V2Table
      rowKey='businessAreaId'
      filters={businessAreaParams}
      // 勿删! 64：分页模块总大小、48抽屉上下边距、32总共商圈数量、42+16筛选项、28分公司名称、56tabs
      scroll={{ y: mainHeight - 64 - 48 - 32 - 68 - 28 - 56 }}
      defaultColumns={defaultColumns}
      hideColumnPlaceholder
      onFetch={onFetch}
      emptyRender={true}
    />
  </div>;
};
export default BusinessArea;
