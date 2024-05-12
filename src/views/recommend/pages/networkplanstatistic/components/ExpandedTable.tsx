import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import V2Table from '@/common/components/Data/V2Table';
import { isArray, replaceEmpty } from '@lhb/func';
import { getStatisticListItemChild } from '@/common/api/networkplanstatistic';

// 子列表
const ExpandedTable: React.FC<any> = ({
  searchParams,
  dataColumns,
  record,
  selectChildRows,
  setSelectChildRows,
  selectParentRows,
  setSelectParentRows,
  isHeadquarters, // 是否为总部
  showSelection, // 是否展示选择器
}) => {
  const recordsRef: any = useRef([]);
  const [data, setData] = useState<any[]>([]);
  // const [selected, setSelected] = useState<any[]>(); // 选中行

  useEffect(() => {
    if (!record) return;
    if (!isArray(selectParentRows?.keys)) return;
    if (!data?.length) return;
    const { id } = record;
    const { keys } = selectParentRows;
    if (keys?.includes(id)) { // 父选中
      if (selectChildRows?.keys.length) return; // 子已有选中
      const childIds = data?.map(item => item.id);
      setSelectChildRows({
        keys: [...selectChildRows.keys, ...childIds],
        rows: selectChildRows.rows?.filter(item => !childIds.includes(item.id)).concat(data),
      });
      return;
    }
    // 清空的逻辑放在父组件
  }, [selectParentRows?.keys, record, data]);

  const methods = useMethods({
    async onFetch() {
      // showType  1 地区 2 商圈
      const { cityId, industryName, businessName, id } = record;
      const { showType } = searchParams;
      const params: any = {
        ...searchParams
      };
      if (!showType) { // 全部
        params.cityIds = [cityId];
      } else if (showType === 2) {
        params.industryNames = industryName.split(',');
        params.businessNames = businessName.split(',');
      }
      const res = await getStatisticListItemChild(params);
      const listData = isArray(res) ? res.map((item: any, index: number) => ({ ...item, isChild: true, id: `${id}-${index}` })) : [];
      setData(listData);
      recordsRef.current = listData;

      return {
        dataSource: listData,
        count: res?.length || 0,
      };
    },
    onSelectChange(values, items) {
      const childIds = recordsRef.current?.map(item => item.id);
      setSelectChildRows({
        keys: selectChildRows.keys?.filter(item => !childIds.includes(item)).concat(values),
        rows: selectChildRows.rows?.filter(item => !childIds.includes(item.id)).concat(items),
      });
      // 全选时
      if (values?.length === recordsRef.current?.length) {
        !selectParentRows.keys?.includes(record.id) && setSelectParentRows({
          keys: selectParentRows.keys?.concat(record.id),
          rows: selectParentRows.rows?.concat(record)
        });
      } else {
        setSelectParentRows({
          keys: selectParentRows.keys?.filter(item => item !== record.id),
          rows: selectParentRows.rows?.filter(item => item.id !== record.id),
        });
      }
    },
  });

  const columns = useMemo(() => {
    return [
      { title: '商圈类型', key: 'businessName', width: 120, dragChecked: true },
      { title: '业态', key: 'industryName', width: 120, dragChecked: true },
      ...dataColumns,
    ].map((item:any) => item?.render ? item : { ...item, render: (val) => replaceEmpty(val) });

  }, [isHeadquarters]);

  return (<V2Table
    rowKey='id'
    rowSelection={showSelection && {
      selectedRowKeys: selectChildRows.keys,
      type: 'checkbox',
      fixed: true,
      onChange: methods.onSelectChange,
    }}
    hideColumnPlaceholder
    defaultColumns={columns}
    onFetch={methods.onFetch}
    pagination={false}
    showBatchOperate={false}
  />);
};

export default ExpandedTable;
