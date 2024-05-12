import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { getStatisticList, getStatisticTotal } from '@/common/api/networkplanstatistic';
import V2Table from '@/common/components/Data/V2Table';
import { isNotEmpty, replaceEmpty } from '@lhb/func';
import ExpandedTable from './ExpandedTable';
import Edit from 'src/common/components/business/Edit';
import { showTypes } from '../ts-config';
import { Checkbox } from 'antd';
import styles from './../entry.module.less';
import IconFont from '@/common/components/IconFont';
import cs from 'classnames';

//  TODO: gyx 从其他页面引用
const enum storeStatus { // 开店状态
  UN_OPENED = 0,
  OPENED = 1
}
const enum planStatus { // 规划状态
  UN_PLANED = 0,
  PLANED = 1,
}

const TableList: React.FC<{
  statisticData:any
  mainHeight?: number
  params: any
  setShowSearch: Function
  isHeadquarters: boolean
  branchCompanyId: number
  onReset?: Function
  planId: number | null
  editable: boolean
  selection: any;
  isBranch: boolean;
  isMapReturn:boolean;
  isActive:boolean;
}> = ({
  statisticData,
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  params,
  setShowSearch,
  isHeadquarters, // 是否为总部
  branchCompanyId, // 分公司id
  onReset, // 获取统计数据
  planId, // 规划id
  editable, // 是否可编辑
  selection, // 筛选项大全
  isBranch, // 是否是分公司
  isMapReturn, // 是否地图页返回
  isActive// 是否生效中返回
}) => {
  const showType = params.showType;
  const hiddenCity = showType && showType !== showTypes.AREA;// 是否隐藏城市
  const hiddenBusiness = showType && showType !== showTypes.BUSINESS;// 是否隐藏商圈业态
  const tableExpendAble = !hiddenBusiness;// 列表是否可展开

  const [tableKey, setTableKey] = useState<number>(+new Date());// 用于重新渲染table
  const [selectParentRows, setSelectParentRows] = useState<any>({ rows: [], keys: [] });// 父级选中项
  const [selectChildRows, setSelectChildRows] = useState<any>({ rows: [], keys: [] });// 子级选中项
  const [editData, setEditData] = useState<any>({
    visible: !!isMapReturn && !isActive,
    branchCompanyId,
    planId,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const searchParamsRef = useRef();

  useEffect(() => {
    setShowSearch(!selectChildRows.keys?.length);
  }, [selectChildRows.keys]);

  const methods = useMethods({
    async onFetch(filter) {
      filter = {
        ...filter,
        cityIds: filter.cityIds?.map(item => item?.[1]),
        industryNames: filter.industryNames?.map(item => item?.[1])
      };
      setExpandedRowKeys([]); // 清空展开行
      const params = { ...filter, childCompanyId: branchCompanyId };
      searchParamsRef.current = params;
      // 当前页的table由原本的一个接口拆成了三个接口，合计接口、列表接口、展开行（嵌套的table）接口
      const list = getStatisticList(params);
      const total = getStatisticTotal(params);
      const res = await Promise.all([
        list,
        total,
      ]);
      const { objectList, totalNum, pageNum } = res[0];
      const totalData = res[1];
      // 赋值id
      let listData = objectList.map((item, index) => ({
        ...item,
        id: `${pageNum}-${index}`,
        // 这里只会是[]，因为child的值单独拆成一个接口去请求
        records: item.child?.map((child, childIndex) => ({ ...child, isChild: true, id: `${pageNum}-${index}-${childIndex}` })) || []
      }));
      listData = [{ businessStoreCountVO: totalData || {}, id: 'total', provinceName: '合计', businessName: '合计' }].concat(listData);
      return {
        dataSource: listData,
        count: totalNum
      };
    },
    onSelectChange(values, items) {
      setSelectParentRows({ ...selectParentRows, ...{
        rows: items, // 父级选中行
        keys: values, // 父级选中行key
      } });
    },
    // 选中框操作
    onSelectCheck(value, row) {
      const { keys, rows } = selectParentRows;
      if (keys?.includes(value)) {
        methods.onSelectChange(keys.filter(item => item !== value), rows.filter(item => item.id !== value));
        // const recordIds = row.records.map(item => item.id);
        // setSelectChildRows({
        //   keys: selectChildRows.keys?.filter(item => !recordIds?.includes(item)),
        //   rows: selectChildRows.rows?.filter(item => !recordIds?.includes(item.id))
        // });
        setSelectChildRows({
          keys: selectChildRows.keys?.filter(item => !item.includes(value)),
          rows: selectChildRows.rows?.filter(item => !item.id.includes(value))
        });
      } else {
        methods.onSelectChange(keys.concat(value), rows?.concat(row));
        // setSelectChildRows(row.records.reduce((result, item) => {
        //   if (!result.keys?.includes(item.id)) {
        //     return { rows: result.rows.concat(item), keys: result.keys.concat(item.id) };
        //   } else {
        //     return result;
        //   }
        // }, { rows: selectChildRows.rows, keys: selectChildRows.keys }));
      }
    },
    // 规划管理
    planManagement({ parentRows, childRows, extraParams }) {
      console.log(`parentRows`, parentRows);
      console.log(`childRows`, childRows);
      console.log(`params`, params);

      const editParams:{
        industries: any[]
        cities: any[]
        storeStatus: number | null
        planStatus: number | null
      } = Object.assign({
        industries: [], // 业态
        cities: [], // 城市
        storeStatus: null, // 开店状态
        planStatus: null, // 规划状态
      }, extraParams);
      // 仅展示城市 (不需要传参商圈和业态)
      if (hiddenBusiness) {
        if (parentRows?.length) {
          parentRows?.forEach(item => {
            if (item.cityId && !editParams.cities.some((itm) => itm[1]?.id === item.cityId)) {
              editParams.cities.push([{ id: item.provinceId, name: item.provinceName }, { id: item.cityId, name: item.cityName }]);
            }
          });
        }
      } else {
        if (childRows?.length) {
          childRows?.forEach(item => {
            if (!hiddenCity && item.cityId && !editParams.cities.some((itm) => itm[1]?.id === item.cityId)) {
              editParams.cities.push([{ id: item.provinceId, name: item.provinceName }, { id: item.cityId, name: item.cityName }]);
            }
            if (item.industryName && !editParams.industries.some(itm => itm[1] === item.industryName)) {
              editParams.industries.push([item.businessName, item.industryName]);
            }
          });
          // 没有子级，说明业态为单个直接取父级
          parentRows?.forEach(item => {
            if (!item.records?.length) {
              if (item.industryName && !editParams.industries.some(itm => itm[1] === item.industryName)) {
                editParams.industries.push([item.businessName, item.industryName]);
              }
            }
          });
        } else if (parentRows?.length) { // 拆分接口从父一级选
          parentRows?.forEach(item => {
            if (!hiddenCity && item.cityId && !editParams.cities.some((itm) => itm[1]?.id === item.cityId)) {
              editParams.cities.push([{ id: item.provinceId, name: item.provinceName }, { id: item.cityId, name: item.cityName }]);
            }
            if (item.selectCategoryList) {
              editParams.industries.push(...item.selectCategoryList);
            }
          });
        }
      }
      // 带入筛选项过滤
      if (!editParams.industries?.length && !!params?.industryNames?.length) {
        editParams.industries = params.industryNames;
      }
      if (!editParams.cities?.length && !!params?.cityItems?.length) {
        editParams.cities = params.cityItems;
      }
      if (planId && branchCompanyId) {
        console.log(`editParamseditParamseditParams`, editParams);
        setEditData({
          ...statisticData,
          ...editParams,
          visible: true,
          branchCompanyId: branchCompanyId,
          planId: planId,
        });
      }
    },
    // 收起展开
    onExpand(expand, row) {
      if (expand) {
        setExpandedRowKeys(expandedRowKeys.concat(row.id));
      } else {
        setExpandedRowKeys(expandedRowKeys.filter(item => item !== row.id));
      }
    },
    // 重新加载
    onReset() {
      onReset && onReset();
    }
  });

  // 数据列
  const dataColumns = useMemo(() => {
    // 总部列
    const headquartersColumns = [
      { title: '总商圈数', key: 'recommendBusinessCount', dragChecked: true, isLinkEdit: true },
      // { title: '推荐门店数', key: 'recommendStoreCount', dragChecked: true, isLinkEdit: true },
      { title: '已开商圈数', key: 'openBusinessCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.OPENED } },
      { title: '已开店数', key: 'openStoreCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.OPENED } },
      { title: '覆盖率', key: 'coverageRate', dragChecked: true, render: (_, row) => {
        const val = row?.businessStoreCountVO?.['coverageRate'];
        return val ? `${val}%` : '-';
      } },
      { title: '未开商圈数', key: 'unOpenBusinessCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.UN_OPENED } },
      // { title: '未开门店数', key: 'unOpenStoreCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.UN_OPENED } },
      { title: '未推荐商圈数', key: 'noPlanBusinessCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.UN_PLANED } },
      // { title: '未规划开店数', key: 'noPlanStoreCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.UN_PLANED } },
      { title: '已推荐商圈数', key: 'planBusinessCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.PLANED } },
      { title: '已推荐开店数', key: 'planStoreCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.PLANED } },
    ];
    // 分公司列
    const BranchOfficeColumns = [
      { title: '总部规划商圈数', key: 'parentCompanyPlanBusinessCount', dragChecked: true, isLinkEdit: true },
      { title: '总部规划开店数', key: 'parentCompanyPlanStoreCount', dragChecked: true, isLinkEdit: true },
      { title: '已开商圈数', key: 'openBusinessCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.OPENED } },
      { title: '已开开店数', key: 'openStoreCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.OPENED } },
      { title: '未开商圈数', key: 'unOpenBusinessCount', dragChecked: true, isLinkEdit: true, params: { storeStatus: storeStatus.UN_OPENED } },
      { title: '分公司规划商圈数', key: 'childCompanyPlanBusinessCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.PLANED } },
      { title: '分公司规划开店数', key: 'childCompanyPlanStoreCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.PLANED } },
      { title: '剔除规划商圈数', key: 'noAddPlanBusinessCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.UN_PLANED } },
      { title: '剔除规划开店数', key: 'noAddPlanStoreCount', dragChecked: true, isLinkEdit: true, params: { planStatus: planStatus.UN_PLANED } },
    ];
    return (isHeadquarters ? headquartersColumns : BranchOfficeColumns).map((item:any) => ({
      ...item,
      width: item.width || 140,
      render: item.render ? item.render : (_, row) => {
        const val = row?.businessStoreCountVO?.[item.key];
        // 是否需要跳转详情
        if (item.isLinkEdit && editable && isNotEmpty(val)) {
          // 接口拆分成两个接口了
          return <a onClick={() => methods.planManagement({
            // parentRows: !row.isChild ? [row] : null,
            parentRows: null,
            // childRows: row.isChild ? [row] : row.records,
            childRows: [row],
            extraParams: item.params
          })}>{val}</a>;
        }
        return replaceEmpty(val);
      }
    }));
  }, [isHeadquarters, editable]);
  // 列
  const columns = useMemo(() => {
    // 更新tableKey
    setTableKey(tableKey + 1);

    return [
      { title: '省份', key: 'provinceName', width: 100, dragChecked: true, dragDisabled: true, hidden: hiddenCity, onCell: (record) => ({
        colSpan: record.id === 'total' ? (!hiddenCity && !hiddenBusiness ? 5 : 3) : 1,
      }) },
      { title: '城市', key: 'cityName', width: 100, dragChecked: true, dragDisabled: true, hidden: hiddenCity, onCell: (record) => ({
        colSpan: record.id === 'total' ? 0 : 1,
      }) },
      { title: '规划状态', key: 'planStatusName', width: 100, dragChecked: true, dragDisabled: true, hidden: hiddenCity, onCell: (record) => ({
        colSpan: record.id === 'total' ? 0 : 1 }), render: (val, row) => {
        const styleMap = {
          [planStatus.PLANED]: styles.statusRenderIconDone,
          [planStatus.UN_PLANED ]: styles.statusRenderIconUnDone
        };
        return <div className={styles.statusRender}>
          <IconFont className={cs(styles.statusRenderIcon, styleMap[row.planStatus])} iconHref='icon-a-bianzu131' />
          { val || '-' }
        </div>;
      }
      },
      { title: '商圈类型', key: 'businessName', importWidth: true, width: 320, dragChecked: true, dragDisabled: true, hidden: hiddenBusiness, onCell: (record) => ({
        colSpan: record.id === 'total' ? (hiddenCity && !hiddenBusiness ? 2 : 0) : 1,
      }) },
      { title: '业态', key: 'industryName', importWidth: true, width: 320, dragChecked: true, dragDisabled: true, hidden: hiddenBusiness, onCell: (record) => ({
        colSpan: record.id === 'total' ? 0 : 1,
      }) },
      ...dataColumns,
      { title: '操作', key: 'operate', fixed: 'right', width: 100, dragChecked: true, hidden: !editable, render: (val, row) => <a onClick={() => methods.planManagement({ parentRows: [row], childRows: row.records })}>规划管理</a> },
    ].map((item:any) => item?.render ? item : {
      ...item,
      render: (val) => replaceEmpty(val)
    }).filter(item => !item.hidden);

  }, [dataColumns, showType, editable]);

  const rowSelectionOperate = [
    { text: '批量规划管理', permission: editable, onClick: () => {

      methods.planManagement({ parentRows: selectParentRows.rows, childRows: selectChildRows.rows });
      setSelectChildRows({ rows: [], keys: [] });
      setSelectParentRows({ rows: [], keys: [] });
    } },
  ].filter(item => item.permission);

  return (<>
    <V2Table
      key={tableKey}
      rowKey='id'
      hideColumnPlaceholder
      rowClassName={(record) => `row-class-${record.id}`}
      rowSelection={rowSelectionOperate?.length && {
        selectedRowKeys: selectParentRows.keys,
        type: 'checkbox',
        fixed: true,
        renderCell: (checked, record) => record.id !== 'total' ? <Checkbox
          checked={checked}
          value={record.id}
          // indeterminate={!checked && record?.records?.some(item => selectChildRows.keys?.includes(item.id))}
          indeterminate={!checked && selectChildRows.keys.some(item => item.includes(record.id))}
          onChange={() => methods.onSelectCheck(record.id, record)}
        /> : <></>,
        onChange: methods.onSelectChange,
        hideSelectAll: true
      }}
      rowSelectionOperate={rowSelectionOperate}
      scroll={{ y: (mainHeight as number) - 64 - 42 - 20 }}
      filters={params}
      defaultColumns={columns}
      // tableSortModule='consoleRecommendNetworkPlanStatistic'
      onFetch={methods.onFetch}
      specialSelectedRowKeysLength={tableExpendAble ? selectChildRows.keys?.length : selectParentRows.keys?.length}
      expandable={tableExpendAble ? {
        expandedRowRender: (record) => <ExpandedTable
          dataColumns={dataColumns}
          record={record}
          searchParams={searchParamsRef.current}
          selectChildRows={selectChildRows}
          setSelectChildRows={setSelectChildRows}
          selectParentRows={selectParentRows}
          setSelectParentRows={setSelectParentRows}
          isHeadquarters={isHeadquarters}
          showSelection={!!rowSelectionOperate?.length}
        />,
        fixed: true,
        // 子级列表只有单条不展开
        // rowExpandable: (record) => record.id !== 'total' && record.child?.length > 1,
        rowExpandable: (record) => record.id !== 'total',
        expandedRowKeys: expandedRowKeys,
        onExpand: methods.onExpand,
        defaultExpandAllRows: true
      } : null}

    />
    <Edit
      originPath={'/networkplanstatistic'}
      detail={editData}
      setDetail={setEditData}
      defaultSelections={selection}
      onReset={methods.onReset}
      isBranch={isBranch}
      branchCompanyName={editData?.branchCompanyName}
    />
  </>);
};

export default TableList;
