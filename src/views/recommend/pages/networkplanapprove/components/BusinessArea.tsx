/**
 * @Description 商区列表
 */
import { FC, useState } from 'react';
import styles from './index.module.less';
import V2Table from '@/common/components/Data/V2Table';
import { getCapacityPages, getCapacityPagesTotal } from '@/common/api/networkplan';
import cs from 'classnames';
const BusinessArea:FC<any> = ({
  detail,
  mainHeight,
  params,
  setIsMap,
  setSelectedBusinessDistrict,
}) => {
  const [totalNum, setTotalNum] = useState<number>(0);// 总商区数
  const toMap = (record) => {
    setIsMap(true);
    setSelectedBusinessDistrict({ ...record, visible: true, listToMap: true });
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
    const districtIdList:any = [];
    _params?.districtIdList?.map((item) => {
      if (item.length === 3) {
        districtIdList.push(+item[2]);
      }
    });
    const params = {
      branchCompanyId: detail?.branchCompanyId,
      planId: detail?.planId,
      isApprovalQuery: true, // 标记当前是审批页面查询
      ..._params,
      districtIdList
    };

    const res = await Promise.all([getCapacityPages(params), getCapacityPagesTotal(params)])
      .then((res) => {
        // 设置总商圈数
        setTotalNum(res[0].totalNum);
        const firstRowTotal = {
          ...res[1],
          businessAreaId: 'firstRowTotal',
          districtName: '合计',
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
    <div className='mb-10'>
      总商区数<span className='fs-20 bold ml-8'>{totalNum}</span>
    </div>
    <V2Table
      rowKey='businessAreaId'
      filters={params}
      // 勿删! tabs56px、筛选项52px、个数总计38px
      scroll={{ y: mainHeight - 56 - 52 - 38 }}
      defaultColumns={defaultColumns}
      hideColumnPlaceholder
      onFetch={onFetch}
      emptyRender={true}
    />
  </div>;
};
export default BusinessArea;
